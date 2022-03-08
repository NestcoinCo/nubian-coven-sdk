import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-waffle";
require('dotenv').config();

const PRIVATE_KEY = "689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd";
const MORALIS_KEY = "https://speedy-nodes-nyc.moralis.io/40fcc85be509fe0b0f81c26e/bsc/mainnet/archive";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'localhost',
  solidity: {
    compilers: [
      {
        version: '0.7.6',
      },
      {
        version: '0.6.0',
      },
      {
        version: '0.6.2',
      },
      {
        version: '0.6.5',
      },
    ],
  },
  networks: {
    bsctestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    localhost: {
      url: `http://localhost:8545`,
      accounts: [`0x${PRIVATE_KEY}`],
      timeout: 150000,
    },
    bscmainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    hardhat: {
      forking: {
        url: MORALIS_KEY,
        blockNumber: 15730775,
      },
      blockGasLimit: 12000000,
    },
  },
};
