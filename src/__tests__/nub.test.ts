const Web3 = require("web3");
import BigNumber from "bignumber.js";
import NUB from "..";
require('dotenv').config();
import { Addresses } from "../constants/addresses";
const hre = require("hardhat");


let web3;
let nub: NUB;

let gasPrice: string = '20000000000';
const {tokens: {chains: {56:{PRED}}}} = Addresses;

beforeAll( async () => {
  web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.defibit.io/"));
  nub = new NUB({
    web3: web3,
    mode: 'node',
    privateKey: process.env.PRIVATE_KEY || "",
  });

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0xF977814e90dA44bFA03b6295A0616a897441aceC"],
  });
})

  describe('Estimate gas', () => {
    test("Estimate Gas for token transfer", async () => {
      const signer = await hre.ethers.getSigner("0xF977814e90dA44bFA03b6295A0616a897441aceC")
      console.log(await hre.ethers.provider.getNetwork());
      await signer.sendTransaction({
        to: "0x2EFb0e053321967b27147bf26CCeAAaB56022Da9",
        value: hre.ethers.utils.parseEther("2")
      })

      const price_obj = await nub.estimateGasForTokenTransfer( 
        PRED, 
        "0xD559864407F8B95a097200c85b657ED75db7cfc9", 
        1000000, 
      );

      Object.values(price_obj).forEach( value => {
        expect(value).toBeDefined
      });
    })

    xtest("Estimate Wrap gas", async () => {
      const price_obj = await nub.wbnb.estimateWrapGas({amount: 1000000000, gasPrice});
      
      Object.values(price_obj).forEach( value => {
        expect(value).toBeDefined
      });
    });

    xtest("Estimate unwrap gas", async () => {
      const price_obj = await nub.wbnb.estimateUnwrapGas({amount: 1000000000, gasPrice});
      
      Object.values(price_obj).forEach( value => {
        expect(value).toBeDefined
      });
    });
  });

  xdescribe("Wrap and Unwrap", () => {
    test("Wrap BNB", async() =>{
      const amount = 10000000000;
      const txReceipt = await nub.wbnb.wrap({amount, gasPrice});
      expect(txReceipt).toBeDefined();
    });

    test("Unwrap BNB", async() =>{
      const txReceipt = await nub.wbnb.unwrap({amount: 10000000000, gasPrice});
      expect(txReceipt).toBeDefined();
    })
  })

