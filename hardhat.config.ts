import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
require('dotenv').config();

const { utils } = require('ethers');

const PRIVATE_KEY = process.env.PRIVATE_KEY;

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
        url: process.env.MORALIS_KEY,
        blockNumber: 15730775,
      },
      blockGasLimit: 12000000,
    },
  },
};
