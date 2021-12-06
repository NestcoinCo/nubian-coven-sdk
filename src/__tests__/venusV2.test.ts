const Web3 = require("web3");
import axios from "axios";
import { log } from "console";
import NUB from "..";
require('dotenv').config()

let web3;
let nub: NUB;
let gasPrice: string = '5000000000';
// Tokens
const BNB = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const vBNB = "0xA07c5b74C9B40447a954e1466938b865b6BBea36";
const TUSD = "0x14016e85a25aeb13065688cafb43044c2ef86784";
const vTUSD = "0x08ceb3f4a7ed3500ca0982bcd0fc7816688084c3";
const CAKE = "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82";
const vCAKE = "0x86ac3974e2bd0d60825230fa6f355ff11409df5c";

const maxAmt = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
let address: string;

beforeAll(() => {
  web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));
  nub = new NUB({
    web3: web3,
    mode: 'node',
    privateKey: process.env.PRIVATE_KEY || "",
  });
  address = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address;
})

describe("Venus Test", () => {
  
  xtest("Deposit in Venus", async () => {
    //await nub.erc20.approve({token: CAKE, gasPrice})
    let spells = nub.Spell();

    //deposit CAKE
    spells.add({
      connector: "BASIC-A",
      method: "deposit",
      args: [
        CAKE,
        "100000000000000000",
        0,
        0
      ]
    });

    spells.add({
      connector: "VenusV2",
      method: "deposit",
      args: [
        "CAKE-A",
        maxAmt,
        0,
        0
      ]
    });

    //withdraw vCAKE from Wizard
    spells.add({
      connector: "BASIC-A",
      method: "withdraw",
      args: [
        vCAKE,
        maxAmt,
        address, 
        0,
        0
      ]
    })
  
    const txHash = await spells.cast({gasPrice})
    expect(txHash).toBeDefined();
  })
  
  xtest("Withdraw from Venus", async () => {
    await nub.erc20.approve({token: vTUSD, gasPrice});
    let spells = nub.Spell();
    
    //deposit vTUSD in Wizard
    spells.add({
      connector: "BASIC-A",
      method: "deposit",
      args: [
        vTUSD,
        maxAmt,
        0,
        0
      ]
    })

    // withdraw TUSD from Venus
    spells.add({
      connector: "VenusV2",
      method: "withdraw",
      args: [
        "TUSD-A",
        maxAmt,
        0,
        0
      ]
    })

    // withdraw TUSD from Wizard
    spells.add({
      connector: "BASIC-A",
      method: "withdraw",
      args: [
        TUSD,
        maxAmt,
        address, // address to receive vBNB
        0,
        0
      ]
    })
  
    const txHash = await spells.cast({gasPrice})
    expect(txHash).toBeDefined();
  })
});
