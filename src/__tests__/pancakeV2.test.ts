import NUB from "..";
import { getTokenAddress, Addresses } from '../constants';
import Erc20 from "../protocols/utils/Erc20";
import Bnb from "../protocols/utils/Bnb";
import BigNumber from 'bignumber.js';
import {config} from "dotenv";
config();
import { privateKey } from "./utils/constants";
import ensureAllowance from "./utils/ensureAllowance";
// tslint:disable-next-line:no-var-requires
const hre = require("hardhat");
import {TOKENS as tokens} from "../constants/addresses/mainnet/tokens";


let web3: any;
let nub: NUB;
let user: string;
let BNB: string;
const binanceHotWallet6 = "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3";


beforeAll(async () => {
  hre.web3.eth.setProvider(new hre.Web3.providers.HttpProvider("http://localhost:8545"));
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [binanceHotWallet6],
  });

  // web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545/"));

  web3 = hre.web3;
  nub = new NUB({
    web3: hre.web3,
    mode: 'node',
    privateKey,
  });

  BNB = getTokenAddress("BNB", nub);
  user = web3.eth.accounts.privateKeyToAccount(privateKey).address;
})

describe("Pancakeswap",  () => {
  describe("getRoute tests", () => {
    test("get the path and amount for a swap", async () => {
      // check if it returns a swap path and amount
      const {path, amount, priceImpact} = await nub.pancakeswap.getRoute(tokens.CAKE, tokens.USDC, "65546", "IN", true);
      expect(path.length).toBeGreaterThan(1);
      expect(priceImpact).toEqual(0);
      expect(amount).not.toEqual("");
    });

    test("stores pair data", async () => {
      await nub.pancakeswap.getRoute(tokens.ALICE, tokens.PRED, "456", "IN", true);
      const before = new Date().getTime();
      await nub.pancakeswap.getRoute(tokens.ALICE, tokens.PRED, "456", "OUT", false);
      const after = new Date().getTime();

      expect(after-before).toBeLessThan(1000);
    });

    test("returns a valid swap path", async () => {
      const tokenIn = tokens.DOGE
      const tokenOut = tokens.ALICE
      const {path} = await nub.pancakeswap.getRoute(tokenIn, tokenOut, "65546", "OUT", true);
      expect(path[0]).toEqual(tokens.DOGE);
      expect(path[path.length-1]).toEqual(tokens.ALICE);
    });

    test("considers getRoute for to BNB swaps", async () => {
      const {path} = await nub.pancakeswap.getRoute(tokens.BNB, tokens.USDC, "65546", "IN", true);
      expect(path[0]).toEqual(tokens.BNB);
    });

    test("considers getRoute for from BNB swaps", async () => {
      const {path} = await nub.pancakeswap.getRoute(tokens.DOGE, tokens.BNB, "65546", "IN", true);
      expect(path[path.length-1]).toEqual(tokens.BNB);
    });

    test("cannot getRoute for swap between two same tokens", async () => {
      try{
        const {path, amount} = await nub.pancakeswap.getRoute(tokens.DOGE, tokens.DOGE, "65546", "OUT", true);
        expect(path.length).toEqual(0)
        expect(amount).toEqual("");
      }catch (error: any){
        expect(error.message).toEqual("Invariant failed: ADDRESSES");
      }
    })

    test("cannot getRoute for swap between tokens that don't have a path", async () => {
      const {path, amount} = await nub.pancakeswap.getRoute(tokens.DOGE, "0xA07c5b74C9B40447a954e1466938b865b6BBea36", "65546", "OUT", true);
      expect(path.length).toEqual(0)
      expect(amount).toEqual("");
    })

    test("returns a high impact for high value trades", async () => {
      const tokenIn = tokens.DOGE
      const tokenOut = tokens.ALICE
      const {priceImpact} = await nub.pancakeswap.getRoute(tokenIn, tokenOut, "6554689878888887769", "IN", true);
      expect(priceImpact).toEqual(4);
    })
  })


  // swap token for token
  test("Swap token for token", async () => {
    // await new Promise(resolve => setTimeout(resolve, 30));
    const slippage = 2;
    const tokenA = getTokenAddress("USDC", nub);

    const TokenA = tokenA === BNB ? new Bnb(nub.web3) : new Erc20(tokenA, nub.web3);
    const tokenB = getTokenAddress("USDT", nub);
    const TokenB = tokenB === BNB ? new Bnb(nub.web3) : new Erc20(tokenB, nub.web3);
    const amountA = 1;
    // send amountA to user
    const actualAmountA = new BigNumber(amountA).times(new BigNumber(10).pow(await TokenA.decimals())).toString();
    await TokenA.send(user, actualAmountA, {from: binanceHotWallet6})

    const { path, amount: amountB } = (await nub.pancakeswap.getRoute(tokenA, tokenB, amountA, "IN"));
    const slippageAmt = (new BigNumber(amountB)).times(1-slippage).times(new BigNumber(10).pow(await TokenB.decimals())).toFixed(0);

    const balanceABefore = await TokenA.balanceOf(user);
    const balanceBBefore = await TokenB.balanceOf(user);
    await ensureAllowance(
      [TokenA],
      user,
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [amountA]
    );

    const tx = (
      await nub.pancakeswap.swap({
      amountA,
      amountB,
      tokenA,
      tokenB,
      path,
      slippage,
      gasPrice: await nub.web3.eth.getGasPrice()
    })) as unknown as {status: boolean};

    const balanceAAfter = await TokenA.balanceOf(user);
    const balanceBAfter = await TokenB.balanceOf(user);
    
    expect(new BigNumber(balanceABefore).minus(balanceAAfter).toFixed(0))
      .toEqual(new BigNumber(10).pow(18).times(amountA).toFixed(0));
    expect(BigInt(new BigNumber(balanceBAfter).minus(balanceBBefore).toFixed(0)))
      .toBeGreaterThanOrEqual(BigInt(slippageAmt));
    // tslint:disable-next-line:no-unused-expression
    expect(tx?.status).toBeTruthy;
  });

  // swap token for BNB
  test("Swap token for BNB", async () => {
    // await new Promise(resolve => setTimeout(resolve, 30));
    const slippage = 2;
    const tokenA = getTokenAddress("USDT", nub);

    const TokenA = tokenA === BNB ? new Bnb(nub.web3) : new Erc20(tokenA, nub.web3);
    const tokenB = getTokenAddress("BNB", nub);
    const TokenB = tokenB === BNB ? new Bnb(nub.web3) : new Erc20(tokenB, nub.web3);
    const amountA = 1;

    // send amountA to user
    const actualAmountA = new BigNumber(amountA).times(new BigNumber(10).pow(await TokenA.decimals())).toString();
    await TokenA.send(user, actualAmountA, {from: binanceHotWallet6});

    const { path, amount: amountB } = (await nub.pancakeswap.getRoute(tokenA, tokenB, amountA, "IN"));
    const slippageAmt = (new BigNumber(amountB)).times(1-slippage).times(new BigNumber(10).pow(await TokenB.decimals())).toFixed(0);

    const balanceABefore = await TokenA.balanceOf(user);
    const balanceBBefore = await TokenB.balanceOf(user);

    await ensureAllowance(
      [TokenA],
      user,
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [amountA]
    );

    const tx = (
      await nub.pancakeswap.swap({
      amountA,
      amountB,
      tokenA,
      tokenB,
      path,
      slippage,
      gasPrice: await nub.web3.eth.getGasPrice()
    })) as unknown as {status: boolean};

    const balanceAAfter = await TokenA.balanceOf(user);
    const balanceBAfter = await TokenB.balanceOf(user);

    const differenceA = new BigNumber(balanceABefore).minus(balanceAAfter).toFixed(0);
    const differenceB = new BigNumber(balanceBAfter).minus(balanceBBefore).toFixed(0);
    expect(differenceA).toEqual(new BigNumber(10).pow(18).times(amountA).toFixed(0));
    expect(BigInt(differenceB))
      .toBeGreaterThanOrEqual(BigInt(slippageAmt));

    // tslint:disable-next-line:no-unused-expression
    expect(tx?.status).toBeTruthy;
  });

  test("Swap BNB for token", async () => {
    await new Promise(resolve => setTimeout(resolve, 30));
    const slippage = 2;
    const tokenA = getTokenAddress("BNB", nub);

    const TokenA = tokenA === BNB ? new Bnb(nub.web3) : new Erc20(tokenA, nub.web3);
    const tokenB = getTokenAddress("USDT", nub);
    const TokenB = tokenB === BNB ? new Bnb(nub.web3) : new Erc20(tokenB, nub.web3);
    const amountA = 0.000001;

    // send amountA to user
    const actualAmountA = new BigNumber(amountA).times(new BigNumber(10).pow(await TokenA.decimals())).toString();
    await TokenA.send(user, actualAmountA, {from: binanceHotWallet6});

    const { path, amount: amountB } = (await nub.pancakeswap.getRoute(tokenA, tokenB, amountA, "IN"));
    const slippageAmt = (new BigNumber(amountB)).times(1-slippage).times(new BigNumber(10).pow(await TokenB.decimals())).toFixed(0);

    const balanceABefore = await TokenA.balanceOf(user);
    const balanceBBefore = await TokenB.balanceOf(user);
    await ensureAllowance(
      [TokenA], 
      user,
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [amountA]
    );

    const tx = (
      await nub.pancakeswap.swap({
      amountA,
      amountB,
      tokenA,
      tokenB,
      path,
      slippage,
      gasPrice: await nub.web3.eth.getGasPrice()
    })) as unknown as {status: boolean};

    const balanceAAfter = await TokenA.balanceOf(user);
    const balanceBAfter = await TokenB.balanceOf(user);
    
    expect(BigInt(new BigNumber(balanceABefore).minus(balanceAAfter).toFixed(0)))
      .toBeGreaterThan(BigInt(new BigNumber(10).pow(18).times(amountA).toFixed(0)));
    expect(BigInt(new BigNumber(balanceBAfter).minus(balanceBBefore).toFixed(0)))
      .toBeGreaterThanOrEqual(BigInt(slippageAmt));
    // tslint:disable-next-line:no-unused-expression
    expect(tx?.status).toBeTruthy;
  })
});


