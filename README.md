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
const web3 = new Web3(new Web3.providers.HttpProvider(BSC_RPC_URL))
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


The Nubian SDK provides methods to swap and save tokens.

#### Swap

```js
nub.pancakeswap.swap({ 
  amountA, 
  amountB, 
  tokenA, 
  tokenB,
  path
  [, slippage 
    [, receiver 
      [, ...transactionConfig ]]]
}) => Promise<TransactionReceipt>
```

This function swaps a token for another. It is a promise that resolves to a transaction receipt if it is successful. It throws an error if it is unsuccessful.

| **Parameter** | **Type** | **Description** |
|-----|---------|------|
| **tokenA** |`string`| Address of token to swap. Use `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` for BNB.|
| **tokenB** |`string`| Address of token to swap to. Use `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` for BNB. |
|**amountA**|`string/number`| Amount of `tokenA` to be swapped. |
|**amountB**|`string/number`| Amount of `tokenB` expected to recieve from swap. You can use the [swap path](#util-methods) util method to deduce it.|
|**path**| `string[]` | The tokens you want `tokenA` to swapped to before being swapped to `tokenB`.|
| **slippage** |`number`| The percentage amount `amountB` can reduce by. E.g pass`2` if you do not want `amountB` from swap to go less than 2%. (optional).  |
| **reciever** |`string` | The address to receive the swap output. It defaults to the address from the web3 instance in browser mode or the address of the private key in node environment. (optional) |
|**transactionConfig**|`object`| It is an object that specifies blockchain transaction properties. Check [common terms](#common-terms) for an exhaustive description.|

#### Swap Path/Token Price

When swapping using Pancakeswap each token has a price and a swap path. The swap path refers to the tokens the token you want to swap will be exchanged with before being converted to the destination token. This function returns the most efficient path for the swap and the amount of tokens you get or need to supply.

```js
nub.pancakeswap.getRoute(
  tokenIn, 
  tokenOut, 
  amount,
  direction, 
  fresh
) => Promise<[string, string[]]>
```

| **Parameter** | **Type** | **Description** |
|-----|---------|------|
| **tokenIn** |`string`| Address of token to swap. Use `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` for BNB.|
| **tokenOut** |`string`| Address of token to swap to. Use `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` for BNB. |
|**amount**|`string`| Amount of `tokenIn` to swap or the amount of `tokenOut` you want. It should be formatted with the decimal points. |
|**direction**|`IN\|OUT`| It is used to indicate which token owns `amount`. "IN" indicates `amount` is the number of tokens to swap while "OUT" indicates `amount` is the number of tokens you want from swap. |
|**fresh**| `boolean` | When you first call getRoute on a pancakeswap instance, the details used to calculate the path are saved. `fresh` indicates if you want new details fetched from the chain or old details used. |


This function returns a promise that resolves to an object.
| Object Property | Type |Description |
| ----------- | ---------|------------------------------------------------------- |
| amount    |  `string`     |The amount of tokens you get from swap or amount of tokens needed for swap. Depends on the value of direction. Decimal points are applied. |
| path      |  `string[]`  | An array of the path/route for possible token swap |

#### Save

```js
nub.venus.deposit({
  amount,
  address
  [, receiver
    [, ...transactionConfig ]]
}) => Promise<TransactionReceipt>
```

This function saves token deposits in Venus protocol. When you save, Venus gives you [vTokens](#vtokens). These are tokens that serve as proof of deposit. To get back your tokens saved, you must provide these vTokens. Venus has a set of tokens it allows you to save.

| **Parameter** | **Type** | **Description** |
|-----|---------|------|
| **address** |`string`| Address of token to save. Use `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` for BNB. |
|**amount**|`string/number`| Amount of token to save. |
| **reciever** |`string` | The address to receive the vtokens. It defaults to the address from the web3 instance in browser mode or the address of the private key in node environment. (optional) |
|**transactionConfig**|`object`| It is an object that specifies blockchain transaction properties. Check [common terms](#common-terms) for an exhaustive description.|

#### Withdraw Savings

```js
nub.venus.withdraw({
  vTokenAddress
  [, vTokenAmount 
    [, tokenAmount
      [, receiver
        [, ...transactionConfig ]]]]
}) => Promise<TransactionReceipt>
```

This function allows you to withdraw tokens saved in Venus protocol. You will need to have the corresponding [vToken](#vtokens) of the token you want to withdraw.

| **Parameter** | **Type** | **Description** |
|-----|---------|------|
| **vTokenAddress** |`string`| vToken address of the token you want to withdraw. |
|**vTokenAmount**|`string/number`| Amount of vTokens you want to withdraw. You must provide this or the `tokenAmount`. (optional)|
|**tokenAmount**|`string/number`| Amount of `vTokenAddress` corresponding token you want to withdraw. You must provide this or the `vTokenAmount`. (optional)|
| **reciever** |`string` | The address to receive the vtokens. It defaults to the address from the web3 instance in browser mode or the address of the private key in node environment. (optional) |
|**transactionConfig**|`object`| It is an object that specifies blockchain transaction properties. Check [common terms](#common-terms) for an exhaustive description. |

**Note**: You must provide one of `vTokenAmount` and `tokenAmount`.

### Util Methods

#### Token Transfer

You can transfer tokens using the erc20 transfer function. It receives an object as input. It returns a promise that resolves to a transaction object

```javascript
nub.erc20.transfer({
  token, amount, to [, ...transactionConfig]
}) => Promise<TransactionReceipt>
```

| Object Parameters | Type   | Description                                                                                                            |
| ----------------- | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| token             | `string` | The address of the ERC20 token you want to send.                                                                       |
| amount            | `string` | The amount of tokens you want to send. It must include the decimal places of the token. E.g `1*10**18` to send 1 WBNB. |
| to                | `string` | The address you want to send the token to.                                                                             |

#### Estimate Token Transfer Gas

This helps you get the estimated gas needed to do a token transfer based on current network activity. It takes the same parameters as token transfer.

```javascript
nub.erc20.estimateTransferGas({
  token, amount, to [, ...transactionConfig]
}) => Promise<TransactionReceipt>
```

It returns a promise that resolves to the [gas object](#gas-object).


#### BNB Transfer

For BNB transfers, use the eth transfer function. It also receives an object as input. It returns a promise that resolves to a transaction object.

```javascript
nub.eth.transfer({amount, to [, ...transactionConfig]}) => Promise<TransactionReceipt>;
```

| Object Parameters | Type   | Description                                                    |
| ----------------- | ------ | -------------------------------------------------------------- |
| amount            | `string` | The amount of BNB you want to send in wei (smallest BNB unit). |
| to                | `string` | The address you want to send the BNB.                          |

#### Estimate BNB Transfer Gas

Estimates the fee details needed to make a token transfer.

```js
nub.eth.estimateTransferGas({amount, to [, ...transactionConfig]})
```

It returns a promise that resolves to the [gas object](#gas-object).

#### Wrap BNB

BNB can be wrapped to WBNB using the SDK.

```js
nub.wbnb.wrap({amount [, ...transactionConfig]}) => Promise<TransactionReceipt>
```

The function takes in the amount of BNB you want to wrap. It returns a promise that resolves to a transaction receipt.

#### Estimate Wrap Gas

```js
nub.wbnb.estimateWrapGas({amount [, ...transactionConfig]}) => Promise<GasObject>
```

The function takes in the amount of BNB you want to use in estimation. It returns a promise that resolves to the [gas object](#gas-object).

#### Unwrap BNB

WBNB can be unwrapped to BNB.&#x20;

```js
nub.wbnb.unwrap({amount [, ...transactionConfig]}) => Promise<TransactionReceipt>
```

The function takes in the amount of WBNB you want to unwrap. You must have this amount of WBNB already approved. It returns a promise that resolves to a transaction receipt.

#### Estimate Unwrap Gas

```js
nub.wbnb.unwrap({amount [, ...transactionConfig]}) => Promise<GasObject>
```

The function takes in the amount of WBNB you want to unwrap.&#x20;

#### Approval

You can approve addresses to spend the ERC20 token. It also receives an object as input and returns a promise that resolves to a transaction object.

```javascript
nub.erc20.approve({
  token
  [, amount
    [, to
      [, ...transactionConfig]]]
}) => Promise<TransactionReceipt>
```

| Object Parameters | Type   | Description                                                                                                                                                                     |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| token             | `string` | Address of the token you want to approve for a spender.                                                                                                                         |
| amount            | `string` | The amount of tokens to be approved for spending. If empty it defaults to [maxUint256](#maxuint256) i.e an infinite approval. It must include the decimal places of the token. E.g `1*10**18` to send 1 WBNB. (optional) |
| to                | `string` | The address to be approved. It defaults to the Wizard address if not passed.(optional)                                                                              |

#### Estimate Approval Gas

This helps you get the estimated gas needed to do an approval based on current network activity. It takes the same parameters as approvals.

```javascript
nub.erc20.estimateApproveGas({
  token
  [, amount
    [, to
      [, ...transactionConfig]]]
}) => Promise<GasObject>
```

It returns a promise that resolves to the [gas object](#gas-object).

#### Pancakeswap LpToken Price

You can get the price of a Pancakeswap Liquidity provider token (lptoken) in US dollars using this function. It returns a promise that resolves to a number and takes the address of the lp token as an input.

```js
nub.pancakeswap.getLpPrice(tokenAddress) => Promise<number>
```

#### Common Terms

##### Transaction Config

| **Parameter (optional)** | **Type**        | **Description**                                                                                                                                                                |
| ------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| gasPrice               | `string/number` | The gas price in gwei. Mostly used in Node implementation to configure the transaction confirmation speed.                                                                     |
| value                  | `string/number` | Amount of BNB which you want to send along with the transaction (in wei).                                                                                                      |
| nonce                  | `string/number` | Nonce of your sender account. Mostly used in Node implementation to send transaction with a particular nonce either to override unconfirmed transaction or some other purpose. |
|from |`string`| The address to send the transaction from. It defaults to the address from the web3 instance in browser mode or the address of the private key in node environment.  |

##### Transaction Receipt

The transaction receipt describes various properties of the blockchain transaction. It is properly described in the [web3js documentation](https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=receipt#eth-gettransactionreceipt-return).

##### Gas Object

This object contains all the fee/gas information needed for a transaction.

| Property |         Description                                   |
| ---------------- | ------------------------------------------ |
| gas              | The amount of gas to be used.              |
| price            | The price for each unit of gas in wei.     |
| fee              | The fee for the transaction. (gas\*price). |

##### maxUint256

This is the the maximum figure that can be held in the `uint256` type of solidity. It can be represented in Javascript using `0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`.

##### vTokens

vTokens are ERC20 tokens that Venus mints to an address when it makes a successful deposit into the Venus protocol. These tokens are returned when a withdrawal is made. The amount an address has saved can be deduced from the amount of vTokens in its balance. These tokens are transferrable. Here is a list of tokens supported by Venus and their corresponding vToken addresses:

| TokenId | Token                                      | vToken                                     |
| ------- | ------------------------------------------ | ------------------------------------------ |
| BNB   | 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE | 0xA07c5b74C9B40447a954e1466938b865b6BBea36 |
| BUSD  | 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56 | 0x95c78222B3D6e262426483D42CfA53685A67Ab9D |
| SXP   | 0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A | 0x2fF3d0F6990a40261c66E1ff2017aCBc282EB6d0 |
| USDC  | 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d | 0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8 |
| USDT  | 0x55d398326f99059fF775485246999027B3197955 | 0xfD5840Cd36d94D7229439859C0112a4185BC0255 |
| XVS   | 0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63 | 0x151B1e2635A717bcDc836ECd6FbB62B674FE3E1D |
| BTC   | 0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c | 0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B |
| ETH   | 0x2170Ed0880ac9A755fd29B2688956BD959F933F8 | 0xf508fCD89b8bd15579dc79A6827cB4686A3592c8 |
| LTC   | 0x4338665CBB7B2485A8855A139b75D5e34AB0DB94 | 0x57A5297F2cB2c0AaC9D554660acd6D385Ab50c6B |
| XRP   | 0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE | 0xB248a295732e0225acd3337607cc01068e3b9c10 |
| BCH   | 0x8ff795a6f4d97e7887c79bea79aba5cc76444adf | 0x5f0388ebc2b94fa8e123f404b79ccf5f40b29176 |
| DOT   | 0x7083609fce4d1d8dc0c979aab8c869ea2c873402 | 0x1610bc33319e9398de5f57b33a5b184c806ad217 |
| LINK  | 0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd | 0x650b940a1033b8a1b1873f78730fcfc73ec11f1f |
| DAI   | 0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3 | 0x334b3ecb4dca3593bccc3c7ebd1a1c1d1780fbf1 |
| FIL   | 0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153 | 0xf91d58b5ae142dacc749f58a49fcbac340cb0343 |
| BETH  | 0x250632378e573c6be1ac2f97fcdf00515d0aa91b | 0x972207a639cc1b374b893cc33fa251b55ceb7c0  |
| ADA   | 0x3ee2200efb3400fabb9aacf31297cbdd1d435d47 | 0x9a0af7fdb2065ce470d72664de73cae409da28ec |
| DOGE  | 0xba2ae424d960c26247dd6c32edc70b295c744c43 | 0xec3422ef92b2fb59e84c8b02ba73f1fe84ed8d71 |
| MATIC | 0xcc42724c6683b7e57334c4e856f4c9965ed682bd | 0x5c9476fcd6a4f9a3654139721c949c2233bbbbc8 |
| CAKE  | 0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82 | 0x86ac3974e2bd0d60825230fa6f355ff11409df5c |
| AAVE  | 0xfb6115445bff7b52feb98650c87f44907e58f802 | 0x26da28954763b92139ed49283625cecaf52c6f94 |
| TUSD  | 0x14016e85a25aeb13065688cafb43044c2ef86784 | 0x08ceb3f4a7ed3500ca0982bcd0fc7816688084c3 |
