import BigNumber from "bignumber.js";
import PancakeV2 from ".";
import { Addresses, maxUint256 } from "../../constants";
import Erc20 from "../utils/Erc20";
import Bnb from "../utils/Bnb";
import { TransactionConfig } from "web3-core";

export type SwapParams = {
  amountA: number | string;
  amountB: number | string;
  tokenA: string;
  tokenB: string;
  slippage?: number,
  receiver?: string
} & Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>;


async function swap(this: PancakeV2, params: SwapParams){
  let { amountA, amountB, tokenA, tokenB, slippage, receiver,
    from, to, value, gas, gasPrice, nonce } = params;
  let web3 = this.nub.web3;
  
  let TokenA, TokenB;
  if(tokenA !== Addresses.bnb){
    TokenA = new Erc20(tokenA, web3);
  }else{
    TokenA = Bnb
  }

  if(tokenB !== Addresses.bnb){
    TokenB = new Erc20(tokenA, web3);
  }else{
    TokenB = new Erc20(tokenB, web3);
  }

  if(receiver === undefined){
    receiver = await this.nub.internal.getAddress();
  }

  if(slippage === undefined){
    slippage = 0.02;
  }else{
    slippage = slippage/100;
  }


  const amountB_W_Slippage = (new BigNumber(amountB)).minus(new BigNumber(amountB).times(slippage));
  const unitAmt = amountB_W_Slippage.div(amountA).times(10**18).toFixed(0);
  const route = (await this.getRoute(TokenA.address, TokenB.address))[1];
  const _amountA = new BigNumber(amountA).times(10 ** await TokenA.decimals());

  let spells = this.nub.Spell();

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
    connector: "Pancake",
    method: "sell",
    args: [
      route,
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

  const tx = await spells.cast({ from, to, value, gas, gasPrice, nonce })
  return tx;
}

export default swap;