export * as CONNECTORS_V2_M1 from './v2';

import { CONNECTORS_V2_M1 } from './v2';

export type Connector = keyof typeof CONNECTORS_V2_M1;

export const connectors = {
  versions: {
    2: CONNECTORS_V2_M1,
  },
};
