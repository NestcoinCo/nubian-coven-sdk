import NUB from "..";
import { Abi } from "../abi";
import { Addresses } from "../addresses";

export default class Wbnb {

    contractInstance;
    nubInstance: NUB;
    constructor(nub: NUB)
    {
      this.contractInstance = new nub.web3.eth.Contract(Abi.Wbnb, Addresses.tokens.wbnb);
      this.nubInstance = nub;
    }

    public async deposit(amount: number){
      let from = await this.nubInstance.internal.getAddress();
      const resp = await this.contractInstance.methods.deposit(amount).send({from});
      return resp;
    }

    public async withdraw(amount: number){
      let resp;
      let from = await this.nubInstance.internal.getAddress();
      resp = await this.contractInstance.methods.withdraw(amount).send({from})
    }
  }