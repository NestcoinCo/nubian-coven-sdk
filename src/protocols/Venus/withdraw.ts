import Venus from ".";
import { maxUint256 } from "../../constants";
import { vTokenMapping, tokenMapping } from "../utils/venusMapping";
import { TransactionConfig } from "web3-core";
import VToken from "../utils/VToken";
import Erc20 from "../utils/Erc20";
import BigNumber from "bignumber.js";

type WithdrawParams = {
  vTokenAddress: string,
  vTokenAmount?: number | string,
  tokenAmount?: number | string,
  receiver?: string,
} & Pick<TransactionConfig, 'from' | 'value' | 'gas' | 'gasPrice' | 'nonce'>;

async function withdraw(this: Venus, params: WithdrawParams) {
  let {
    receiver, vTokenAddress, tokenAmount, vTokenAmount,
    from, value, gas, gasPrice, nonce 
  } = params;
  if(receiver === undefined){
    receiver = await this.nub.internal.getAddress();
  }
  if(vTokenAmount === undefined && tokenAmount === undefined){
    throw new Error("Amount to withdraw must be provided.");
  }
  if( from === undefined){
    from = await this.nub.internal.getAddress();
  }

  const key = Object.entries(vTokenMapping).filter(([key, value]) => value === vTokenAddress)[0][0] as keyof typeof tokenMapping;
  const _VToken = new VToken(vTokenAddress, this.nub.web3);
  const Token = new Erc20(tokenMapping[key], this.nub.web3);

  if(!tokenAmount){ 
    tokenAmount = await _VToken.getTokens(+vTokenAmount!, String(await Token.decimals()));
  }

  if(!vTokenAmount){
    vTokenAmount = await _VToken.getVTokens(tokenAmount!, String(await Token.decimals()));
    vTokenAmount = new BigNumber(vTokenAmount).times( 10 ** 8).toString();
  }else {
    vTokenAmount = new BigNumber(vTokenAmount).times( 10 ** 8).toString();
  }

  tokenAmount = new BigNumber(tokenAmount).times(10 ** await Token.decimals()).toString()
  console.log(tokenAmount, vTokenAmount);

  let spells = this.nub.Spell();

  // deposits tokens in Wizard
  spells.add({
    connector: "BASIC-A",
    method: "deposit",
    args: [
      vTokenAddress,
      vTokenAmount,
      0,
      0
    ]
  })

  // withdraw tokems
  spells.add({
    connector: "VenusV2",
    method: "withdraw",
    args: [
      key,
      tokenAmount,
      0,
      0
    ]
  })

  // withdraw token from Wizard
  spells.add({
    connector: "BASIC-A",
    method: "withdraw",
    args: [
      tokenMapping[key],
      maxUint256,
      receiver,
      0,
      0
    ]
  })

  const tx = await spells.cast({from, value, gas, gasPrice, nonce });
  return tx;
}

export default withdraw;
