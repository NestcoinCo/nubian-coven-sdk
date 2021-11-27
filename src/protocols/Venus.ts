import NUB from "..";
import { Abi } from "../abi";
import { Addresses } from "../addresses";

export default class Venus {

    contractInstance;
    nubInstance: NUB;
    constructor(nub: NUB)
    {
      this.contractInstance = new nub.web3.eth.Contract(Abi.AutoFarm, Addresses.protocols.autofarm.chains[nub.CHAIN_ID].versions[2].AutoFarmV2);
      this.nubInstance = nub;
    }

    async deposit(lpToken: string, poolId: number, amount: number){
      let from = await this.nubInstance.internal.getAddress();
      const resp = await this.contractInstance.methods.deposit(poolId, amount).send({from});
      return resp;
    }

    async withdraw(amount: number, poolId: number){
      let resp;
      let from = await this.nubInstance.internal.getAddress();
      if(amount == this.nubInstance.maxValue){
        resp = await this.contractInstance.methods.withdrawAll(poolId).send({from})
      }else{
        resp = await this.contractInstance.methods.withdraw(poolId, amount).send({from})
      }
    }

    async harvest(poolId: number)
    {
      let from = await this.nubInstance.internal.getAddress();
      const amt = await this.contractInstance.methods.pendingAUTO(poolId,from).call({from})

      if (amt != 0) {
        const resp = await this.contractInstance.methods.withdraw(poolId, 0);
        return resp;
      }
      return amt;
    }
  }