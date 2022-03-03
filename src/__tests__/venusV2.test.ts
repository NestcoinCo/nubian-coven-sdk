const Web3 = require("web3");
import BigNumber from "bignumber.js";
import { Console } from "console";
import NUB from "..";
import { Addresses, getTokenAddress } from "../constants";
import Bnb from "../protocols/utils/Bnb";
import Erc20 from "../protocols/utils/Erc20";
import { tokenMapping, vTokenMapping } from "../protocols/utils/venusMapping";
import VToken from "../protocols/utils/VToken";
require('dotenv').config()

let web3: typeof Web3;
let nub: NUB;
let user: string;

beforeAll(() => {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  nub = new NUB({
    web3: web3,
    mode: 'node',
    privateKey: process.env.PRIVATE_KEY!,
  });
  user = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address;
})

export const ensureAllowance = async (Tokens: ( Bnb|Erc20|VToken )[], owner: string, spender: string, amounts: (string|number)[]) => {
  for ( let i = 0; i < Tokens.length; i++){
    const token = Tokens[i];
    if(token instanceof Bnb) return;
    if ( await token.allowance(owner, spender) > amounts[i]) return;
    await token.approve(spender);
  }
}

describe("Venus", () => {

  test("Deposit", async () => {
    const amount = 1;
    const token = getTokenAddress("USDT", nub);

    const Token = new Erc20(token, nub.web3);
    const tokenBalanceBefore = await Token.balanceOf(user);

    const key = Object.entries(tokenMapping).filter(([key, value]) => value === token)[0][0] as keyof typeof tokenMapping;
    const vToken = vTokenMapping[key];
    const _VToken = new VToken(vToken, nub.web3);
    const vTokenBalanceBefore = await _VToken.balanceOf(user);
    ensureAllowance(
      [Token], 
      user, 
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [new BigNumber(10).pow(await Token.decimals()).times(amount).toNumber()]
    );

    const tx = await nub.venus.deposit({
      amount,
      address: token,
      gasPrice: await nub.web3.eth.getGasPrice()
    }) as unknown as {status: boolean}

    const tokenBalanceAfter = await Token.balanceOf(user);
    const vTokenBalanceAfter = await _VToken.balanceOf(user);
    expect(new BigNumber(vTokenBalanceAfter).minus(vTokenBalanceBefore).toNumber())
      .toBeGreaterThan(0);
    expect(new BigNumber(tokenBalanceBefore).minus(tokenBalanceAfter).toNumber())
      .toEqual(new BigNumber(10).pow(await Token.decimals()).times(amount).toNumber());

    expect(tx?.status).toBeTruthy;
  });

  test("Withdraw with vToken Amount", async () => {
    const vTokenAddress = vTokenMapping["USDT-A"];
    const vTokenAmount = 40;

    const key = Object.entries(vTokenMapping).filter(([key, value]) => value === vTokenAddress)[0][0] as keyof typeof tokenMapping;
    const _VToken = new VToken(vTokenAddress, nub.web3);
    const Token = new Erc20(tokenMapping[key], nub.web3);

    const tokenBalanceBefore = await Token.balanceOf(user);
    const vTokenBefore = await _VToken.balanceOf(user);

    ensureAllowance(
      [_VToken], 
      user, 
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [ new BigNumber(10).pow(await _VToken.decimals()).times(vTokenAmount).toNumber()]
    );

    const tx = await nub.venus.withdraw({
      vTokenAddress,
      vTokenAmount,
       gasPrice: await nub.web3.eth.getGasPrice()
    }) as unknown as { status: boolean};

    const tokenBalanceAfter = await Token.balanceOf(user);
    const vTokenAfter = await _VToken.balanceOf(user);

    expect(new BigNumber(vTokenBefore).minus(vTokenAfter).toNumber())
      .toEqual(new BigNumber(10).pow(8).times(vTokenAmount).toNumber());
    expect(new BigNumber(tokenBalanceAfter).minus(tokenBalanceBefore).toNumber())
      .toBeGreaterThan(0);

    expect(tx?.status).toBeTruthy;
  })

  test("Withdraw with Token Amount", async () => {
    const vTokenAddress = vTokenMapping["USDT-A"];
    const tokenAmount = 1;

    const key = Object.entries(vTokenMapping).filter(([key, value]) => value === vTokenAddress)[0][0] as keyof typeof tokenMapping;
    const _VToken = new VToken(vTokenAddress, nub.web3);
    const Token = new Erc20(tokenMapping[key], nub.web3);

    const tokenBalanceBefore = await Token.balanceOf(user);
    const vTokenBefore = await _VToken.balanceOf(user);

    ensureAllowance(
      [Token], 
      user, 
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [ new BigNumber(10).pow(await Token.decimals()).times(tokenAmount).toNumber() ]
    );

    const tx = await nub.venus.withdraw({
      vTokenAddress,
      tokenAmount,
       gasPrice: await nub.web3.eth.getGasPrice()
    }) as unknown as { status: boolean};

    const tokenBalanceAfter = await Token.balanceOf(user);
    const vTokenAfter = await _VToken.balanceOf(user);

    expect(new BigNumber(vTokenBefore).minus(vTokenAfter).toNumber())
      .toBeGreaterThan(0);
    expect(new BigNumber(tokenBalanceAfter).minus(tokenBalanceBefore).toNumber())
      .toEqual(new BigNumber(10).pow(await Token.decimals()).times(tokenAmount).toNumber());

    expect(tx?.status).toBeTruthy;
  })
  
});
