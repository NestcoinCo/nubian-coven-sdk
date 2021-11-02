

export * as accountV2_M1 from './v2/accountM1'
export * as connectorsV2_M1 from './v2/connectorsM1'
export * as accountProxy from './v2/accountProxy'
export * as implementations from './v2/implementations'
export * as accountDefault from './v2/accountDefault'

export * as index from './indexItem'
export * as list from './list'
export * as read from './read'



import {accountM1 as accountV2_M1} from './v2/accountM1'
import * as connectorsV2_M1 from './v2/connectorsM1'
import * as accountProxy from './v2/accountProxy'
import * as implementations from './v2/implementations'
import * as accountDefault from './v2/accountDefault'

import {index} from './indexItem'
import {list} from './list'
import {read} from './read'


export const core = {
    index,
    list,
    read,
    versions: {
      2: {
        accountProxy,
        accountDefault,
        // connectorsProxy,
        implementations,
        account: accountV2_M1,
        connectors: connectorsV2_M1,
      }
    }
}
