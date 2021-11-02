import { core as mainnetCore } from './mainnet/core'
import { core as testnetcore } from './testnet/core'

export const core = {
  97: testnetcore,
  56: mainnetCore
}
