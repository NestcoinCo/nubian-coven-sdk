import { lpToken as lpToken2 } from "./v2/lpToken";
import { router02 } from "./v2/router02";
import { factory } from "./v2/factory";

export const pancakeswap = {
  v2: {
    lpToken: lpToken2,
    router02,
    factory,
  }
}