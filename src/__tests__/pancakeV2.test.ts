const Web3 = require("web3");
import {  } from 'web3-core';
// import { getGasPrice } from "./utils";
// import { Console, log } from "console";
import NUB from "..";
import constants from "./constants";
require('dotenv').config();
// import { BigNumber } from "bignumber.js";

let web3: any;
let nub: NUB;
let user: string;
const {abi: {LP_ABI },
  addresses: {mainnet: {tokens: {BNB: TokenA, BUSD: TokenB, WBNB_BUSD_LP: LP},
    protocols: {Wizard}}},
  utils: {maxUint256}
} = constants;
const {
  addresses: {mainnet: {tokens: {BNB, WBNB}}}
} = constants;
let tokenA: any, tokenB: any, lpToken: any;

// // amounts
// const [ amountA, amountB, LPamount ] = ["003422160000000000", "1800000000000000000", "065337351229019145"];

beforeAll(() => {
  web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));
  nub = new NUB({
    web3: web3,
    mode: 'node',
    privateKey: process.env.PRIVATE_KEY || "",
  });

  user = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address;
  tokenA = new web3.eth.Contract(LP_ABI, TokenA);
  tokenB = new web3.eth.Contract(LP_ABI, TokenB);
  lpToken = new web3.eth.Contract(LP_ABI, LP);
})

describe("Pancakeswap", () => {

  test("Pancakeswap Route", async () => {
    const outcome = await nub.pancakeswap.getRoute("0x6bff4fb161347ad7de4a625ae5aa3a1ca7077819", "0xac51066d7bec65dc4589368da368b212745d63e8");
    console.log(outcome)
  });

//   //deposit PRED/BUSD
//   xtest("Pancakeswap Deposit", async () => {
//     const slippage_In_percent = 0.02; 
//     const unitAmt = new BigNumber(amountB).div(amountA).times(10**18).toFixed(0);
//     const slippage = (new BigNumber(10**18)).times(slippage_In_percent);

//     //approve tokens
//     if(TokenA !== BNB){
//       let approved = await tokenA.methods.allowance(user, Wizard).call();
//       if(approved < Number(amountA) ){
//         await nub.erc20.approve({token: TokenA, gasPrice: web3.utils.toWei(await getGasPrice(), "gwei")});
//       }
//     }
//     if(TokenB !== BNB){
//       let approved = await tokenB.methods.allowance(user, Wizard).call();
//       if(approved < Number(amountB)){
//         await nub.erc20.approve( { token: TokenB, gasPrice: web3.utils.toWei(await getGasPrice(), "gwei") } );
//       }
//     }


//     let spells = nub.Spell();
//     // deposit in Wizard
//     spells.add({
//       connector: "BASIC-A",
//       method: "deposit",
//       args: [
//         TokenA,
//         amountA,
//         0,
//         0
//       ]
//     });

//     // deposit in Wizard
//     spells.add({
//       connector: "BASIC-A",
//       method: "deposit",
//       args: [
//         TokenB,
//         amountB,
//         0,
//         0
//       ]
//     });

//     // deposit tokens in Pancakeswap
//     spells.add({
//       connector: "PancakeV2",
//       method: "deposit",
//       args: [
//         TokenA,
//         TokenB,
//         maxUint256, // address to receive vBNB
//         unitAmt,
//         slippage,
//         0,
//         0
//       ]
//     })

//     // withdraw BUSD from Wizard
//     spells.add({
//       connector: "BASIC-A",
//       method: "withdraw",
//       args: [
//         TokenB === WBNB ? WBNB : TokenA,
//         maxUint256,
//         user, 
//         0,
//         0
//       ]
//     })

//     // withdraw PRED from Wizard
//     spells.add({
//       connector: "BASIC-A",
//       method: "withdraw",
//       args: [
//         TokenA === WBNB ? WBNB : TokenA,
//         maxUint256,
//         user,
//         0,
//         0
//       ]
//     })
    
//     // withdraw lpToken from Wizard
//     spells.add({
//       connector: "BASIC-A",
//       method: "withdraw",
//       args: [
//         LP,
//         maxUint256,
//         user, // address to receive lpTokens
//         0,
//         0
//       ]
//     })

//     const value = TokenA === BNB ? amountA : ( TokenB === BNB ? amountB : 0 );
//     const txHash = await spells.cast({
//       gasPrice: web3.utils.toWei(await getGasPrice(), "gwei"), 
//       value
//     });
//     console.log(txHash);
//     expect(txHash).toBeDefined();
//   })

//   xtest("Pancakeswap Withdrawal", async () => {
//     const slippage_In_percent = 0.02; 
//     const amountB_W_Slippage = (new BigNumber(amountB)).minus(new BigNumber(amountB).times(slippage_In_percent));
//     const amountA_W_Slippage = (new BigNumber(amountA)).minus(new BigNumber(amountA).times(slippage_In_percent));
//     console.log(amountA_W_Slippage.toString(), amountB_W_Slippage.toString());
//     const unitBAmt = amountB_W_Slippage.div(LPamount).times(10**18).toFixed(0);
//     const unitAAmt = amountA_W_Slippage.div(LPamount).times(10**18).toFixed(0);


//     let spells = nub.Spell();
    
//     //await nub.erc20.approve( { token: LP, gasPrice: await getGasPrice() });
//     let approved = await lpToken.methods.allowance(user, Wizard).call();
//     if(approved < Number(LPamount)){
//       await nub.erc20.approve({token: LP, gasPrice: web3.utils.toWei(await getGasPrice(), "gwei")});
//     }

//     spells.add({
//       connector: "BASIC-A",
//       method: "deposit",
//       args: [
//         LP,
//         maxUint256,
//         0,
//         0
//       ]
//     });

//     spells.add({
//       connector: "PancakeV2",
//       method: "withdraw",
//       args: [
//         TokenA,
//         TokenB,
//         LPamount,
//         unitAAmt,
//         unitBAmt,
//         0,
//         [0,0],
//       ]
//     })

//     //withdraw BUSD from Wizard
//     spells.add({
//       connector: "BASIC-A",
//       method: "withdraw",
//       args: [
//         TokenB,
//         maxUint256,
//         user, 
//         0,
//         0
//       ]
//     })

//     //withdraw PRED from Wizard
//     spells.add({
//       connector: "BASIC-A",
//       method: "withdraw",
//       args: [
//         TokenA,
//         maxUint256,
//         user,
//         0,
//         0
//       ]
//     })

//     const txHash = await spells.cast({gasPrice: web3.utils.toWei(await getGasPrice(), "gwei")})
//     console.log(txHash);
//     expect(txHash).toBeDefined();
//   })
});


