// export * as core from './core'
// export * as connectorsV1 from './connectorsV1'
// export * as connectorsV2_M1 from './connectorsV2_M1'

import { core } from './core';
import { CONNECTORS_V2_M1 as connectorsV2_M1_Mainnet } from './mainnet/connectorsV2_M1';
import { CONNECTORS_V2_M1 as connectorsV2_M1_Testnet } from './mainnet/connectorsV2_M1';
import {protocols } from './mainnet/protocols';
import { tokens } from './mainnet/tokens';

export const Addresses = {
  genesis: '0x0000000000000000000000000000000000000000',
  core,
  protocols,
  tokens,
  connectors: {
    chains: {
      97: {
        versions: {
          2: connectorsV2_M1_Testnet,
        },
      },
      56: {
        versions: {
          2: connectorsV2_M1_Mainnet,
        },
      },
    },
  },
};
