import BigNumber from "bignumber.js";
import NUB from "..";
import { getTokenAddress } from "../constants";
import {config} from "dotenv";
config();
import { Addresses } from "../constants/addresses";
import BNB from "../protocols/utils/Bnb";
import Token from "../protocols/utils/Erc20"
// tslint:disable-next-line:no-var-requires
const hre = require("hardhat");


let web3;
let nub: NUB;

const gasPrice: string = '20000000000';
const {tokens: {chains: {56:{PRED}}}} = Addresses;
let bnb: BNB;
let wbnb: Token;
let user: string;
const binanceHotWallet6 = "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3";

beforeAll( async () => {
  hre.web3.eth.setProvider(new hre.Web3.providers.HttpProvider("http://localhost:8545"));
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [binanceHotWallet6],
  });

  // web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.defibit.io/"));
  web3 = hre.web3;
  nub = new NUB({
    web3,
    mode: 'node',
    privateKey: process.env.PRIVATE_KEY || "",
  });
  bnb = new BNB(nub.web3);
  wbnb = new Token(getTokenAddress("WBNB", nub), nub.web3);
  user = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address;
})

describe('Estimate gas', () => {
  test("Estimate Gas for token transfer", async () => {

    const priceObj = await nub.estimateGasForTokenTransfer( 
      PRED, 
      "0xD559864407F8B95a097200c85b657ED75db7cfc9", 
      1000000, 
    );

    Object.values(priceObj).forEach( value => {
      // tslint:disable-next-line:no-unused-expression
      expect(value).toBeDefined
    });
  })

  test("Estimate Wrap gas", async () => {
    const priceObj = await nub.wbnb.estimateWrapGas({amount: 1000000000, gasPrice});
    
    Object.values(priceObj).forEach( value => {
      // tslint:disable-next-line:no-unused-expression
      expect(value).toBeDefined
    });
  });

  test("Estimate unwrap gas", async () => {
    const priceObj = await nub.wbnb.estimateUnwrapGas({amount: 1000000000, gasPrice});
    
    Object.values(priceObj).forEach( value => {
      // tslint:disable-next-line:no-unused-expression
      expect(value).toBeDefined
    });
  });
});

describe("Wrap and Unwrap", () => {
  test("Wrap BNB", async() =>{
    const amount = 10000000000;
    // send bnb to user
    await bnb.send(user, amount.toString(), {from: binanceHotWallet6})

    const oldBnbBalance = await bnb.balanceOf(user);
    const oldWbnbBalance = await wbnb.balanceOf(user);
    const txReceipt = await nub.wbnb.wrap({amount, gasPrice});
    const newBnbBalance = await bnb.balanceOf(user);
    const newWbnbBalance = await wbnb.balanceOf(user);
    
    expect(new BigNumber(oldBnbBalance).minus(newBnbBalance).toNumber()).toBeGreaterThan(amount);
    expect(new BigNumber(newWbnbBalance).minus(oldWbnbBalance).toNumber()).toEqual(amount);
    expect(txReceipt).toBeDefined();
  });

  test("Unwrap BNB", async() =>{
    const amount = 10000000000;
    // send wbnb to user
    await wbnb.send(user, amount.toString(), {from: binanceHotWallet6});

    const oldWbnbBalance = await wbnb.balanceOf(user);
    const txReceipt = await nub.wbnb.unwrap({amount, gasPrice});
    const newWbnbBalance = await wbnb.balanceOf(user);
    
    expect(new BigNumber(oldWbnbBalance).minus(newWbnbBalance).toNumber()).toEqual(amount);
    expect(txReceipt).toBeDefined();
  })
})

