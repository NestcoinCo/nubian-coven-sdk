import NUB from "..";
import { Abi } from "../constants/abi";
import { Addresses } from "../constants/addresses";
import { maxUint256 } from "../constants";

export default class Venus {

    contractInstance;
    nubInstance: NUB;
    constructor(nub: NUB)
    {
      this.contractInstance = new nub.web3.eth.Contract(Abi.AutoFarm, Addresses.protocols.autofarm.chains[nub.CHAIN_ID].versions[2].AutoFarmV2);
      this.nubInstance = nub;
    }

    async deposit(lpToken: string, poolId: number, amount: number){
      const from = await this.nubInstance.internal.getAddress();
      const resp = await this.contractInstance.methods.deposit(poolId, amount).send({from});
      return resp;
    }

    async withdraw(amount: number, poolId: number){
      let resp;
      const from = await this.nubInstance.internal.getAddress();
      if(amount === Number(maxUint256)){
        resp = await this.contractInstance.methods.withdrawAll(poolId).send({from})
      }else{
        resp = await this.contractInstance.methods.withdraw(poolId, amount).send({from})
      }
    }

    async harvest(poolId: number)
    {
      const from = await this.nubInstance.internal.getAddress();
      const amt = await this.contractInstance.methods.pendingAUTO(poolId,from).call({from})

      if (amt !== 0) {
        const resp = await this.contractInstance.methods.withdraw(poolId, 0);
        return resp;
      }
      return amt;
    }
  }