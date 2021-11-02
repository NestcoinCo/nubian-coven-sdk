// export * as core from './core'
// export * as connectorsV1 from './connectorsV1'
// export * as connectorsV2_M1 from './connectorsV2_M1'

import { core } from './core'
import { connectorsV2_M1 as connectorsV2_M1_Mainnet } from './mainnet/connectorsV2_M1'
import { connectorsV2_M1 as connectorsV2_M1_Testnet } from './mainnet/connectorsV2_M1'

export const Addresses = {
    genesis: '0x0000000000000000000000000000000000000000',
    core,
    connectors: {
        chains: {
            97: {
                versions: {
                    2: connectorsV2_M1_Testnet 
                }
            },
            56: {
                versions: {
                    2: connectorsV2_M1_Mainnet 
                }
            }
        },
    }
}
