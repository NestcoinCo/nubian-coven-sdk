import BigNumber from "bignumber.js";
import PancakeV2 from ".";
import { Addresses, maxUint256 } from "../../constants";
import {Abi} from "../../constants/abi";
import { TransactionConfig } from "web3-core";
import Erc20 from "../utils/Erc20";
import Bnb from "../utils/Bnb";

type WithdrawParams = {
  lpToken: string,
  amount: number | string,
  slippage?: number,
  receiver?: string,
} & Pick<TransactionConfig, 'from' | 'value' | 'gas' | 'gasPrice' | 'nonce'>;;


async function withdraw(this: PancakeV2, params: WithdrawParams){
  let {
    slippage, amount, receiver, lpToken,
    from, value, gas, gasPrice, nonce
  } = params;
  
  if(receiver === undefined){
    receiver = await this.nub.internal.getAddress();
  }
  if( from === undefined){
    from = await this.nub.internal.getAddress();
  }

  if(slippage === undefined){
    slippage = 2;
  }
  slippage = slippage/100;
  
  const lpAmount = new BigNumber(amount).times(new BigNumber(10).pow(18)).toFixed(0);
  const LpToken = new this.nub.web3.eth.Contract(Abi.pancakeswap.v2.lpToken, lpToken);
  const tokenA = await LpToken.methods.token0().call();
  const tokenB = await LpToken.methods.token1().call();


  let TokenA, TokenB;
  if(tokenA !== Addresses.bnb){
    TokenA = new Erc20(tokenA, this.nub.web3);
  }else{
    TokenA = new Bnb(this.nub.web3);
  } 
  if(tokenB !== Addresses.bnb){
    TokenB = new Erc20(tokenB, this.nub.web3);
  }else{
    TokenB = new Bnb(this.nub.web3);
  } 
  const {reserve0: reserveA, reserve1: reserveB} = await LpToken.methods.getReserves().call();
  const totalSupply = await LpToken.methods.totalSupply().call();

  const amountA = new BigNumber(reserveA).times(lpAmount).div(totalSupply); 
  const amountB = new BigNumber(reserveB).times(lpAmount).div(totalSupply);

  const amountB_W_Slippage = amountB.minus(new BigNumber(amountB).times(slippage));
  const amountA_W_Slippage = amountA.minus(new BigNumber(amountA).times(slippage));
  const [BDecimal, ADecimal] = [await TokenB.decimals(), await TokenA.decimals()]
  const unitBAmt = amountB_W_Slippage.div(lpAmount).times(new BigNumber(10).pow(18-BDecimal+18)).toFixed(0);
  const unitAAmt = amountA_W_Slippage.div(lpAmount).times(new BigNumber(10).pow(18-ADecimal+18)).toFixed(0);

  let spells = this.nub.Spell();

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

  // withdraw lpToken from Pancakeswap V2
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

  // withdraw tokenB from Wizard
  spells.add({
    connector: "BASIC-A",
    method: "withdraw",
    args: [
      tokenB,
      maxUint256,
      receiver, 
      0,
      0
    ]
  })

  // withdraw tokenA from Wizard
  spells.add({
    connector: "BASIC-A",
    method: "withdraw",
    args: [
      tokenA,
      maxUint256,
      receiver,
      0,
      0
    ]
  })

  const tx = await spells.cast({ from, value, gas, gasPrice, nonce })
  return tx;
}

export default withdraw;
