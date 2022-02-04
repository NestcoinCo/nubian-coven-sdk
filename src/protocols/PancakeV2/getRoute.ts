import BigNumber from "bignumber.js";
import PancakeV2 from ".";
import { Addresses } from '../../constants';
import { BASES_TO_CHECK_TRADES_AGAINST } from '../../constants/swapConstants';

enum ORDER{
  IN,
  OUT
};

async function getRoute(this: PancakeV2, tokenIn:string, tokenOut: string): Promise<[string, string[]]> {
  const _tokenIn = tokenIn === this.BNB_A ? this.WBNB_A : tokenIn;
  const _tokenOut = tokenOut === this.BNB_A ? this.WBNB_A : tokenOut;
  if(_tokenIn === _tokenOut) throw new Error("TokenIn and TokenOut cannot be equal");

  const getPairs = async (token: string, bases: string[], order?: ORDER ) => {
    const pairs: [string, string][] = [];
    for(const base of bases){
      if(base === token) continue;
        const address = await this.factory.methods.getPair(token, base).call();
        // tslint:disable-next-line:no-unused-expression
        address !== Addresses.genesis && pairs.push(order === ORDER.IN ? [token, base]: [base, token]);
    }
    return pairs;
  }

  const directPair = (await getPairs(_tokenIn, [_tokenOut], ORDER.IN))[0];

  const routes: string[][] = [];
  // single-hop route
  // tslint:disable-next-line:no-unused-expression
  directPair && routes.push(directPair);
  
  // two-hop routes
  let [tokenInPairs, tokenOutPairs]: [[string, string][], [string, string][]] = [[], []];
  if(routes.length === 0){
      tokenInPairs = await getPairs(_tokenIn, BASES_TO_CHECK_TRADES_AGAINST, ORDER.IN);
      tokenOutPairs = await getPairs(_tokenOut, BASES_TO_CHECK_TRADES_AGAINST, ORDER.OUT);
      tokenInPairs.forEach(pairIn => {
      tokenOutPairs.forEach(pairOut => {
        if(pairIn[1] === pairOut[0]){
          routes.push([...pairIn, _tokenOut])
        }
      })
    });
  }

  if(routes.length === 0){
    const intermediatePairs: [string, string][] = [];
    const length = BASES_TO_CHECK_TRADES_AGAINST.length;
    for(let i=0; i < length; i++){
      for(let j = i+1; j < length; j++){
        try{
          const pair = (await 
          getPairs(BASES_TO_CHECK_TRADES_AGAINST[i], [BASES_TO_CHECK_TRADES_AGAINST[j]]))[0];
          // tslint:disable-next-line:no-unused-expression
          pair && intermediatePairs.push(pair);
        }
        catch(err){
          console.log("Error in get pair", err)
        }
      }
    }

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
  };

  const getOptimalOutcome = async (_routes: string[][]) => {
    let bestOutcome: [string, string[]] = ["0", []];
    for(const route of _routes){
      const tokenContract = new this.nub.web3.eth.Contract(this.ERC20_ABI, _tokenIn);
      const tokenDecimals = await tokenContract.methods.decimals().call();
      try{
        const amounts = (await this.router.methods.getAmountsOut(
          (new BigNumber(10)).pow(tokenDecimals), 
          route).call());
        const amount = amounts[amounts.length-1];
        if((new BigNumber(amount)).gt(bestOutcome[0])) bestOutcome = [amount, route];
      }catch(err){
        console.log("Error in getting amount", err);
      }
    };

    // replaces WETH changes back to ETH
    bestOutcome[1][0] = tokenIn;
    bestOutcome[1][bestOutcome[1].length-1] = tokenOut;
    return bestOutcome;
  }
  
  const optimalOutcome: [string, string[]] = await getOptimalOutcome(routes);
  return optimalOutcome;
}

export default getRoute;
