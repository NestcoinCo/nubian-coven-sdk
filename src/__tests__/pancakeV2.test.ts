const Web3 = require("web3");
import {  } from 'web3-core';
import NUB from "..";
import { getTokenAddress, Addresses } from '../constants';
import Erc20 from "../protocols/utils/Erc20";
import Bnb from "../protocols/utils/Bnb";
import BigNumber from 'bignumber.js';
require('dotenv').config();
import { Abi } from "../constants/abi";
import VToken from '../protocols/utils/VToken';

let web3: any;
let nub: NUB;
let user: string;
let BNB: string;

const ensureAllowance = async (Tokens: (Bnb|Erc20|VToken)[], owner: string, spender: string, amounts: (string|number)[]) => {
  for ( let i = 0; i < Tokens.length; i++){
    const token = Tokens[i];
    if(token instanceof Bnb) return;
    if ( await token.allowance(owner, spender) > amounts[i]) return;
    await token.approve(spender);
  }
}

beforeAll(() => {
  web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545/"));
  nub = new NUB({
    web3: web3,
    mode: 'node',
    privateKey: process.env.PRIVATE_KEY!,
  });
  BNB = getTokenAddress("BNB", nub);
  user = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address;
})

describe("Pancakeswap",  () => {

  // swap token for token
  test("Swap token for token", async () => {
    const slippage = 2;
    const tokenA = getTokenAddress("USDC", nub);

    const TokenA = tokenA === BNB ? new Bnb(nub.web3) : new Erc20(tokenA, nub.web3);
    const tokenB = getTokenAddress("USDT", nub);
    const TokenB = tokenB === BNB ? new Bnb(nub.web3) : new Erc20(tokenB, nub.web3);
    const amountA = 1;
    let amountB = new BigNumber((await nub.pancakeswap.getRoute(tokenA, tokenB))[0]).times(amountA);
    let slippageAmt = (new BigNumber(amountB)).minus(new BigNumber(amountB).times(slippage));
    const _amountB = (new BigNumber(amountB)).div(new BigNumber(10).pow(await TokenB.decimals())).toFixed(0);

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
      amountB: _amountB,
      tokenA,
      tokenB,
      slippage,
      gasPrice: await nub.web3.eth.getGasPrice()
    })) as unknown as {status: boolean};

    const balanceAAfter = await TokenA.balanceOf(user);
    const balanceBAfter = await TokenB.balanceOf(user);
    
    expect(new BigNumber(balanceABefore).minus(balanceAAfter).toNumber())
      .toEqual(new BigNumber(10).pow(18).times(amountA).toNumber());
    expect(new BigNumber(balanceBAfter).minus(balanceBBefore).toNumber())
      .toBeGreaterThanOrEqual(slippageAmt.toNumber());
    expect(tx?.status).toBeTruthy;
  });

  //swap token for BNB
  test("Swap token for BNB", async () => {
    const slippage = 2;
    const tokenA = getTokenAddress("USDT", nub);

    const TokenA = tokenA === BNB ? new Bnb(nub.web3) : new Erc20(tokenA, nub.web3);
    const tokenB = getTokenAddress("BNB", nub);
    const TokenB = tokenB === BNB ? new Bnb(nub.web3) : new Erc20(tokenB, nub.web3);
    const amountA = 1;
    let amountB = new BigNumber((await nub.pancakeswap.getRoute(tokenA, tokenB))[0]).times(amountA);
    let slippageAmt = (new BigNumber(amountB)).minus(new BigNumber(amountB).times(slippage));
    const _amountB = amountB.div(new BigNumber(10).pow(await TokenB.decimals())).toFixed(0);

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
      amountB: _amountB,
      tokenA,
      tokenB,
      slippage,
      gasPrice: await nub.web3.eth.getGasPrice()
    })) as unknown as {status: boolean};

    const balanceAAfter = await TokenA.balanceOf(user);
    const balanceBAfter = await TokenB.balanceOf(user);

    const differenceA = new BigNumber(balanceABefore).minus(balanceAAfter).toNumber();
    const differenceB = new BigNumber(balanceBAfter).minus(balanceBBefore).toNumber();
    expect(differenceA).toEqual(new BigNumber(10).pow(18).times(amountA).toNumber());
    expect(differenceB)
      .toBeGreaterThanOrEqual(slippageAmt.toNumber());

    expect(tx?.status).toBeTruthy;
  });

  test("Swap BNB for token", async () => {
    const slippage = 2;
    const tokenA = getTokenAddress("BNB", nub);

    const TokenA = tokenA === BNB ? new Bnb(nub.web3) : new Erc20(tokenA, nub.web3);
    const tokenB = getTokenAddress("USDT", nub);
    const TokenB = tokenB === BNB ? new Bnb(nub.web3) : new Erc20(tokenB, nub.web3);
    const amountA = 0.000001;
    let amountB = new BigNumber((await nub.pancakeswap.getRoute(tokenA, tokenB))[0]).times(amountA);

    let slippageAmt = (new BigNumber(amountB)).minus(new BigNumber(amountB).times(slippage));
    let _amountB = Number((new BigNumber(amountB)).div(10 ** await TokenB.decimals()).toString())

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
      amountB: _amountB,
      tokenA,
      tokenB,
      slippage,
      gasPrice: await nub.web3.eth.getGasPrice()
    })) as unknown as {status: boolean};

    const balanceAAfter = await TokenA.balanceOf(user);
    const balanceBAfter = await TokenB.balanceOf(user);
    
    expect(new BigNumber(balanceABefore).minus(balanceAAfter).toNumber())
      .toBeGreaterThan(new BigNumber(10).pow(18).times(amountA).toNumber());
    expect(new BigNumber(balanceBAfter).minus(balanceBBefore).toNumber())
      .toBeGreaterThanOrEqual(slippageAmt.toNumber());
    expect(tx?.status).toBeTruthy;
  });
});


