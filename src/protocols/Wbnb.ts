import NUB from "..";
import { Abi } from "../abi";
import { Addresses } from "../addresses";

export default class Wbnb {

    contractInstance;
    nubInstance: NUB;
    constructor(nub: NUB)
    {
      this.contractInstance = new nub.web3.eth.Contract(Abi.Wbnb, Addresses.tokens.chains[nub.CHAIN_ID].WBNB);
      this.nubInstance = nub;
    }

    async estimateWrapGas(amount: number){
      const from = (await this.nubInstance.internal.getAddress())!;
      const abi = this.nubInstance.internal.getInterface(Abi.Wbnb, "deposit")!;
      const gas = await this.nubInstance.internal.estimateGas({
        from,
        to: Addresses.tokens.chains[this.nubInstance.CHAIN_ID].WBNB,
        abi,
        value: amount,
        args: []
      })

      return {gas, price: this.nubInstance.GAS_PRICE, fee: gas * this.nubInstance.GAS_PRICE};
    }
    async wrap(amount: number){
      let from = await this.nubInstance.internal.getAddress();
      const resp = await this.contractInstance.methods.deposit(amount).send({from});
      return resp;
    }

    async estimateUnWrapGas(amount: number){
      const from = (await this.nubInstance.internal.getAddress())!;
      const abi = this.nubInstance.internal.getInterface(Abi.Wbnb, "withdraw")!;
      const gas = await this.nubInstance.internal.estimateGas({
        from,
        to: Addresses.tokens.chains[this.nubInstance.CHAIN_ID].WBNB,
        abi,
        value: 0,
        args: [amount]
      })

      return { gas, price: this.nubInstance.GAS_PRICE, fee: gas * this.nubInstance.GAS_PRICE };
    }
    async unwrap(amount: number){
      let resp;
      let from = await this.nubInstance.internal.getAddress();
      resp = await this.contractInstance.methods.withdraw(amount).send({from})
    }
  }