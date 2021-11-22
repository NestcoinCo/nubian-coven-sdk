import { Abi } from '../abi';
import { NUB } from '../nub';
import { Addresses } from '../addresses';
import { TokenInfo } from '../data/token-info';
import * as Math from './math';
import { TransactionConfig } from 'web3-core';
import { GetTransactionConfigParams } from '../internal';
import { Contract } from 'web3-eth-contract';

/**
 * @param {address} _d.token token address or symbol
 * @param {string} _d.amount token amount
 * @param {address|string} _d.from (optional) token
 * @param {number|string} _d.to (optional)
 * @param {number|string} _d.gasPrice (optional) not optional in "node"
 * @param {number|string} _d.gas (optional) not optional in "node"
 * @param {number|string} _d.nonce (optional) not optional in "node"
 */
type Erc20InputParams = {
  token: keyof typeof TokenInfo | string;
  amount: string;
} & Pick<TransactionConfig, 'from' | 'gas' | 'gasPrice' | 'nonce' | 'to'>;

/**
 * generic ERC20 token methods
 */

export class Erc20 {
  constructor(private nub: NUB) {}
  /**
   * Transfer
   */
  async transfer(params: Erc20InputParams): Promise<string> {
    const txObj: TransactionConfig = await this.transferTxObj(params);

    return this.nub.sendTransaction(txObj);
  }

  /**
   * Transfer Tx object
   */
  async transferTxObj(params: Erc20InputParams): Promise<TransactionConfig> {
    if (!params.to) {
      params.to = Addresses.core[this.nub.CHAIN_ID].versions[this.nub.VERSION].implementations;
    }

    if (params.to === Addresses.genesis) {
      throw new Error("'to' is not defined and instance is not set.");
    }

    if (!params.amount) {
      throw new Error("'amount' is not a number");
    }

    if (!params.from) {
      params.from = await this.nub.internal.getAddress();
    }

    let txObj: TransactionConfig;

    if (['eth', TokenInfo.eth.address].includes(params.token.toLowerCase())) {
      if (['-1', this.nub.maxValue].includes(params.amount)) {
        throw new Error("BNB amount value cannot be passed as '-1'.");
      }

      txObj = await this.nub.internal.getTransactionConfig({
        from: params.from,
        to: params.to,
        data: '0x',
        gas: params.gas,
        gasPrice: params.gasPrice,
        nonce: params.nonce,
        value: params.amount,
      } as GetTransactionConfigParams);
    } else {
      const toAddr: string = params.to;
      params.to = this.nub.internal.filterAddress(params.token);
      const contract: Contract = new this.nub.web3.eth.Contract(Abi.basics.erc20, params.to);

      if (['-1', this.nub.maxValue].includes(params.amount)) {
        await contract.methods
          .balanceOf(params.from)
          .call()
          .then((bal: any) => (params.amount = bal))
          .catch((err: any) => {
            throw new Error(`Error while getting token balance: ${err}`);
          });
      }
      const data: string = contract.methods.transfer(toAddr, Math.bigNumInString(Number(params.amount))).encodeABI();

      txObj = await this.nub.internal.getTransactionConfig({
        from: params.from,
        to: params.to,
        data,
        gas: params.gas,
        gasPrice: params.gasPrice,
        nonce: params.nonce,
        value: 0,
      } as GetTransactionConfigParams);
    }

    return txObj;
  }

  /**
   * Approve
   */
  async approve(params: Erc20InputParams): Promise<string> {
    const txObj: TransactionConfig = await this.approveTxObj(params);

    return this.nub.sendTransaction(txObj);
  }

  /**
   * Approve Token Tx Obj
   */
  async approveTxObj(params: Erc20InputParams): Promise<TransactionConfig> {
    if (!params.to) {
      params.to = Addresses.core[this.nub.CHAIN_ID].versions[this.nub.VERSION].implementations;
    }
    if (!params.from) {
      params.from = await this.nub.internal.getAddress();
    }
    if (!params.amount) {
      params.amount = this.nub.maxValue + "";
    }

    let txObj: TransactionConfig;

    if (['eth', TokenInfo.eth.address].includes(params.token.toLowerCase())) {
      throw new Error('BNB does not require approve.');
    } else {
      const toAddr: string = params.to;
      params.to = this.nub.internal.filterAddress(params.token);
      const contract = new this.nub.web3.eth.Contract(Abi.basics.erc20, params.to);
      const data: string = contract.methods.approve(toAddr, params.amount).encodeABI();

      txObj = await this.nub.internal.getTransactionConfig({
        from: params.from,
        to: params.to,
        data,
        gas: params.gas,
        gasPrice: params.gasPrice,
        nonce: params.nonce,
        value: 0,
      } as GetTransactionConfigParams);
    }

    return txObj;
  }
}
