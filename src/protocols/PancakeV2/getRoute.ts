import BigNumber from "bignumber.js";
import PancakeV2 from ".";
import { Addresses, getTokenAddress } from '../../constants';
import { BASES_TO_CHECK_TRADES_AGAINST, INTERMEDIATE_BASES } from '../../constants/swapConstants';

enum ORDER{
  IN,
  OUT
};

async function getRoute(this: PancakeV2, tokenIn:string, tokenOut: string): Promise<[string, string[]]> {
  const BNB = getTokenAddress("BNB", this.nub);
  const WBNB = getTokenAddress("WBNB", this.nub);

  const _tokenIn = tokenIn === BNB ? WBNB : tokenIn;
  const _tokenOut = tokenOut === BNB ? WBNB : tokenOut;
  if(_tokenIn === _tokenOut) throw new Error("TokenIn and TokenOut cannot be equal");

  const getPairs = async (token: string, bases: string[], order?: ORDER ) => {
    const pairs: [string, string][] = [];
    
    await Promise.all(bases.map(async base => {
      if(base === token) return;
      const address = await this.factory.methods.getPair(token, base).call();
      // tslint:disable-next-line:no-unused-expression
      address !== Addresses.genesis && pairs.push(order === ORDER.IN ? [token, base]: [base, token]);
    }));
    return pairs;
  }

  const directPair = (await getPairs(_tokenIn, [_tokenOut], ORDER.IN))[0];

  const routes: string[][] = [];
  // single-hop route
  // tslint:disable-next-line:no-unused-expression
  directPair && routes.push(directPair);
  
  // two-hop routes
  let [tokenInPairs, tokenOutPairs]: [[string, string][], [string, string][]] = [[], []];
  [tokenInPairs, tokenOutPairs] = await Promise.all([
    getPairs(_tokenIn, BASES_TO_CHECK_TRADES_AGAINST, ORDER.IN),
    getPairs(_tokenOut, BASES_TO_CHECK_TRADES_AGAINST, ORDER.OUT)
  ]);

  tokenInPairs.forEach(pairIn => {
  tokenOutPairs.forEach(pairOut => {
      if(pairIn[1] === pairOut[0]){
        routes.push([...pairIn, _tokenOut])
      }
    })
  });

  const intermediatePairs: [string, string][] = INTERMEDIATE_BASES;

  // three-hop routes
  const intermediateRoutes: string[][] = [];
  tokenInPairs.forEach(pairIn => {
    intermediatePairs.forEach(intermediatePair => {
      if(pairIn[1] === intermediatePair[0]){
        intermediateRoutes.push([...pairIn, intermediatePair[1]])
      }
    })
  });
  intermediateRoutes.forEach(routeIn => {
    tokenOutPairs.forEach(pairOut => {
      if(routeIn[2] === pairOut[0]){
        routes.push([...routeIn, _tokenOut])
      }
    })
  })

  const getOptimalOutcome = async (_routes: string[][]) => {
    let bestOutcome: [string, string[]] = ["0", []];
    let outcomes : [string, string[]][] = [];
    await Promise.all(_routes.map(async (route, index) => {
      const tokenContract = new this.nub.web3.eth.Contract(this.ERC20_ABI, _tokenIn);
      const tokenDecimals = await tokenContract.methods.decimals().call();
      try{
        const amounts = (await this.router.methods.getAmountsOut(
          (new BigNumber(10)).pow(tokenDecimals).toFixed(), 
          route).call());
        const amount = amounts[amounts.length-1];
        console.log(index);
        outcomes.push([amount, route]);
      }catch(err){
        console.log("Error in getting amount", err);
      }
    }));
    bestOutcome = outcomes.reduce((a, b) =>  (new BigNumber(a[0])).gt(b[0]) ? a : b, ["0", ["", ""]]);

    // replaces WETH changes back to ETH
    bestOutcome[1][0] = tokenIn;
    bestOutcome[1][bestOutcome[1].length-1] = tokenOut;
    return bestOutcome;
  }

  const optimalOutcome: [string, string[]] = await getOptimalOutcome(routes);
  return optimalOutcome;
}

export default getRoute;
