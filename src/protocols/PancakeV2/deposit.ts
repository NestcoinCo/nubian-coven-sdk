import BigNumber from "bignumber.js";
import PancakeV2 from ".";
import { TransactionConfig } from "web3-core";
import { Addresses, getTokenAddress, maxUint256 } from "../../constants";
import { Abi } from "../../constants/abi";

type DepositParams = {
  tokenA: string,
  tokenB: string,
  amountA: string|number|BigNumber,
  amountB: string|number|BigNumber,
  slippage?: number,
  receiver?: string,
} & Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>;;

async function deposit(this: PancakeV2, params: DepositParams) {
  let { 
    slippage, tokenA, tokenB, amountA, amountB, receiver,
    from, to, value, gas, gasPrice, nonce 
  } = params;
  
  if(receiver === undefined){
    receiver = await this.nub.internal.getAddress();
  }
  if(slippage === undefined){
    slippage = 2;
  }
  slippage = slippage/100;

  const Factory = new this.nub.web3.eth.Contract(
    Abi.pancakeswap.v2.factory, 
    Addresses.protocols.pancakeswap.chains[this.nub.CHAIN_ID].versions[2].FACTORY
  );
  const lpToken = await Factory.methods.getPair(tokenA, tokenB).call();
  if(lpToken === Addresses.genesis) throw new Error("Pair does not exist yet.");

  const unitAmt = new BigNumber(amountB).div(amountA).times(10**18).toFixed(0);
  const _slippage = (new BigNumber(10**18)).times(slippage);


  let spells = this.nub.Spell();
  
  // deposit tokenA in Wizard
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

  // deposit tokenB in Wizard
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
      maxUint256,
      unitAmt,
      _slippage,
      0,
      0
    ]
  })

  // withdraw remaining tokenB from Wizard
  spells.add({
    connector: "BASIC-A",
    method: "withdraw",
    args: [
      tokenB === Addresses.bnb ? getTokenAddress("WBNB", this.nub) : tokenB,
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
      tokenA === Addresses.bnb ? getTokenAddress("WBNB", this.nub) : tokenA,
      maxUint256,
      receiver,
      0,
      0
    ]
  })
  
  // withdraw lpToken from Wizard
  spells.add({
    connector: "BASIC-A",
    method: "withdraw",
    args: [
      lpToken,
      maxUint256,
      receiver, // address to receive lpTokens
      0,
      0
    ]
  })

  const tx = await spells.cast({ from, to, value, gas, gasPrice, nonce })
  return tx;
}

export default deposit;
