import Venus from ".";
import { maxUint256 } from "../../constants";
import { vTokenMapping, tokenMapping } from "../utils/venusMapping";
import { TransactionConfig } from "web3-core";
import Erc20 from "../utils/Erc20";
import BigNumber from "bignumber.js";

type DepositParams = {
  amount: number | string, 
  address: string,
  receiver?: string,
} & Pick<TransactionConfig, 'from' | 'value' | 'gas' | 'gasPrice' | 'nonce'>;

async function deposit(this: Venus, params: DepositParams) {
  let {
    receiver, address, amount,
    from, value, gas, gasPrice, nonce 
  } = params;
  if(receiver === undefined){
    receiver = await this.nub.internal.getAddress();
  }
  if( from === undefined){
    from = await this.nub.internal.getAddress();
  }

  let spells = this.nub.Spell();
  const key = Object.entries(tokenMapping).filter(([key, value]) => value === address)[0][0] as keyof typeof tokenMapping;
  const Token = new Erc20(address, this.nub.web3)
  const _amount = new BigNumber(amount).times(new BigNumber(10).pow(await Token.decimals()))

  // deposit token in Wizard
  spells.add({
    connector: "BASIC-A",
    method: "deposit",
    args: [
      address,
      _amount,
      0,
      0
    ]
  });

  // deposit token in Venus
  spells.add({
    connector: "VenusV2",
    method: "deposit",
    args: [
      key,
      maxUint256,
      0,
      0
    ]
  });

  //withdraw vToken from Wizard
  spells.add({
    connector: "BASIC-A",
    method: "withdraw",
    args: [
      vTokenMapping[key],
      maxUint256,
      receiver, 
      0,
      0
    ]
  })

  const tx = await spells.cast({from, value, gas, gasPrice, nonce });
  return tx;
}

export default deposit;