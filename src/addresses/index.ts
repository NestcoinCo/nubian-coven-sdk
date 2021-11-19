// export * as core from './core'
// export * as connectorsV1 from './connectorsV1'
// export * as connectorsV2_M1 from './connectorsV2_M1'

import { core } from './core';
import { CONNECTORS_V2_M1 as connectorsV2_M1_Mainnet } from './mainnet/connectorsV2_M1';
import { CONNECTORS_V2_M1 as connectorsV2_M1_Testnet } from './mainnet/connectorsV2_M1';
import { PANCAKESWAP_V2 as pancakeswapV2_Mainnet } from './mainnet/pancakeswapv2';
import { PANCAKESWAP_V2 as pancakeswapV2_Testnet } from './testnet/pancakeswapv2';
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
  protocols: {
    pancakeswap:{
      chains: {
        56: {
          versions:{
            2: pancakeswapV2_Mainnet
          } 
        },
        97:{
          versions:{
            2: pancakeswapV2_Testnet
          }
        }
      }
    }
  },
  tokens: {
    chains: {
      97: TOKENS_TESTNET,
      56: TOKENS_MAINNET
    }
  }
};
