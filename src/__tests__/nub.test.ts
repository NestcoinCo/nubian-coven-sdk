const Web3 = require("web3");
import axios from "axios";
import { log } from "console";
import NUB from "..";
require('dotenv').config();
import constants from "../data/constants";


let web3;
let nub: NUB;
let gasPrice: string = '20000000000';
const {
  addresses: {mainnet: {tokens: { PRED }}}
} = constants;

beforeAll(() => {
  web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));
  nub = new NUB({
    web3: web3,
    mode: 'node',
    privateKey: process.env.PRIVATE_KEY || "",
  });
})

xdescribe('Estimate gas', () => {
  test("Estimate Gas", async () => {
    console.log(PRED);
    const price_obj = await nub.estimateGasForTokenTransfer( 
      PRED, 
      "0xD559864407F8B95a097200c85b657ED75db7cfc9", 
      1000000, 
    );

    console.log(price_obj);
  })
});

