import BigNumber from "bignumber.js";
import NUB from "..";
import { getTokenAddress, maxUint256} from "../constants";
import {config} from "dotenv";
config();
import { Addresses } from "../constants/addresses";
import BNB from "../protocols/utils/Bnb";
import Token from "../protocols/utils/Erc20";
import { privateKey } from "./utils/constants";
import ensureAllowance from "./utils/ensureAllowance";
// tslint:disable-next-line:no-var-requires
const hre = require("hardhat");


let web3;
let nub: NUB;

const gasPrice: string = '20000000000';
const {tokens: {chains: {56:{PRED}}}} = Addresses;
let bnb: BNB;
let wbnb: Token;
let user: string;
let wizard: string, receiver: string;
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
    privateKey,
  });
  bnb = new BNB(nub.web3);
  wbnb = new Token(getTokenAddress("WBNB", nub), nub.web3);
  user = web3.eth.accounts.privateKeyToAccount(privateKey).address;
  receiver = "0xD559864407F8B95a097200c85b657ED75db7cfc9";
  wizard = Addresses.core[process.env.NODE_ENV === "test" ? 56 : nub.CHAIN_ID].versions[2].wizard;
})

describe("Transfer", () => {
  test("Estimate Gas for token transfer", async () => {
    const priceObj = await nub.estimateGasForTokenTransfer( 
      PRED, 
      receiver, 
      0, 
    );

    Object.values(priceObj).forEach( value => {
      // tslint:disable-next-line:no-unused-expression
      expect(value).toBeDefined
    });
  })

  test("Estimate transfer ERC20 gas", async () => {
    const BUSD = getTokenAddress("BUSD", nub);
    const amount = "0";
    const gasObj = await nub.erc20.estimateTransferGas({token: BUSD, amount, gasPrice })
    Object.values(gasObj).forEach( value => {
      // tslint:disable-next-line:no-unused-expression
      expect(value).toBeDefined
    });
  })
  
  test("Transfer ERC20", async () => {
    const BUSD = getTokenAddress("BUSD", nub)
    const busd = new Token(BUSD, nub.web3);
    const amount = "329";
    
    await busd.send(user, amount, {from: binanceHotWallet6});
    const amountASender = await busd.balanceOf(user);
    const amountAReceiver = await busd.balanceOf(receiver);

    await nub.erc20.transfer({token:BUSD, from:user, amount, gasPrice, to: receiver});
    const amountBSender = await busd.balanceOf(user);
    const amountBReceiver = await busd.balanceOf(receiver);

    expect(BigInt(amountBReceiver)-BigInt(amountAReceiver)).toEqual(BigInt(amount));
    expect(BigInt(amountASender)-BigInt(amountBSender)).toEqual(BigInt(amount));
  })

  test("Estimate transfer BNB gas", async () => {
    const amount = "6";
    const gasObj = await nub.eth.estimateTransferGas({amount, gasPrice, to: receiver  })
    Object.values(gasObj).forEach( value => {
      // tslint:disable-next-line:no-unused-expression
      expect(value).toBeDefined
    });
  })
  
  test("Transfer BNB", async () => {
    const amount = "8";
    const amountASender = await bnb.balanceOf(user);
    const amountAReceiver = await bnb.balanceOf(receiver);

    await bnb.send(user, amount, {from: binanceHotWallet6});
    await nub.eth.transfer({amount, to: receiver, gasPrice});

    const amountBSender = await bnb.balanceOf(user);
    const amountBReceiver = await bnb.balanceOf(receiver);

    expect(BigInt(amountBReceiver)-BigInt(amountAReceiver)).toEqual(BigInt(amount));
    expect(BigInt(amountASender)-BigInt(amountBSender)).toBeGreaterThan(BigInt(amount));
  })

  test("Transfer token/nub", async () => {
    const BUSD = getTokenAddress("BUSD", nub)
    const busd = new Token(BUSD, nub.web3);
    const amount = "329";
    
    await busd.send(user, amount, {from: binanceHotWallet6});
    const amountASender = await busd.balanceOf(user);
    const amountAReceiver = await busd.balanceOf(receiver);

    await nub.transferToken(BUSD, receiver , amount);
    const amountBSender = await busd.balanceOf(user);
    const amountBReceiver = await busd.balanceOf(receiver);

    expect(BigInt(amountBReceiver)-BigInt(amountAReceiver)).toEqual(BigInt(amount));
    expect(BigInt(amountASender)-BigInt(amountBSender)).toEqual(BigInt(amount));
  })

  test("Transfer Bnb/nub", async () => {
    const amount = "8";
    const amountASender = await bnb.balanceOf(user);
    const amountAReceiver = await bnb.balanceOf(receiver);

    await bnb.send(user, amount, {from: binanceHotWallet6});
    const tx = await nub.transferEth(receiver, amount);

    const amountBSender = await bnb.balanceOf(user);
    const amountBReceiver = await bnb.balanceOf(receiver);

    expect(BigInt(amountBReceiver)-BigInt(amountAReceiver)).toEqual(BigInt(amount));
    expect(BigInt(amountASender)-BigInt(amountBSender)).toBeGreaterThan(BigInt(amount));
  })


})

describe("Approve", () => {
  test("Approve/nub", async () => {
    const BUSD = getTokenAddress("BUSD", nub);
    const amount = "20";
    await nub.approve(BUSD, amount);
    const busd = new Token(BUSD, nub.web3);
    const allowance = await busd.allowance(user, wizard);
    expect(allowance).toEqual(amount);
  })

  test("Infinite Approve/nub", async () => {
    const ALICE = getTokenAddress("ALICE", nub);
    await nub.infiniteApprove(ALICE);
    const alice = new Token(ALICE, nub.web3);
    const allowance = await alice.allowance(user, wizard);
    expect(BigInt(allowance)).toEqual(BigInt(maxUint256));
  })

  test("Estimate Approve Gas", async () => {
    const priceObj = await nub.erc20.estimateApproveGas( 
      {token: PRED, gasPrice}
    );

    Object.values(priceObj).forEach( value => {
      // tslint:disable-next-line:no-unused-expression
      expect(value).toBeDefined
    });
  })

  test("Approve Specified Amount", async () => {
    const BUSD = getTokenAddress("BUSD", nub);
    const amount = "20";
    await nub.erc20.approve({token:BUSD, amount, gasPrice});
    const busd = new Token(BUSD, nub.web3);
    const allowance = await busd.allowance(user, wizard);
    expect(allowance).toEqual(amount);
  })

  test("Infinite Approve", async () => {
    const BUSD = getTokenAddress("BUSD", nub);
    await nub.erc20.approve({token:BUSD, gasPrice});
    const busd = new Token(BUSD, nub.web3);
    const allowance = await busd.allowance(user, wizard);
    expect(BigInt(allowance)).toEqual(BigInt(maxUint256));
  })
})

describe("Wrap and Unwrap", () => {
  test("Estimate Wrap gas", async () => {
    const amount = 1000000000;
    await bnb.send(user, amount.toString(), {from: binanceHotWallet6})
    const priceObj = await nub.wbnb.estimateWrapGas({amount, gasPrice});
    
    Object.values(priceObj).forEach( value => {
      // tslint:disable-next-line:no-unused-expression
      expect(value).toBeDefined
    });
  });

  test("Wrap BNB", async() =>{
    const amount = 10000000000;
    await ensureAllowance(
      [bnb],
      user,
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [amount]
    );
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

  test("Estimate unwrap gas", async () => {
    const amount = 1000000000;
    await wbnb.send(user, amount.toString(), {from: binanceHotWallet6});

    const priceObj = await nub.wbnb.estimateUnwrapGas({amount, gasPrice});
    Object.values(priceObj).forEach( value => {
      // tslint:disable-next-line:no-unused-expression
      expect(value).toBeDefined
    });
  });

  test("Unwrap BNB", async() =>{
    const amount = 10000000000;
    await ensureAllowance(
      [wbnb],
      user,
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [amount]
    );
    // send wbnb to user
    await wbnb.send(user, amount.toString(), {from: binanceHotWallet6});

    const oldWbnbBalance = await wbnb.balanceOf(user);
    const txReceipt = await nub.wbnb.unwrap({amount, gasPrice});
    const newWbnbBalance = await wbnb.balanceOf(user);
    
    expect(new BigNumber(oldWbnbBalance).minus(newWbnbBalance).toNumber()).toEqual(amount);
    expect(txReceipt).toBeDefined();
  })
})

