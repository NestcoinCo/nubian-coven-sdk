import { NUB } from '../nub';
import axios from 'axios';
import { Abi } from '../abi';
import { Addresses } from '../addresses';
import { AbiItem } from "web3-utils";
import BigNumber from "bignumber.js";

/**
 * generic ERC20 token methods
 */

export class PancakeV2 {
  private version:2 = 2;
  // addresses
  public WBNB_A: string = Addresses.tokens.chains[this.nub.CHAIN_ID].WBNB;
  public BUSD_A: string = Addresses.tokens.chains[this.nub.CHAIN_ID].BUSD;
  public ROUTER02_A: string = Addresses.protocols.pancakeswap.chains[this.nub.CHAIN_ID].versions[this.version].ROUTER02;
  
  // abis
  public ROUTER02_ABI: AbiItem[] = Abi.protocols.pancakeswap.v2.router02;
  public ERC20_ABI: AbiItem[] = Abi.basics.erc20;

  constructor(private nub: NUB) {}

  /**
   * @param {address} _d.address address
   */
  async getLpPrice(lpAddress: string) {
    const lpToken = new this.nub.web3.eth.Contract(
      Abi.protocols.pancakeswap.v2.lpToken, 
      lpAddress
    );
    const router = new this.nub.web3.eth.Contract(this.ROUTER02_ABI, 
      this.ROUTER02_A
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
        bnbValue = (await router.methods.getAmountsOut((new BigNumber(10)).pow(tokenDecimals), [
          tokens[i], this.WBNB_A]).call())[1];
      }catch(err){
        console.log(err, "err");
      }
  
      if(bnbValue === 0) continue;
      let bnbPrice = (await 
        router.methods.getAmountsOut(this.nub.web3.utils.toWei("1", "ether"), 
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
};


