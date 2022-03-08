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
  let { receiver, from } = params;
  const { address, amount, value, gas, gasPrice, nonce } = params
  if(receiver === undefined){
    receiver = await this.nub.internal.getAddress();
  }
  if( from === undefined){
    from = await this.nub.internal.getAddress();
  }


  const key = Object.entries(tokenMapping).filter(([_, _value]) => _value === address)[0][0] as keyof typeof tokenMapping;
  const Token = new Erc20(address, this.nub.web3)
  const _amount = new BigNumber(amount).times(new BigNumber(10).pow(await Token.decimals()))

  const spells = this.nub.Spell();

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

  // withdraw vToken from Wizard
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