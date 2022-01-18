export * as connectorsV2_M1 from './v2/connectorsM1';
export * as implementations from './v2/implementations';

export * as index from './indexItem';
export * as list from './list';
export * as read from './read';

import * as connectorsV2_M1 from './v2/connectorsM1';
import * as implementations from './v2/implementations';

import { index } from './indexItem';
import { list } from './list';
import { read } from './read';

export const core = {
  index,
  list,
  read,
  versions: {
    2: {
      // connectorsProxy,
      implementations,
      connectors: connectorsV2_M1,
    },
  },
};
