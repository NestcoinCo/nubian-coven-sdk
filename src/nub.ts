//export const Greeter = (name: string) => `Hello ${name}`;
/**
 * Nubian Coven SDK
 * @author Ebube Ud <kripsonud@gmail.com>
 */


 import Web3 from 'web3'
 import { TransactionConfig } from 'web3-core'
 import { Abi } from './abi'
 import { CastHelpers } from './cast-helpers'
 import { Addresses } from './addresses'
 import { Internal, Version } from './internal'
 import { Spells } from './spells'
 import { Transaction } from './transaction'
 import { wrapIfSpells } from './utils'
 import { Erc20 } from './utils/erc20'


type NUBConfig =
  | {
      web3: Web3
      mode: 'node'
      privateKey: string
    }
  | {
      web3: Web3
      mode: 'simulation'
      publicKey: string
    }
  | {
      web3: Web3
      mode?: 'browser'
    }

type ChainId = 56 | 97

type CastParams = {
    spells: Spells
    origin?: string
  } & Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>
  





export class NUB{
  origin: string = Addresses.genesis
  VERSION : 2 = 2;
  CHAIN_ID : ChainId = 56
  // value of uint(-1).
  public readonly maxValue = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
  public readonly maxVal = () => '115792089237316195423570985008687907853269984665640564039457584007913129639935'


  readonly config: NUBConfig
  readonly castHelpers = new CastHelpers(this)
  readonly transaction = new Transaction(this)


  public encodeSpells = (...args: Parameters<Internal['encodeSpells']>) => this.internal.encodeSpells(...args)
  public sendTransaction = (...args: Parameters<Transaction['send']>) => this.transaction.send(...args)
  public encodeCastABI = (...args: Parameters<CastHelpers['encodeABI']>) => this.castHelpers.encodeABI(...args)
  public estimateCastGas = (...args: Parameters<CastHelpers['estimateGas']>) => {
    return this.castHelpers.estimateGas(...args)
  }


    get web3() {
        return this.config.web3
      }
    get mode() {
    return this.config.mode
    }


    readonly internal = new Internal(this)




  /**
   * @param config A `web3` instance or a DSAConfig
   */
   constructor(config: Web3, chainId: ChainId = 56) {
    this.config = getNUBConfig(config)
    this.config.web3.eth.getChainId().then((_chainId) => {
    })
  }



    public Spell() {
        const vm = this
    
        // Add cast functionality for fluid API through anonymous class.
        return new (class extends Spells {
          constructor() {
            super()
          }
    
          cast = async (params?: Omit<CastParams, 'spells'>) => {
            if (!this.data.length) {
              console.log('No spells casted. Add spells with `.add(...)`.')
              return
            }
            return await vm.cast(!!params ? { ...params, spells: this } : this)
          }
    
          estimateCastGas = async (params?: Omit<CastHelpers['estimateGas'], 'spells'>) => {
            if (!this.data.length) {
              console.log('No spells casted. Add spells with `.add(...)`.')
              return
            }    
            let gas =  await vm.castHelpers.estimateGas({ spells: this, ...params });
            let price = await this.getCurrentGasPrices(true)
            return {
              gas: gas,
              price: price,
              fee: gas * price
            }
          }
    
    
          encodeCastABI = async (params?: Omit<CastHelpers['encodeABI'], 'spells'>) => {
            if (!this.data.length) {
              console.log('No spells casted. Add spells with `.add(...)`.')
              return
            }
            return await vm.encodeCastABI({ spells: this, ...params })
          }
    
          encodeSpells = async (params?: Omit<Internal['encodeSpells'], 'spells'>) => {
            if (!this.data.length) {
              console.log('No spells casted. Add spells with `.add(...)`.')
              return
            }
            return await vm.encodeSpells({ spells: this, ...params })
          }
    
    
         getCurrentGasPrices =  async(useFixedPrice : boolean) => {
        let price = 5000000000;
 

        return  price;
    }
    
          
        })()
      }
    
      async cast(params: Spells | CastParams) {
        const defaults = {
          to: Addresses.core[this.CHAIN_ID].versions[this.VERSION].implementations,
          from: await this.internal.getAddress(),
          origin: this.origin,
        }
        console.log("Spells: ", params);
        const mergedParams = Object.assign(defaults, wrapIfSpells(params)) as CastParams
    
        console.log("Merged Params: ", mergedParams)
        if (!mergedParams.from) throw new Error(`Parameter 'from' is not defined.`)
        if (!mergedParams.to) throw new Error(`Parameter 'to' is not defined.`)
    
        const data = await this.getData(mergedParams)
    
        console.log("Data: ", data)
    
        const transactionConfig = await this.internal.getTransactionConfig({
          from: mergedParams.from,
          to: mergedParams.to, //Contract address of the implementations contract
          gas: mergedParams.gas,
          gasPrice: mergedParams.gasPrice,
          nonce: mergedParams.nonce,
          value: mergedParams.value,
          data: data, //Data should be generated using the abi of the implementations contract
        })
    
        console.log("transactionConfig: ", transactionConfig)
    
    
        const transaction = await this.transaction.send(transactionConfig)
    
        console.log("transaction: ", transaction)
    
    
        return transaction
      }

      private async getData(params: { spells: Spells; origin?: string }) {
        const encodedSpells = this.internal.encodeSpells(params)
    
        const contract = new this.web3.eth.Contract(Abi.core.versions[2].implementations.implementations, Addresses.core[56].index)
        const data = contract.methods
          .cast(encodedSpells.targets, encodedSpells.spells, params.origin || Addresses.genesis)
          .encodeABI()
    
        return data
      }
    
    
}

function getNUBConfig(config: Web3): NUBConfig {
     return { web3: config, mode: 'browser' }
}