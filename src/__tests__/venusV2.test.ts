const Web3 = require("web3");
import NUB from "..";
import { Addresses, getTokenAddress } from "../constants";
import Erc20 from "../protocols/utils/Erc20";
import { tokenMapping, vTokenMapping } from "../protocols/utils/venusMapping";
import VToken from "../protocols/utils/VToken";
import { ensureAllowance } from "./pancakeV2.test";
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

describe("Venus", () => {

  xtest("Deposit", async () => {
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
      [amount * 10**(+Token.decimals())]
    );

    const tx = await nub.venus.deposit({
      amount,
      address: token,
      gasPrice: await nub.web3.eth.getGasPrice()
    }) as unknown as {status: boolean}

    const tokenBalanceAfter = await Token.balanceOf(user);
    const vTokenBalanceAfter = await _VToken.balanceOf(user);

    expect(vTokenBalanceAfter-vTokenBalanceBefore).toBeGreaterThan(0);
    expect(tokenBalanceBefore-tokenBalanceAfter).toEqual(amount * 10**await Token.decimals());

    expect(tx?.status).toBeTruthy;
  });

  xtest("Withdraw with vTokenAmount", async () => {
    const vTokenAddress = vTokenMapping["USDT-A"];
    const vTokenAmount = 141.021;

    const key = Object.entries(vTokenMapping).filter(([key, value]) => value === vTokenAddress)[0][0] as keyof typeof tokenMapping;
    const _VToken = new VToken(vTokenAddress, nub.web3);
    const Token = new Erc20(tokenMapping[key], nub.web3);

    const tokenBalanceBefore = await Token.balanceOf(user);
    const vTokenBefore = await _VToken.balanceOf(user);

    ensureAllowance(
      [_VToken], 
      user, 
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [ vTokenAmount * 10**(+_VToken.decimals()) ]
    );

    const tx = await nub.venus.withdraw({
      vTokenAddress,
      vTokenAmount,
       gasPrice: await nub.web3.eth.getGasPrice()
    }) as unknown as { status: boolean};

    const tokenBalanceAfter = await Token.balanceOf(user);
    const vTokenAfter = await _VToken.balanceOf(user);

    expect(vTokenBefore-vTokenAfter).toEqual(vTokenAmount*10**8);
    expect(tokenBalanceAfter-tokenBalanceBefore).toBeGreaterThan(0);

    expect(tx?.status).toBeTruthy;
  })
  
});
