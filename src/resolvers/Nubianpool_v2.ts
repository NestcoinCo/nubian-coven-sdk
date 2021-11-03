import { NUB } from '../nub'
import { Spells } from '../spells'


export class NubianPoolV2 {
  constructor(private nub: NUB) {}

/**
 * Encode Instapool_v2 flashBorrowWithCast calldata arg.
 *
 * @param spells The spells instance
 */
  encodeFlashCastData(spells: Spells) {
    console.log(spells)
    const encodeSpellsData = this.nub.internal.encodeSpells(spells);
    console.log("EncodeSpell", encodeSpellsData)
    const targetType =  "address[]"
    console.log("Target Types", targetType)
    const argTypes = [targetType, "bytes[]"];
    return this.nub.web3.eth.abi.encodeParameters(argTypes, [encodeSpellsData.targets, encodeSpellsData.spells]);
  }
}
