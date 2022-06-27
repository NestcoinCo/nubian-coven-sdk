import BigNumber from "bignumber.js";
import PancakeV2 from ".";
import { getTokenAddress } from '../../constants';
import { BASES_TO_CHECK_TRADES_AGAINST as bases } from './constants';
import { flatMap } from 'lodash';
import { CurrencyAmount, currencyEquals, Fraction, JSBI, Pair, Percent, Token, TokenAmount, Trade, } from "@pancakeswap/sdk";
import { multipleContractsSingleData } from "../../utils/multicall";
import { Abi } from "../../constants/abi";

export enum DIRECTION{
  IN = "IN",
  OUT = "OUT"
};

const ZERO_PERCENT = new Percent('0');
const ONE_HUNDRED_PERCENT = new Percent('1');
const BASE_FEE = new Percent(JSBI.BigInt(25), JSBI.BigInt(10000))
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

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

// computes price breakdown for the trade
export function computeTradePriceBreakdown(trade?: Trade | null): {
  priceImpactWithoutFee: Percent | undefined
  realizedLPFee: CurrencyAmount | undefined | null
} {
  const ONE_HUNDRED_PERCENT = new Percent(JSBI.BigInt(10000), JSBI.BigInt(10000))
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
        trade.route.pairs.reduce<Fraction>(
          (currentFee: Fraction): Fraction => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
          ONE_HUNDRED_PERCENT,
        ),
      )

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade.priceImpact.subtract(realizedLPFee) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(priceImpactWithoutFeeFraction?.numerator, priceImpactWithoutFeeFraction?.denominator)
    : undefined

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    (trade.inputAmount instanceof TokenAmount
      ? new TokenAmount(trade.inputAmount.token, realizedLPFee.multiply(trade.inputAmount.raw).quotient)
      : CurrencyAmount.ether(realizedLPFee.multiply(trade.inputAmount.raw).quotient))

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}

export function warningSeverity(priceImpact: Percent | undefined): 0 | 1 | 2 | 3 | 4 {
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1
  return 0
}

async function getRoute(
    this: PancakeV2, tokenIn:string, tokenOut: string, 
    amount: string|number, direction: "IN" | "OUT", fresh: boolean = true
  ): 
  Promise<{
    amount: string, path: string[], 
    priceImpact: number
    // for backward compatibility
    0: string, 1: string[]
  }> {
  const BNB = getTokenAddress("BNB", this.nub);
  const WBNB = getTokenAddress("WBNB", this.nub);
  const MAX_HOPS = 3;
  const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

  const _tokenIn = tokenIn.toLowerCase() === BNB.toLowerCase() ? WBNB : tokenIn;
  const _tokenOut = tokenOut.toLowerCase() === BNB.toLowerCase() ? WBNB : tokenOut;
  
  const [[decA], [decB]] = await multipleContractsSingleData({
    web3: this.nub.web3, 
    addresses: [_tokenIn, _tokenOut],
    method: "decimals",
    abi: Abi.basics.erc20
  });
  if(!decA || !decB) return{ amount: "", path: [], priceImpact: 0, 0: "", 1: [] };


  const parsedAmount = direction === DIRECTION.IN 
    ? new BigNumber(10).pow(decA).times(amount) 
    : new BigNumber(10).pow(decB).times(amount);
  const tokenA = new Token(process.env.NODE_ENV === "test" ? 56 : this.nub.CHAIN_ID, _tokenIn, decA);
  const tokenB = new Token(process.env.NODE_ENV === "test" ? 56 : this.nub.CHAIN_ID, _tokenOut, decB);
  const basePairs = flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase]));

  const pairTokens = [
    [tokenA, tokenB],
    ...bases.map( base => [base, tokenA]),
    ...bases.map( base => [base, tokenB]),
    ...basePairs,
  ].filter( ([_tokenA, _tokenB]) => _tokenA.address !== _tokenB.address);

  const pairAddresses = pairTokens.map( ([_tokenA, _tokenB]) => {return Pair.getAddress(_tokenA, _tokenB)});
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
    // @ts-ignore
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

  if(bestTradeSoFar === undefined) return { amount: "", path: [], priceImpact: 0, 0: "", 1: [] };

  const path = bestTradeSoFar.route.path.map((token) => token.address);

  // replace BNB addresses
  path[0] = tokenIn.toLowerCase() === BNB.toLowerCase() 
    ? tokenIn : path[0];
  path[path.length-1] = tokenOut.toLowerCase() === BNB.toLowerCase() 
    ? tokenOut : path[path.length-1];

  const _amount = direction === DIRECTION.IN ? bestTradeSoFar.outputAmount.toFixed() : bestTradeSoFar.inputAmount.toFixed();

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(bestTradeSoFar);
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  return {
    0: _amount,
    1: path,
    amount: _amount,
    path,
    priceImpact: priceImpactSeverity
  }
}

export default getRoute;
