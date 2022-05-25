import BigNumber from "bignumber.js";
import PancakeV2 from ".";
import { getTokenAddress } from '../../constants';
import { BASES_TO_CHECK_TRADES_AGAINST as bases } from './constants';
import { flatMap } from 'lodash';
import { currencyEquals, JSBI, Pair, Percent, Token, TokenAmount, Trade, } from "@pancakeswap/sdk";
import { multipleContractsSingleData } from "../../utils/multicall";
import { Abi } from "../../constants/abi";

export enum DIRECTION{
  IN = "IN",
  OUT = "OUT"
};

const ZERO_PERCENT = new Percent('0');
const ONE_HUNDRED_PERCENT = new Percent('1')

export function isTradeBetter(
  tradeA: Trade | undefined | null,
  tradeB: Trade | undefined | null,
  minimumDelta: Percent = ZERO_PERCENT,
): boolean | undefined {
  if (tradeA && !tradeB) return false
  if (tradeB && !tradeA) return true
  if (!tradeA || !tradeB) return undefined

  if (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !currencyEquals(tradeB.outputAmount.currency, tradeB.outputAmount.currency)
  ) {
    throw new Error('Trades are not comparable')
  }

  if (minimumDelta.equalTo(ZERO_PERCENT)) {
    return tradeA.executionPrice.lessThan(tradeB.executionPrice)
  }
  return tradeA.executionPrice.raw.multiply(minimumDelta.add(ONE_HUNDRED_PERCENT)).lessThan(tradeB.executionPrice)
}



async function getRoute(this: PancakeV2, tokenIn:string, tokenOut: string, 
  amount: string|number, direction: "IN" | "OUT", fresh: boolean = true): Promise<{amount: string, path: string[], 0: string, 1: string[]}> {
  const BNB = getTokenAddress("BNB", this.nub);
  const WBNB = getTokenAddress("WBNB", this.nub);
  const MAX_HOPS = 3;
  const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

  let _tokenIn = tokenIn.toLowerCase() === BNB.toLowerCase() ? WBNB : tokenIn;
  let _tokenOut = tokenOut.toLowerCase() === BNB.toLowerCase() ? WBNB : tokenOut;
  
  const [[decA], [decB]] = await multipleContractsSingleData({
    web3: this.nub.web3, 
    addresses: [_tokenIn, _tokenOut],
    method: "decimals",
    abi: Abi.basics.erc20
  });
  if(!decA || !decB) return{ amount: "", path: [], 0: "", 1: [] };


  const parsedAmount = direction === DIRECTION.IN 
    ? new BigNumber(10).pow(decA).times(amount) 
    : new BigNumber(10).pow(decB).times(amount);
  let tokenA = new Token(process.env.NODE_ENV === "test" ? 56 : this.nub.CHAIN_ID, _tokenIn, decA);
  let tokenB = new Token(process.env.NODE_ENV === "test" ? 56 : this.nub.CHAIN_ID, _tokenOut, decB);
  let basePairs = flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase]));

  const pairTokens = [
    [tokenA, tokenB],
    ...bases.map( base => [base, tokenA]),
    ...bases.map( base => [base, tokenB]),
    ...basePairs,
  ].filter( ([tokenA, tokenB]) => tokenA.address !== tokenB.address);
  
  const pairAddresses = pairTokens.map( ([tokenA, tokenB]) => Pair.getAddress(tokenA, tokenB));
  let pairs: {[key:string]: Pair} = {};

  if(fresh){
    const reserves = (await multipleContractsSingleData({
      web3: this.nub.web3,
      addresses: pairAddresses,
      method: "getReserves",
      abi: Abi.pancakeswap.v2.lpToken
    }));
    pairs = reserves.map( (reserve, index) => {
    if (reserve.length === 0) return undefined;
    const [reserve0, reserve1] = reserve;
    const [_tokenA, _tokenB] = pairTokens[index];

    const [token0, token1] = _tokenA.sortsBefore(_tokenB) ? [_tokenA, _tokenB] : [_tokenB, _tokenA];
    //@ts-ignore
    return new Pair(
      new TokenAmount(token0, new BigNumber(reserve0.hex).toFixed()), 
      new TokenAmount(token1, new BigNumber(reserve1.hex).toFixed())
    )
    })
      .filter(pair => pair !== undefined)
      .reduce<{ [pairAddress: string]: Pair }>((memo, curr) => {
        if(curr === undefined) return memo;
        memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
        return memo
      }, 
    {});
    this.pairs = {...this.pairs, ...pairs};
  }else {
      pairAddresses.forEach( address => {
      if( this.pairs[address] === undefined ) return;
      pairs[address] = this.pairs[address];
    })
  }

  let bestTradeSoFar;
  for(let i = 1; i <= MAX_HOPS && Object.values(pairs).length > 0; i++){
    const currentTrade = direction === DIRECTION.IN
      ? Trade.bestTradeExactIn(
          Object.values(pairs), 
          new TokenAmount(tokenA, 
          parsedAmount.toFixed()), 
          tokenB, 
          { maxHops: i, maxNumResults: 1 }
        )[0]
      : Trade.bestTradeExactOut(
          Object.values(pairs), 
          tokenA, 
          new TokenAmount(tokenB, 
          parsedAmount.toFixed()), 
          { maxHops: i, maxNumResults: 1 }
        )[0];
    if (!currentTrade) continue;
    bestTradeSoFar = 
      bestTradeSoFar && isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD) 
        ? currentTrade 
        : (bestTradeSoFar ?? currentTrade);
  }

  if(bestTradeSoFar === undefined) return { amount: "", path: [], 0: "", 1: [] };

  const path = bestTradeSoFar.route.path.map((token) => token.address);

  // replace BNB addresses
  path[0] = tokenIn.toLowerCase() === BNB.toLowerCase() 
    ? tokenIn : path[0];
  path[path.length-1] = tokenOut.toLowerCase() === BNB.toLowerCase() 
    ? tokenOut : path[path.length-1];

  const _amount = direction === DIRECTION.IN ? bestTradeSoFar.outputAmount.toFixed() : bestTradeSoFar.inputAmount.toFixed();

  return {
    0: _amount,
    1: path,
    amount: _amount,
    path
  }
}

export default getRoute;
