import { AbiItem } from 'web3-utils'

export const VenusV2: AbiItem[] = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'borrow',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'vToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'borrowRaw',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'depositCToken',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'vToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'depositRaw',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'vToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'depositVTokenRaw',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'tokenIdToPay',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'tokenIdInReturn',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'liquidate',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenToPay',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'vTokenPay',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenInReturn',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'cTokenColl',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'liquidateRaw',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'buyToken',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sellToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'buyAmt',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sellAmt',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'LogBuy',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenA',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenB',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amtA',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amtB',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'uniAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'LogDepositLiquidity',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'buyToken',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sellToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'buyAmt',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sellAmt',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'LogSell',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenA',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenB',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountA',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountB',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'uniAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'setId',
        type: 'uint256[]',
      },
    ],
    name: 'LogWithdrawLiquidity',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'payback',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'vToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'paybackRaw',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'vTokenAmt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'withdrawCToken',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'vToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'vTokenAmt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'withdrawCTokenRaw',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'vToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'getId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'setId',
        type: 'uint256',
      },
    ],
    name: 'withdrawRaw',
    outputs: [
      {
        internalType: 'string',
        name: '_eventName',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_eventParam',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
