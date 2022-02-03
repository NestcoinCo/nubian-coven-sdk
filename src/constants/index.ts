import { Addresses } from "./addresses";
import { NUB } from "../nub";

const maxUint256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const getTokenAddress = (
  symbol: keyof typeof Addresses.tokens.chains[56], 
  nub: NUB
): string => {
  return Addresses.tokens.chains[nub.CHAIN_ID][symbol];
}

const getTokenAddresses = (symbols: (keyof typeof Addresses.tokens.chains[56])[], nub: NUB): string[] => {
  return symbols.map((symbol) => getTokenAddress(symbol, nub));
}

export {
  Addresses,
  maxUint256,
  getTokenAddress,
  getTokenAddresses,
};
