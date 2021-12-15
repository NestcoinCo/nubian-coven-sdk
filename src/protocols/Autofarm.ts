import NUB from "..";
import { Abi } from "../abi";
import { Addresses } from "../addresses";
import { TransactionConfig } from 'web3-core';
import { GetTransactionConfigParams } from '../internal';

type AutoFarmParams = {
  poolId: string
  amount: string;
} & Pick<TransactionConfig, 'from' | 'gas' | 'gasPrice' | 'nonce' | 'to'>;

export default class AutoFarm {
  readonly maxValue = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    contractInstance;
    nubInstance: NUB;
    autofarmAddress: string;
    constructor(nub: NUB)
    {
      this.autofarmAddress = Addresses.protocols.autofarm.chains[nub.CHAIN_ID].versions[2].AutoFarmV2;
      this.contractInstance = new nub.web3.eth.Contract(Abi.AutoFarm, this.autofarmAddress);
      this.nubInstance = nub;
    }

    async deposit(params: AutoFarmParams){
      if(!params.from){
        params.from = await this.nubInstance.internal.getAddress();
      }
      if(!params.amount){
        throw new Error("Deposit amount not specified")  
      }
      if(!params.poolId){
        throw new Error("Pool Id not specified");
      }
      if(params.amount = this.maxValue){
        let poolInfo = await this.contractInstance.methods.poolInfo(params.poolId).call();
        let lpTokenAddress = poolInfo.want; 
        let lpTokenContract = new this.nubInstance.web3.eth.Contract(Abi.basics.erc20, lpTokenAddress);
        let balance = await lpTokenContract.methods.balanceOf(params.from).call();
        params.amount = balance;
      }

      params.to = this.autofarmAddress;
      const data = this.contractInstance.methods.deposit(params.poolId, params.amount).encodeABI();
      const txObj = await this.nubInstance.internal.getTransactionConfig({
        from: params.from,
        to: params.to,
        data,
        gas: params.gas,
        gasPrice: params.gasPrice,
        nonce: params.nonce,
        value: 0,
      } as GetTransactionConfigParams);

      return this.nubInstance.sendTransaction(txObj);
    }

    async withdraw(params: AutoFarmParams){
      if(!params.from){
        params.from = await this.nubInstance.internal.getAddress();
      }
      if(!params.amount){
        throw new Error("Withdraw amount not specified");
      }
      if(!params.poolId){
        throw new Error("Pool Id not specified");
      }

      params.to = this.autofarmAddress;
      const data = await this.contractInstance.methods.withdraw(params.poolId, params.amount).encodeABI()

      const txObj = await this.nubInstance.internal.getTransactionConfig({
        from: params.from,
        to: params.to,
        data,
        gas: params.gas,
        gasPrice: params.gasPrice,
        nonce: params.nonce,
        value: 0,
      } as GetTransactionConfigParams);
      return this.nubInstance.sendTransaction(txObj);
    }

    async harvest(params: AutoFarmParams){
      if(!params.from){
        params.from = await this.nubInstance.internal.getAddress();
      }
      if(!params.poolId){
        throw new Error("Pool Id not specified");
      }

      params.to = this.autofarmAddress;
      const data = await this.contractInstance.methods.withdraw(params.poolId, 0).encodeABI();
      const txObj = await this.nubInstance.internal.getTransactionConfig({
        from: params.from,
        to: params.to,
        data,
        gas: params.gas,
        gasPrice: params.gasPrice,
        nonce: params.nonce,
        value: 0,
      } as GetTransactionConfigParams);
      return this.nubInstance.sendTransaction(txObj);
    }
}