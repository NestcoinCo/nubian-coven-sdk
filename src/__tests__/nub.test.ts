// const Web3 = require("web3");
// import NUB from "..";
// require('dotenv').config();
// import { Addresses } from "../constants/addresses";


// let web3;
// let nub: NUB;
// let gasPrice: string = '20000000000';
// const {tokens: {chains: {56:{PRED}}}} = Addresses;

// beforeAll(() => {
//   web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.defibit.io/"));
//   nub = new NUB({
//     web3: web3,
//     mode: 'node',
//     privateKey: process.env.PRIVATE_KEY || "",
//   });
// })

//   xdescribe('Estimate gas', () => {
//     xtest("Estimate Gas for token transfer", async () => {
//       const price_obj = await nub.estimateGasForTokenTransfer( 
//         PRED, 
//         "0xD559864407F8B95a097200c85b657ED75db7cfc9", 
//         1000000, 
//       );

//       console.log(price_obj);
//     })

//     test("Estimate Wrap gas", async () => {
//       const price_obj = await nub.wbnb.estimateWrapGas({amount: 1000000000, gasPrice});
//       console.log(price_obj);
//     });

//     test("Estimate unwrap gas", async () => {
//       const price_obj = await nub.wbnb.estimateUnwrapGas({amount: 1000000000, gasPrice});
//       console.log(price_obj);
//     });
//   });

//   describe("Wrap and Unwrap", () => {
//     test("Wrap BNB", async() =>{
//       const amount = 10000000000;
//       const txReceipt = await nub.wbnb.wrap({amount, gasPrice});
//       expect(txReceipt).toBeDefined();
//     });

//     test("Unwrap BNB", async() =>{
//       const txReceipt = await nub.wbnb.unwrap({amount: 10000000000, gasPrice});
//       expect(txReceipt).toBeDefined();
//     })
//   })

