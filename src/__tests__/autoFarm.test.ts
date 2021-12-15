// const Web3 = require("web3");
// import axios from "axios";
// import { log } from "console";
// import NUB from "..";
// require('dotenv').config()

// let web3;
// let nub: NUB;
// let gasPrice: string = '5000000000';
// let maxValue = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
// let BNB_CAKE = "0x0ed7e52944161450477ee417de9cd3a859b14fd0";
// let CAKE_BUSD = "0x804678fa97d91B974ec2af3c843270886528a9E6";

// beforeAll(() => {
//   web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));
//   nub = new NUB({
//     web3: web3,
//     mode: 'node',
//     privateKey: process.env.PRIVATE_KEY || "",
//   });
// });

// xdescribe("AutoFarm BNB/CAKE lp Tests", () => {
//   xtest("deposit BNB/CAKE lp", async () => {

//     //await nub.erc20.approve({ token: "0x0ed7e52944161450477ee417de9cd3a859b14fd0", gasPrice, to: nub.autoFarm.autofarmAddress});
//     const tx = await nub.autoFarm.deposit({poolId: "243", amount: "46092055642346398", gasPrice});
//     expect(tx).toBeDefined();
//   });

//   xtest("withdraw BNB/CAKE lp", async () => {
//     const tx = await nub.autoFarm.withdraw({poolId: "243", gasPrice, amount: "46092055642346398"});
//     expect(tx).toBeDefined();
//   });

//   xtest("harvest BNB/CAKE lp", async () => {
//     const tx = await nub.autoFarm.harvest({poolId: "243", gasPrice});
//     expect(tx).toBeDefined();
//   });
  
// });

// xdescribe("AutoFarm CAKE/BUSD lp Tests", () => {
//   xtest("deposit CAKE/BUSD lp", async () => {

//     //await nub.erc20.approve({ token: CAKE_BUSD, gasPrice, to: nub.autoFarm.autofarmAddress});
//     const tx = await nub.autoFarm.deposit({poolId: "381", amount: maxValue, gasPrice});
//     expect(tx).toBeDefined();
//   });

//   xtest("withdraw CAKE/BUSD lp", async () => {
//     const tx = await nub.autoFarm.withdraw({poolId: "381", gasPrice, amount: maxValue});
//     expect(tx).toBeDefined();
//   });

//   xtest("harvest CAKE/BUSD lp", async () => {
//     const tx = await nub.autoFarm.harvest({poolId: "381", gasPrice});
//     expect(tx).toBeDefined();
//   });
  
// });
