import { NUB } from '../nub';
import { Abi } from '../constants/abi';
import { Addresses } from '../constants/addresses';
import { AbiItem } from "web3-utils";
import BigNumber from "bignumber.js";

import { BASES_TO_CHECK_TRADES_AGAINST } from '../constants/swapConstants';

/**
 * generic ERC20 token methods
 */

enum ORDER{
  IN,
  OUT
}
export default class PancakeV2 {
  private version:2 = 2;
  // addresses
  public WBNB_A: string = Addresses.tokens.chains[this.nub.CHAIN_ID].WBNB;
  public BNB_A: string = Addresses.tokens.chains[this.nub.CHAIN_ID].BNB;
  public BUSD_A: string = Addresses.tokens.chains[this.nub.CHAIN_ID].BUSD;
  public ROUTER02_A: string = 
    Addresses.protocols.pancakeswap.chains[this.nub.CHAIN_ID].versions[this.version].ROUTER02;
  public FACTORY_A: string = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";

    // Addresses.protocols.pancakeswap.chains[this.nub.CHAIN_ID].versions[this.version];
  
  // abis
  public ROUTER02_ABI: AbiItem[] = Abi.pancakeswap.v2.router02;
  public ERC20_ABI: AbiItem[] = Abi.basics.erc20;
  public FACTORY_ABI: AbiItem[] = Abi.pancakeswap.v2.factory;

  // contracts
  public router = new this.nub.web3.eth.Contract(this.ROUTER02_ABI, 
    this.ROUTER02_A
  );
  public factory = new this.nub.web3.eth.Contract(this.FACTORY_ABI, 
    this.FACTORY_A
  );

  constructor(private nub: NUB) {}

  /**
   * @param {address} _d.address address
   */
  async getLpPrice(lpAddress: string) {
    const lpToken = new this.nub.web3.eth.Contract(
      Abi.pancakeswap.v2.lpToken, 
      lpAddress
    );
  
    const tokens = [await lpToken.methods.token0().call(), await lpToken.methods.token1().call()];
  
    let bnbValue = 0;
    for (let i = 0; i<2; ++i){
      if (tokens[i] === this.WBNB_A) {
        continue;
      }

      const token = new this.nub.web3.eth.Contract(this.ERC20_ABI, tokens[i]);
      const tokenDecimals = await token.methods.decimals().call();
  
      try{
        bnbValue = (await this.router.methods.getAmountsOut((new BigNumber(10)).pow(tokenDecimals), [
          tokens[i], this.WBNB_A]).call())[1];
      }catch(err){
        console.log("Error in getting BNB value", err);
      }
  
      if(bnbValue === 0) continue;
      let bnbPrice = (await 
        this.router.methods.getAmountsOut(this.nub.web3.utils.toWei("1", "ether"), 
          [this.WBNB_A, this.BUSD_A]
        ).call())[1];
      
      const lpSupply = await lpToken.methods.totalSupply().call();
  
      
      let lpBalance = await token.methods.balanceOf(lpAddress).call();
  
      bnbPrice = new BigNumber(bnbPrice);
      lpBalance = new BigNumber(lpBalance);

      const tokenPrice = bnbPrice.times(bnbValue).div(10**18).div(10**18);
  
      const totalUSDValue = (lpBalance.times(2).times(tokenPrice).div((new BigNumber(10)).pow(tokenDecimals)));
      return totalUSDValue.div(lpSupply).times(this.nub.web3.utils.toWei("1", "ether")).toFixed(2);
    }
  
    return 0;
  }

  async getRoute(tokenIn:string, tokenOut: string){
    const _tokenIn = tokenIn === this.BNB_A ? this.WBNB_A : tokenIn;
    const _tokenOut = tokenOut === this.BNB_A ? this.WBNB_A : tokenOut;
    if(_tokenIn === _tokenOut) throw new Error("TokenIn and TokenOut cannot be equal");

    const getPairs = async (token: string, bases: string[], order?: ORDER ) => {
      const pairs: [string, string][] = [];
      for(let base of bases){
        if(base === token) continue;
          const address = await this.factory.methods.getPair(token, base).call();
          address !== Addresses.genesis && pairs.push(order === ORDER.IN ? [token, base]: [base, token]);
      }
      return pairs;
    }

    let directPair = (await getPairs(_tokenIn, [_tokenOut], ORDER.IN))[0];

    const routes: string[][] = [];
    // single-hop route
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

    const getOptimalOutcome = async (routes: string[][]) => {
      let bestOutcome: [string, string[]] = ["0", []];
      for(let route of routes){
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
};
