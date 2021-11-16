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
type ETHInputParams = {
  amount: string;
} & Pick<TransactionConfig, 'from' | 'gas' | 'gasPrice' | 'nonce' | 'to'>;

/**
 * generic ERC20 token methods
 */

export class ETH {
  constructor(private nub: NUB) {}
  /**
   * Transfer
   */
  async transfer(params: ETHInputParams): Promise<string> {
    const txObj: TransactionConfig = await this.transferTxObj(params);

    return this.nub.sendTransaction(txObj);
  }

  /**
   * Transfer Tx object
   */
  async transferTxObj(params: ETHInputParams): Promise<TransactionConfig> {
    if (!params.to) {
      throw new Error("'to' not provided.");
    }

    if (params.to === Addresses.genesis) {
      throw new Error("'to' is not defined and instance is not set.");
    }

    if (!params.amount) {
      throw new Error("'amount' is not provided");
    }

    if (!params.from) {
      params.from = await this.nub.internal.getAddress();
    }

    let txObj: TransactionConfig;
    if (['-1', this.nub.maxValue].includes(params.amount)) {
      throw new Error("BNB amount cannot be passed as '-1'.");
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

    return txObj;
  }
}
