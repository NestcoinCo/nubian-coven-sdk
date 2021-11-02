import { TransactionConfig } from 'web3-core'
import NUB from '.'
import { Abi } from './abi'
import { Addresses } from './addresses'
import { Spells } from './spells'
import { wrapIfSpells } from './utils'

type EncodeAbiParams = {
  spells: Spells
  origin?: string
} & Pick<TransactionConfig, 'to'>

export class CastHelpers {
  constructor(private nub: NUB) {}

  /**
   * Returns the estimated gas cost.
   *
   * @param params.from the from address
   * @param params.to the to address
   * @param params.value eth value
   * @param params.spells cast spells
   */
  estimateGas = async (params: { spells: Spells } & Pick<TransactionConfig, 'from' | 'to' | 'value'>) => {
    const to = params.to ?? ""

    if (to === Addresses.genesis)
      throw new Error(
        `Please configure the DSA instance by calling dsa.setInstance(dsaId). More details: https://docs.nubian.com/setup`
      )

    const { targets, spells } = this.nub.internal.encodeSpells(params)
    const args = [targets, spells, this.nub.origin]
    let from = params.from
    if (!from) {
      const fromFetch = await this.nub.internal.getAddress()
      from = fromFetch ? fromFetch : ""
    }

    console.log("From Address is ", from)

    const value = params.value ?? '0'

    const abi = this.nub.internal.getInterface(Abi.core.versions[this.nub.VERSION].implementations.implementations, 'cast')

    if (!abi) throw new Error('Abi is not defined.')

    const estimatedGas = await this.nub.internal.estimateGas({ abi, to, from, value, args })

    return estimatedGas
  }

  /**
   * Returns the encoded cast ABI byte code to send via a transaction or call.
   *
   * @param params.spells The spells instance
   * @param params.to (optional) the address of the smart contract to call
   * @param params.origin (optional) the transaction origin source
   */
  encodeABI = (params: Spells | EncodeAbiParams) => {
    console.log("Encode ABI", params)
    const defaults = {
      to: Addresses.core[this.nub.CHAIN_ID].versions[this.nub.VERSION].implementations,
      origin: this.nub.origin,
    }

    const mergedParams = Object.assign(defaults, wrapIfSpells(params)) as EncodeAbiParams

    if (mergedParams.to === Addresses.genesis)
      throw new Error(
        `Please specify the address of the Wizard Contract`
      )

    const contract = new this.nub.config.web3.eth.Contract(
      Abi.core.versions[this.nub.VERSION].implementations.implementations,
      mergedParams.to
    )

    const { targets, spells } = this.nub.internal.encodeSpells(mergedParams.spells)

    const encodedAbi: string = contract.methods.cast(targets, spells, mergedParams.origin).encodeABI()
    return encodedAbi
  }

  flashBorrowSpellsConvert = (params: Spells): Spells => {
    const arr = params.data
    const spellsLength = arr.length
    const spells = this.nub.Spell()
    for (let i = 0; i < spellsLength; i++) {
      const a = arr[i]
      spells.add(a)
    }
    return spells
  }
}
