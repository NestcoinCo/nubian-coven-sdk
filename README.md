# Nubian Coven SDK
The official Nubain Coven Software Development Kit (SDK) for JavaScript, available for browsers and Node.js backends.

## Installation

To get started, install the nubian coven SDK package from npm:

```bash
npm install nubian-coven-sdk
```

### Usage

To enable web3 calls via SDK, instantiate [web3 library](https://github.com/ChainSafe/web3.js#installation)

```js
// in browser
if (window.ethereum) {
  window.web3 = new Web3(window.ethereum)
} else if (window.web3) {
  window.web3 = new Web3(window.web3.currentProvider)
} else {
  window.web3 = new Web3(customProvider)
}
```

```js
// in nodejs
const Web3 = require('web3')
const NUB = require('nubian-coven-sdk')
const web3 = new Web3(new Web3.providers.HttpProvider(ETH_NODE_URL))
```

Now instantiate NUB with web3 instance.

```js
// in browser
const nub = new NUB(web3)

// in nodejs
const nub = new NUB({
  web3: web3,
  mode: 'node',
  privateKey: PRIVATE_KEY,
})
```


## Casting Spells

**Spells** denotes a sequence of connector functions that will achieve a given use case. Spells can comprise of any number of functions across any number of connectors.

With this SDK, performing DeFi operations on your dapp consists of creating a `spells` instance to add transactions. Here is where you can initiate complex transactions amongst different protocols.

Create an instance:

```js
let spells = nub.Spell()
```

Add **spells** that you want to execute. Think of any action, and by just adding new SPELLS, you can wonderfully CAST transactions across protocols. Let's try to execute the following actions:

1. Deposit 1 BNB in Venus protocol.
2. Borrow 100 USDC from Venus.
3. Deposit borrowed USDC in Venus.

```js

// Deposit BNB in Venus

spells.add({
  connector: "VenusV2",
  method: "deposit",
  args: [
    "BNB-A",
    "1000000000000000000", // 1 BNB (10^18 wei)
    0,
    0
  ]
})

// Borrow USDC from Venus

spells.add({
  connector: "VenusV2",
  method: "borrow",
  args: [
    "USDC-A",
    "100000000000000000000", // 100 USDC (10^18 wei)
    0,
    0
  ]
})

// Deposit USDC in Venus

spells.add({
  connector: "VenusV2",
  method: "deposit",
  args: [
    "USDC-A",
    "100000000000000000000", // 100 USDC (10^18 wei)
    0,
    0
  ]
})
```

At last, cast your spell using `cast()` method.

```js
// in async functions
let transactionReceipt = await spells.cast({value: "1000000000000000000"})

// or
spells.cast().then(console.log) // returns transaction receipt
```

You can pass an object to send **optional** parameters like sending ETH along with the transaction.

```js
spells.cast({
  gasPrice: web3.utils.toWei(gasPrice, 'gwei'), // in gwei, used in node implementation.
  value: '1000000000000000000', // sending 1 BNB along with the transaction.
  nonce: nonce,
})
```

Here are the optional parameters.

| **Parameter (optional)** | **Type**        | **Description**                                                                                                                                                                |
| ------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| gasPrice               | `string/number` | The gas price in gwei. Mostly used in Node implementation to configure the transaction confirmation speed.                                                                     |
| value                  | `string/number` | Amount of BNB which you want to send along with the transaction (in wei).                                                                                                      |
| nonce                  | `string/number` | Nonce of your sender account. Mostly used in Node implementation to send transaction with a particular nonce either to override unconfirmed transaction or some other purpose. |

This will send the transaction to blockchain in node implementation (or ask users to confirm the transaction on web3 wallets like Metamask).

## Transaction History

You can see the list of transactions by an address:
```js
nub.getAccountTransactions("0x00");
```
Replace `0x0` with the address of the EOA.

## Eth and token Transfer

You can transfer tokens using the transferToken function.
```js
nub.transferToken(_tokenAddress, _recipient, _amount);
```

for Eth transfers, make use of the transferEth function.
```js
nub.transferEth(_recipient, _amount);
```

## Approval

You can approve the wizard contract to spend tokens on behalf of the user by calling the approve or infiniteApprove functions. 
```js
nub.infiniteApprove(_tokenAddress);
```

```js
nub.approve(_tokenAddress, _amount);
```



## Connectors

| **Name** | **Address** |
|-----|------|
| **PancakeV2** | 0x546bde105B24147bbd34F3147a0FD68961515Feb |
| **VenusV2** | 0xB03308Fa6A1Ecb489ECC86B7e930491020ee2b96 |
| **AutofarmV2** | 0x82aB4bCD90E99f31a90201669AACC6867c9c3B77 |
| **NubianStaking** | 0x0764C090a14E45Ae23F69732BeB28504f89D669A |
