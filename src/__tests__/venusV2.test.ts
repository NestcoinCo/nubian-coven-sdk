import Web3 from "web3";
import BigNumber from "bignumber.js";
import NUB from "..";
import { Addresses, getTokenAddress } from "../constants";
import Erc20 from "../protocols/utils/Erc20";
import { tokenMapping, vTokenMapping } from "../protocols/utils/venusMapping";
import VToken from "../protocols/utils/VToken";
import {config} from "dotenv";
config();
import ensureAllowance from "./utils/ensureAllowance";
import { privateKey } from "./utils/constants";
// tslint:disable-next-line:no-var-requires
const hre = require("hardhat");

let web3: Web3;
let nub: NUB;
let user: string;
const vBag = 	"0x3ddfa8ec3052539b6c9549f12cea2c295cff5296";

beforeAll(async () => {
  hre.web3.eth.setProvider(new hre.Web3.providers.HttpProvider("http://localhost:8545"));
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [vBag],
  });

  // web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545/"));
  web3 = hre.web3;
  nub = new NUB({
    web3: hre.web3,
    mode: 'node',
    privateKey,
  });
  user = web3.eth.accounts.privateKeyToAccount(privateKey).address;
})

describe("Venus", () => {

  test("Deposit", async () => {
    const amount = 1;
    const token = getTokenAddress("USDT", nub);
    const Token = new Erc20(token, nub.web3);

    // send amount to user
    const actualAmount = new BigNumber(amount).times(new BigNumber(10).pow(await Token.decimals())).toString();
    await Token.send(user, actualAmount, {from: vBag});

    const tokenBalanceBefore = await Token.balanceOf(user);

    const key = Object.entries(tokenMapping).filter(([_, value]) => value === token)[0][0] as keyof typeof tokenMapping;
    const vToken = vTokenMapping[key];
    const _VToken = new VToken(vToken, nub.web3);
    const vTokenBalanceBefore = await _VToken.balanceOf(user);
    await ensureAllowance(
      [Token], 
      user, 
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [new BigNumber(10).pow(await Token.decimals()).times(amount).toFixed(0)]
    );
    
    const tx = await nub.venus.deposit({
      amount,
      address: token,
      gasPrice: await nub.web3.eth.getGasPrice()
    }) as unknown as {status: boolean}

    const tokenBalanceAfter = await Token.balanceOf(user);
    const vTokenBalanceAfter = await _VToken.balanceOf(user);
    expect(+new BigNumber(vTokenBalanceAfter).minus(vTokenBalanceBefore).toFixed(0))
      .toBeGreaterThan(0);
    expect(+new BigNumber(tokenBalanceBefore).minus(tokenBalanceAfter).toFixed(0))
      .toEqual(+new BigNumber(10).pow(await Token.decimals()).times(amount).toFixed(0));

    // tslint:disable-next-line:no-unused-expression
    expect(tx?.status).toBeTruthy;
  });

  test("Withdraw with vToken Amount", async () => {
    const vTokenAddress = vTokenMapping["USDT-A"];
    const vTokenAmount = 40;

    const key = Object.entries(vTokenMapping).filter(([_, value]) => value === vTokenAddress)[0][0] as keyof typeof tokenMapping;
    const _VToken = new VToken(vTokenAddress, nub.web3);
    const Token = new Erc20(tokenMapping[key], nub.web3);

    // send amount to user
    const actualAmount = new BigNumber(vTokenAmount).times(new BigNumber(10).pow(await _VToken.decimals())).toString();
    await _VToken.send(user, actualAmount, {from: vBag});

    const tokenBalanceBefore = await Token.balanceOf(user);
    const vTokenBefore = await _VToken.balanceOf(user);

    await ensureAllowance(
      [_VToken], 
      user, 
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [ new BigNumber(10).pow(await _VToken.decimals()).times(vTokenAmount).toFixed(0)]
    );

    const tx = await nub.venus.withdraw({
      vTokenAddress,
      vTokenAmount,
       gasPrice: await nub.web3.eth.getGasPrice()
    }) as unknown as { status: boolean};

    const tokenBalanceAfter = await Token.balanceOf(user);
    const vTokenAfter = await _VToken.balanceOf(user);

    expect(+new BigNumber(vTokenBefore).minus(vTokenAfter).toFixed(0))
      .toEqual(+new BigNumber(10).pow(8).times(vTokenAmount).toFixed(0));
    expect(+new BigNumber(tokenBalanceAfter).minus(tokenBalanceBefore).toFixed(0))
      .toBeGreaterThan(0);

    // tslint:disable-next-line:no-unused-expression
    expect(tx?.status).toBeTruthy;
  })

  
  test("Withdraw with Token Amount", async () => {
    const vTokenAddress = vTokenMapping["USDT-A"];
    const tokenAmount = 1000;

    const key = Object.entries(vTokenMapping).filter(([_, value]) => value === vTokenAddress)[0][0] as keyof typeof tokenMapping;
    const _VToken = new VToken(vTokenAddress, nub.web3);
    const Token = new Erc20(tokenMapping[key], nub.web3);

    // send amount to user
    const vTokenAmount = await _VToken.getVTokens(tokenAmount, (await Token.decimals()).toString());
    const actualAmount = new BigNumber(vTokenAmount).times(new BigNumber(10).pow(await _VToken.decimals())).toFixed(0);
    await _VToken.send(user, actualAmount, {from: vBag});

    const tokenBalanceBefore = await Token.balanceOf(user);
    const vTokenBefore = await _VToken.balanceOf(user);

    await ensureAllowance(
      [Token], 
      user, 
      Addresses.core[nub.CHAIN_ID].versions[2].implementations, 
      [ new BigNumber(10).pow(await Token.decimals()).times(tokenAmount).toFixed(0) ]
    );

    const tx = await nub.venus.withdraw({
      vTokenAddress,
      tokenAmount,
       gasPrice: await nub.web3.eth.getGasPrice()
    }) as unknown as { status: boolean};

    const tokenBalanceAfter = await Token.balanceOf(user);
    const vTokenAfter = await _VToken.balanceOf(user);

    expect(+new BigNumber(vTokenBefore).minus(vTokenAfter).toFixed(0))
      .toBeGreaterThan(0);

    // tslint:disable-next-line:no-unused-expression
    expect(new BigNumber(tokenBalanceAfter).minus(tokenBalanceBefore)
      .eq(new BigNumber(10).pow(await Token.decimals()).times(tokenAmount))
    ).toBeTruthy;

    // tslint:disable-next-line:no-unused-expression
    expect(tx?.status).toBeTruthy;
  })
});
