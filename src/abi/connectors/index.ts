export * as connectorsV2_M1 from './v2'

import { connectorsV2_M1 } from './v2'

export type Connector = keyof typeof connectorsV2_M1 

export const connectors = {
    versions: {
        2: connectorsV2_M1
    }
}