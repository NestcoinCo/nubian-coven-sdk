// export * as core from './core'
// export * as connectorsV1 from './connectorsV1'
// export * as connectorsV2_M1 from './connectorsV2_M1'

import { core } from './core';
import { protocols } from './protocols';
import { CONNECTORS_V2_M1 as connectorsV2_M1_Mainnet } from './mainnet/connectorsV2_M1';
import { CONNECTORS_V2_M1 as connectorsV2_M1_Testnet } from './mainnet/connectorsV2_M1';
import { TOKENS as TOKENS_MAINNET  } from './mainnet/tokens';
import { TOKENS as TOKENS_TESTNET  } from './testnet/tokens';

export const Addresses = {
  genesis: '0x0000000000000000000000000000000000000000',
  core,
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
  protocols,
  tokens: {
    chains: {
      97: TOKENS_TESTNET,
      56: TOKENS_MAINNET
    }
  }
};
