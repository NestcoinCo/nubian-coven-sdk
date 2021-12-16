const Web3 = require("web3");
import {  } from 'web3-core';
import getGasPrice from "../utils/gas";
import { Console, log } from "console";
import NUB from "..";
import constants from "../data/constants";
require('dotenv').config();
import { BigNumber } from "bignumber.js";

let web3: any;
let nub: NUB;
let user: string;
const {abi: {LP_ABI },
  addresses: {mainnet: {tokens: {BNB: TokenA, BUSD: TokenB, WBNB_BUSD_LP: LP},
    protocols: {Wizard}}},
  utils: {maxUint256}
} = constants;
const {
  addresses: {mainnet: {tokens: {BNB, WBNB}}}
} = constants;
let tokenA: any, tokenB: any, lpToken: any;

// amounts
const [ amountA, amountB, lpAmount ] = ["003388550000000000", "1800000000000000000", "4185413693140967"];

beforeAll(() => {
  web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));
  nub = new NUB({
    web3: web3,
    mode: 'node',
    privateKey: process.env.PRIVATE_KEY || "",
  });

  user = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address;
  tokenA = new web3.eth.Contract(LP_ABI, TokenA);
  tokenB = new web3.eth.Contract(LP_ABI, TokenB);
  lpToken = new web3.eth.Contract(LP_ABI, LP);
})

describe("Pancakeswap", () => {

  //deposit PRED/BUSD
  xtest("Pancakeswap Deposit", async () => {
    const tx = await nub.pancakeswap.deposit(
      {
        tokenA: TokenA,
        tokenB: TokenB,
        amountA,
        amountB,
        lpToken: "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
        slippage: 2,
        gasPrice: web3.utils.toWei(await getGasPrice(), "gwei")
      }
    );
    console.log(tx);
    expect(tx).toBeDefined();
  })

  xtest("Pancakeswap Withdrawal", async () => {
    const tx = await nub.pancakeswap.withdraw(
      {
        tokenA: TokenA,
        tokenB: TokenB,
        amountA,
        amountB,
        lpToken: "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
        lpAmount,
        slippage: 2,
      }
    );
    
    console.log(tx);
    expect(tx).toBeDefined();
  })
});

