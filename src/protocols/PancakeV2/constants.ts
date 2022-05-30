import { Token, ChainId } from "@pancakeswap/sdk";

const MAINNET = 56;

const Tokens = {
  wbnb: new Token(
    MAINNET,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.com/',
  ),
  cake: new Token(
    MAINNET,
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    18,
    'CAKE',
    'PancakeSwap Token',
    'https://pancakeswap.finance/',
  ),
  busd: new Token(
    MAINNET,
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    18,
    'BUSD',
    'Binance USD',
    'https://www.paxos.com/busd/',
  ),
  dai: new Token(
    MAINNET,
    '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    18,
    'DAI',
    'Dai Stablecoin',
    'https://www.makerdao.com/',
  ),
  usdt: new Token(
    MAINNET,
    '0x55d398326f99059fF775485246999027B3197955',
    18,
    'USDT',
    'Tether USD',
    'https://tether.to/',
  ),
  btcb: new Token(
    MAINNET,
    '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    18,
    'BTCB',
    'Binance BTC',
    'https://bitcoin.org/',
  ),
  ust: new Token(
    MAINNET,
    '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
    18,
    'UST',
    'Wrapped UST Token',
    'https://mirror.finance/',
  ),
  eth: new Token(
    MAINNET,
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    18,
    'ETH',
    'Binance-Peg Ethereum Token',
    'https://ethereum.org/en/',
  ),
  usdc: new Token(
    MAINNET,
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    18,
    'USDC',
    'Binance-Peg USD Coin',
    'https://www.centre.io/usdc',
  ),
}

export const BASES_TO_CHECK_TRADES_AGAINST = [
    Tokens.wbnb,
    Tokens.cake,
    Tokens.busd,
    Tokens.usdt,
    Tokens.btcb,
    Tokens.ust,
    Tokens.eth,
    Tokens.usdc,
  ]