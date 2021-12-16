import { NUB } from '../nub';
import { Abi } from '../abi';
import { Addresses } from '../addresses';
import { AbiItem } from "web3-utils";
import BigNumber from "bignumber.js";
import { TransactionConfig } from 'web3-core';
import { TokenInfo } from '../data/token-info';

/**
 * @param {address} _d.token token address or symbol
 * @param {string} _d.amount token amount
 * @param {address|string} _d.from (optional) token
 * @param {number|string} _d.to (optional)
 * @param {number|string} _d.gasPrice (optional) not optional in "node"
 * @param {number|string} _d.gas (optional) not optional in "node"
 * @param {number|string} _d.nonce (optional) not optional in "node"
 */
type PancakeV2InputParams = {
  tokenA: keyof typeof TokenInfo | string;
  tokenB: keyof typeof TokenInfo | string;
  amountA: number|string;
  amountB: number|string;
  slippage: number|string;
  lpToken: keyof typeof TokenInfo | string;
  lpAmount?: number|string;
} & Pick<TransactionConfig, 'from' | 'gas' | 'gasPrice' | 'nonce' | 'to'>;

/**
 * Pancakeswap connector methods and utils
 */
export default class PancakeV2 {
  private version:2 = 2;
  readonly maxValue = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

  // addresses
  public WBNB: string = Addresses.tokens.chains[this.nub.CHAIN_ID].WBNB;
  public BNB: string = Addresses.tokens.chains[this.nub.CHAIN_ID].BNB;
  public BUSD: string = Addresses.tokens.chains[this.nub.CHAIN_ID].BUSD;
  public ROUTER02: string = Addresses.protocols.pancakeswap.chains[this.nub.CHAIN_ID].versions[this.version].ROUTER02;
  
  // abis
  public ROUTER02_ABI: AbiItem[] = Abi.pancakeswap.v2.router02;
  public ERC20_ABI: AbiItem[] = Abi.basics.erc20;

  constructor(private nub: NUB) {}

  // deposits liquidity into pancakeswap, using the Nubian Wizard
  async deposit(params: PancakeV2InputParams){
    const {tokenA, tokenB, amountA, amountB, lpToken} = params;
    const slippageInpercent = +params.slippage/100;
    const unitAmt = new BigNumber(amountB).div(amountA).times(10**18).toFixed(0);
    const slippage = (new BigNumber(10**18)).times(slippageInpercent);

    const spells = this.nub.Spell();
    // deposit in Wizard
    spells.add({
      connector: "BASIC-A",
      method: "deposit",
      args: [
        tokenA,
        amountA,
        0,
        0
      ]
    });

    // deposit in Wizard
    spells.add({
      connector: "BASIC-A",
      method: "deposit",
      args: [
        tokenB,
        amountB,
        0,
        0
      ]
    });

    // deposit tokens in Pancakeswap
    spells.add({
      connector: "PancakeV2",
      method: "deposit",
      args: [
        tokenA,
        tokenB,
        this.maxValue,
        unitAmt,
        slippage,
        0,
        0
      ]
    })

    spells.add({
      connector: "BASIC-A",
      method: "withdraw",
      args: [
        tokenA === this.BNB ? this.WBNB : tokenA,
        this.maxValue,
        await this.nub.internal.getAddress(), 
        0,
        0
      ]
    })

    spells.add({
      connector: "BASIC-A",
      method: "withdraw",
      args: [
        tokenB === this.BNB ? this.WBNB : tokenB,
        this.maxValue,
        await this.nub.internal.getAddress(), 
        0,
        0
      ]
    })
    
    spells.add({
      connector: "BASIC-A",
      method: "withdraw",
      args: [
        lpToken,
        this.maxValue,
        await this.nub.internal.getAddress(),
        0,
        0
      ]
    })

    const value = tokenA === this.BNB ? amountA : ( tokenB === this.BNB ? amountB : 0 );
    const tx = await spells.cast({
      gasPrice: params.gasPrice, 
      value
    });

    return tx;
  }

  // withdraws liquidity from pancakeswap, using the Nubian Wizard
  async withdraw(params: PancakeV2InputParams){
    const {tokenA, tokenB, amountA, amountB, lpToken, lpAmount} = params;
    if(!lpAmount){
      throw Error("Lptoken Amount not specified");
    }
    const slippageInpercent = +params.slippage/100; 
    const amountBWSlippage = (new BigNumber(amountB)).minus(new BigNumber(amountB).times(slippageInpercent));
    const amountAWSlippage = (new BigNumber(amountA)).minus(new BigNumber(amountA).times(slippageInpercent));
    const unitBAmt = amountBWSlippage.div(lpAmount).times(10**18).toFixed(0);
    const unitAAmt = amountAWSlippage.div(lpAmount).times(10**18).toFixed(0);

    const spells = this.nub.Spell();

    spells.add({
      connector: "BASIC-A",
      method: "deposit",
      args: [
        lpToken,
        lpAmount,
        0,
        0
      ]
    });

    spells.add({
      connector: "PancakeV2",
      method: "withdraw",
      args: [
        tokenA,
        tokenB,
        lpAmount,
        unitAAmt,
        unitBAmt,
        0,
        [0,0],
      ]
    })

    spells.add({
      connector: "BASIC-A",
      method: "withdraw",
      args: [
        tokenB,
        this.maxValue,
        this.nub.internal.getAddress(), 
        0,
        0
      ]
    })

    spells.add({
      connector: "BASIC-A",
      method: "withdraw",
      args: [
        tokenA,
        this.maxValue,
        this.nub.internal.getAddress(),
        0,
        0
      ]
    })

    const tx = await spells.cast({
      gasPrice: params.gasPrice
    });

    return tx;    
  }

  /**
   * @param {address} _d.address address
   */
  async getLpPrice(lpAddress: string) {
    const lpToken = new this.nub.web3.eth.Contract(
      Abi.pancakeswap.v2.lpToken, 
      lpAddress
    );
    const router = new this.nub.web3.eth.Contract(this.ROUTER02_ABI, 
      this.ROUTER02
    );
  
    const tokens = [await lpToken.methods.token0().call(), await lpToken.methods.token1().call()];
  
    let bnbValue = 0;
    for (let i = 0; i<2; ++i){
      if (tokens[i] === this.WBNB) {
        continue;
      }

      const token = new this.nub.web3.eth.Contract(this.ERC20_ABI, tokens[i]);
      const tokenDecimals = await token.methods.decimals().call();
  
      try{
        bnbValue = (await router.methods.getAmountsOut((new BigNumber(10)).pow(tokenDecimals), [
          tokens[i], this.WBNB]).call())[1];
      }catch(err){
        console.log(err, "err");
      }
  
      if(bnbValue === 0) continue;
      let bnbPrice = (await 
        router.methods.getAmountsOut(this.nub.web3.utils.toWei("1", "ether"), 
          [this.WBNB, this.BUSD]
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


