import BigNumber from "bignumber.js";
import PancakeV2 from ".";
import { maxUint256 } from "../../constants";
import {Abi} from "../../constants/abi";
import { TransactionConfig } from "web3-core";

type WithdrawParams = {
  lpToken: string,
  amount: number | string,
  slippage?: number,
  receiver?: string,
} & Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>;;


async function withdraw(this: PancakeV2, params: WithdrawParams){
  let {slippage, amount, receiver, lpToken} = params;
  if(receiver === undefined){
    receiver = await this.nub.internal.getAddress();
  }

  if(slippage === undefined){
    slippage = 2;
  }
  slippage = slippage/100;
  const lpAmount = new BigNumber(amount).times(10**18).toFixed(0);
  const LpToken = new this.nub.web3.eth.Contract(Abi.pancakeswap.v2.lpToken, lpToken);
  const tokenA = await LpToken.methods.token0().call();
  const tokenB = await LpToken.methods.token1().call();
  const {amount0: amountA, amount1: amountB} = await LpToken.methods.burn(lpAmount).call();

  const amountB_W_Slippage = (new BigNumber(amountB)).minus(new BigNumber(amountB).times(slippage));
  const amountA_W_Slippage = (new BigNumber(amountA)).minus(new BigNumber(amountA).times(slippage));
  const unitBAmt = amountB_W_Slippage.div(lpAmount).times(10**18).toFixed(0);
  const unitAAmt = amountA_W_Slippage.div(lpAmount).times(10**18).toFixed(0);


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
}

export default withdraw;
