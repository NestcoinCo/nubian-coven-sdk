import BigNumber from "bignumber.js";
import PancakeV2 from ".";
import { Addresses, getTokenAddress, maxUint256 } from "../../constants";
import Erc20 from "../utils/Erc20";
import Bnb from "../utils/Bnb";
import { TransactionConfig } from "web3-core";

export type SwapParams = {
  amountA: number | string;
  amountB: number | string;
  tokenA: string;
  tokenB: string;
  path: string[];
  slippage?: number;
  receiver?: string;
} & Pick<TransactionConfig, 'from' | 'value' | 'gas' | 'gasPrice' | 'nonce'>;

async function swap(this: PancakeV2, params: SwapParams){
  let { slippage, receiver, from, value } = params;
  const { amountA, amountB, tokenA, tokenB, gas, gasPrice, nonce, path } = params
  const web3 = this.nub.web3;
  
  let TokenA;
  let TokenB;
  if(tokenA !== Addresses.bnb){
    TokenA = new Erc20(tokenA, web3);
  }else{
    TokenA = new Bnb(web3);
  }

  if(tokenB !== Addresses.bnb){
    TokenB = new Erc20(tokenB, web3);
  }else{
    TokenB = new Bnb(web3);
  }

  if(receiver === undefined){
    receiver = await this.nub.internal.getAddress();
  }
  if( from === undefined){
    from = await this.nub.internal.getAddress();
  }

  if(slippage === undefined){
    slippage = 0.02;
  }else{
    slippage = slippage/100;
  }

  const _amountA = new BigNumber(amountA).times(new BigNumber(10).pow(await TokenA.decimals()));
  const _amountB = new BigNumber(amountB).times(new BigNumber(10).pow(await TokenB.decimals()));
  const [buyDecimal, sellDecimal] = [+(await TokenB.decimals()), +(await TokenA.decimals())];
  const amountBWSlippage = (new BigNumber(_amountB)).minus(new BigNumber(_amountB).times(slippage));
  const unitAmt = amountBWSlippage.div(_amountA).times(new BigNumber(10).pow(18-buyDecimal+sellDecimal)).toFixed(0);

  const spells = this.nub.Spell();

  // deposit in Wizard
  spells.add({
    connector: "BASIC-A",
    method: "deposit",
    args: [
      tokenA,
      _amountA,
      0,
      0
    ]
  });

  // sell tokens in Pancakeswap
  spells.add({
    connector: "PancakeV2",
    method: "sell",
    args: [
      path,
      _amountA,
      unitAmt,
      0,
      0
    ]
  });  

  // withdraw token from Wizard
  spells.add({
    connector: "BASIC-A",
    method: "withdraw",
    args: [
      tokenB,
      maxUint256,
      receiver, // address to receive lpTokens
      0,
      0
    ]
  })
  if (value === undefined ) {
    value = tokenA === getTokenAddress("BNB", this.nub) ? _amountA.toFixed(0) : 0;
  }
  
  const tx = await spells.cast({ from, value, gas, gasPrice, nonce })
  return tx;
}

export default swap;