// @ts-ignore
import { TransactionConfig } from 'web3-core'
import { Addresses } from './addresses'
import { NUB } from './nub'

export class Transaction {
  constructor(private nub: NUB) {}

  /**
   * Send transaction and get transaction hash.
   */
  send = async (transactionConfig: TransactionConfig): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      if (transactionConfig.to == Addresses.genesis)
        throw Error(
          `Please ensure that the implementations contract address has been set and is valid`
        )

      if (this.nub.config.mode == 'node') {
        const signedTransaction = await this.nub.web3.eth.accounts.signTransaction(
          transactionConfig,
          this.nub.config.privateKey
        )

        if (!signedTransaction.rawTransaction)
          throw new Error('Error while signing transaction. Please contact our support: https://docs.nubian.com/')

        this.nub.web3.eth
          .sendSignedTransaction(signedTransaction.rawTransaction)
          .on('receipt', (txReciept: any) => resolve(txReciept))
          .on('error', (error: any) => reject(error))
      } else {
        this.nub.web3.eth
          .sendTransaction(transactionConfig)
          .on('receipt', (txReciept: any) => resolve(txReciept))
          .on('error', (error: any) => reject(error))
      }
    })
  }

  /**
   * Cancel transaction.
   *
   * @param params.nonce
   * @param params.gasPrice .
   * @returns Transaction hash.
   */
  cancel = async (params: Required<Pick<TransactionConfig, 'nonce' | 'gasPrice'>>) => {
    if (!params.nonce) throw new Error("Parameter 'nonce' not defined.")
    if (!params.gasPrice) throw new Error("Parameter 'gasPrice' not defined.")

    const userAddress = await this.nub.internal.getAddress()
    const transactionConfig: TransactionConfig = {
      from: userAddress,
      to: userAddress,
      value: 0,
      data: '0x',
      gasPrice: params.gasPrice,
      gas: '27500',
      nonce: params.nonce,
    }

    const transactionHash = await this.send(transactionConfig)

    return transactionHash
  }

  /**
   * Speed up transaction.
   *
   * @param params.transactionHash - Transaction hash.
   * @param params.gasPrice - Transaction hash.
   * @returns Transaction hash.
   */
  speedUp = async (
    nub: NUB,
    params: { transactionHash: string; gasPrice: NonNullable<TransactionConfig['gasPrice']> }
  ) => {
    if (!params.transactionHash) throw new Error("Parameter 'transactionHash' is not defined.")
    if (!params.gasPrice) throw new Error("Parameter 'gasPrice' is not defined.")

    const userAddress = await this.nub.internal.getAddress()

    if (!userAddress) throw new Error('User address is not defined.')

    const transaction = await this.nub.web3.eth.getTransaction(params.transactionHash)

    if (transaction.from.toLowerCase() !== userAddress.toLowerCase()) throw new Error("'from' address doesnt match.")

    const gasPrice = typeof params.gasPrice !== 'number' ? params.gasPrice : params.gasPrice.toFixed(0)

    const transactionConfig: TransactionConfig = {
      from: transaction.from,
      to: transaction.to ?? undefined,
      value: transaction.value,
      data: transaction.input,
      gasPrice: gasPrice,
      gas: transaction.gas,
      nonce: transaction.nonce,
    }

    const transactionHash = await this.send(transactionConfig)

    return transactionHash
  }

  /**
   * Get transaction Nonce.
   *
   * @param transactionHash Transaction hash to get nonce.
   */
  getNonce = async (transactionHash: string) => {
    const transaction = await this.nub.web3.eth.getTransaction(transactionHash)

    return transaction.nonce
  }

  /**
   * Get transaction count.
   *
   * @param address Address to get transaction count for.
   * @returns Transaction count for address
   */
  getTransactionCount = async (address: string) => {
    const transactionCount = await this.nub.web3.eth.getTransactionCount(address)

    return transactionCount
  }
}
