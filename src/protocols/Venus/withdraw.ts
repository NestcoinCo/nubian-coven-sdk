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
    vTokenAmount = new BigNumber(vTokenAmount).times(new BigNumber(10).pow(8)).toFixed(0);
  }else {
    vTokenAmount = new BigNumber(vTokenAmount).times(new BigNumber(10).pow(8)).toFixed(0);
  }

  tokenAmount = new BigNumber(tokenAmount).times(new BigNumber(10).pow(await Token.decimals())).toFixed(0)

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

  // withdraw tokens
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
