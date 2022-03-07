import NUB from "..";
import { Abi } from "../constants/abi";
import { Addresses } from "../constants/addresses";
import { TransactionConfig } from 'web3-core';
import { GetTransactionConfigParams } from "../internal";
import { getTokenAddress, maxUint256 } from "../constants";


type WbnbParams = {
  amount: number|string 
  } & Pick<TransactionConfig, 'from' | 'gas' | 'gasPrice' | 'nonce' >;

export default class Wbnb {
    contractInstance;
    nub: NUB;
    address: string;
    constructor(nub: NUB)
    {
      this.contractInstance = new nub.web3.eth.Contract(Abi.Wbnb, Addresses.tokens.chains[nub.CHAIN_ID].WBNB);
      this.nub = nub;
      this.address = getTokenAddress("WBNB", this.nub);
    }

    async estimateWrapGas(params: WbnbParams){
      const txObj = await this.wrapTxObj(params);
      const gas = await this.getGas(txObj);

      const gasPrice = await this.nub.web3.eth.getGasPrice()

      return {
        gas,
        price: gasPrice,
        fee: +gas * +gasPrice,
      }
    }

    async wrap(params: WbnbParams){
      const txObj = await this.wrapTxObj(params);
      const resp = await this.nub.sendTransaction(txObj);
      return resp;
    }

    async unwrap(params: WbnbParams){
      const txObj = await this.unwrapTxObj(params);
      const resp = await this.nub.sendTransaction(txObj);
      return resp;
    }

    private async wrapTxObj(params: WbnbParams): Promise<TransactionConfig> {

      if (!params.amount) {
        throw new Error("'amount' is not defined");
      }

      if (!params.from) {
        params.from = await this.nub.internal.getAddress();
      }

      let txObj: TransactionConfig;

      if (['-1', Number(maxUint256)].includes(params.amount)) {
        throw new Error("BNB amount value cannot be passed as '-1'.");
      }

      txObj = await this.nub.internal.getTransactionConfig({
        from: params.from,
        to: this.address,
        data: this.contractInstance.methods.deposit().encodeABI(),
        gas: params.gas,
        gasPrice: params.gasPrice,
        nonce: params.nonce,
        value: params.amount,
      } as GetTransactionConfigParams);

      return txObj;
    }

    private async unwrapTxObj(params: WbnbParams): Promise<TransactionConfig>{
      if (!params.amount) {
        throw new Error("'amount' is not a number");
      }

      if (!params.from) {
        params.from = await this.nub.internal.getAddress();
      }

      if (['-1', Number(maxUint256)].includes(params.amount)) {
        params.amount = await this.contractInstance.methods.balanceOf(params.from)
      }

      let txObj: TransactionConfig;
      txObj = await this.nub.internal.getTransactionConfig({
        from: params.from,
        to: this.address,
        data: this.contractInstance.methods.withdraw(params.amount).encodeABI(),
        gas: params.gas,
        gasPrice: params.gasPrice,
        nonce: params.nonce,
        value: 0,
      } as GetTransactionConfigParams);

      return txObj;
    }

    async estimateUnwrapGas(params: WbnbParams){
      const txObj = await this.unwrapTxObj(params);
      const gas = await this.getGas(txObj);
      const gasPrice = await this.nub.web3.eth.getGasPrice()

      return {
        gas,
        price: gasPrice,
        fee: +gas * +gasPrice,
      }
    }

    private getGas = async (transactionConfig: TransactionConfig): Promise<string> => {
      return ((await this.nub.web3.eth.estimateGas(transactionConfig)) * 1.1).toFixed(0); // increasing gas cost by 10% for margin: ;
    };
  }