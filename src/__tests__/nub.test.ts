const Web3 = require("web3");
import axios from "axios";
import { log } from "console";
import NUB from "..";
require('dotenv').config()

let web3;
let nub: NUB
let account: string
let gasPrice: string = '20000000000';

beforeAll(() => {
  web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));
  nub = new NUB({
    web3: web3,
    mode: 'node',
    privateKey: process.env.PRIVATE_KEY || "",
  });
})

describe("Venus Deposit", () => {
  
  // test("Deposit in Venus", async () => {
  //   let spells = nub.Spell();
  //   //deposit BNB
  //   spells.add({
  //     connector: "BASIC-A",
  //     method: "deposit",
  //     args: [
  //       "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  //       "100000000000000",
  //       0,
  //       0
  //     ]
  //   })
  //   spells.add({
  //     connector: "VenusV2",
  //     method: "deposit",
  //     args: [
  //       "BNB-A",
  //       "100000000000000",
  //       0,
  //       0
  //     ]
  //   })
  //   //withdraw vBNB from Wizard
  //   spells.add({
  //     connector: "BASIC-A",
  //     method: "withdraw",
  //     args: [
  //       "0xA07c5b74C9B40447a954e1466938b865b6BBea36",
  //       "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  //       "0xd8Ee094FeB76A51dFE00e08Fbb1206c8b4B54D8E", // address to receive vBNB
  //       0,
  //       0
  //     ]
  //   })
  
  //   const txHash = spells.cast({value: "100000000000000", gasPrice})
  //   expect(txHash).toBeDefined();
  // }) 

  test("Test Estimate Cast Gas", async () => {
    console.log(nub.config);
    let spells = nub.Spell();
    //deposit BNB
    spells.add({
      connector: "BASIC-A",
      method: "deposit",
      args: [
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "100000000000000",
        0,
        0
      ]
    })

    const price = await spells.estimateCastGas({value: "100000000000000"});
    console.log(price);
  });
});
