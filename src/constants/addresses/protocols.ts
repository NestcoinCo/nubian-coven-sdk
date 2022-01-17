import { PANCAKESWAP_V2 as pancakeswapV2_Mainnet } from './mainnet/pancakeswapv2';
import { PANCAKESWAP_V2 as pancakeswapV2_Testnet } from './testnet/pancakeswapv2';
import { AUTOFARMV2 as autofarmV2_Mainnet } from './mainnet/autofarmV2';
import { AUTOFARMV2 as autofarmV2_Testnet } from './testnet/autofarmV2';
import { VenusV2 } from '../abi/connectors/v2/VenusV2';

export const protocols= {
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
  },
  autofarm:{
    chains: {
      56: {
        versions:{
          2: autofarmV2_Mainnet
        } 
      },
      97:{
        versions:{
          2: autofarmV2_Testnet
        }
      }
    }
  },
  venus:{
    chains:{
      56:{
        versions:{
          2: VenusV2
        }
      },
      97:{
        versions:{
          2: ""
        }
      }
    }
  }
}