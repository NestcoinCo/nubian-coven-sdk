import { AbiItem } from 'web3-utils';

export const NubianStaking: AbiItem[] = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'recordId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'getId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'setId', type: 'uint256' },
    ],
    name: 'LogBorrow',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'recordId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amt', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'getId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'setId', type: 'uint256' },
    ],
    name: 'LogDeposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'recordId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amt', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'getId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'setId', type: 'uint256' },
    ],
    name: 'LogWithdraw',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amt', type: 'uint256' },
      { internalType: 'uint256', name: 'lockPeriod', type: 'uint256' },
      { internalType: 'uint256', name: 'getId', type: 'uint256' },
      { internalType: 'uint256', name: 'setId', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [
      { internalType: 'string', name: '_eventName', type: 'string' },
      { internalType: 'bytes', name: '_eventParam', type: 'bytes' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'recordId', type: 'uint256' },
      { internalType: 'uint256', name: 'getId', type: 'uint256' },
      { internalType: 'uint256', name: 'setId', type: 'uint256' },
    ],
    name: 'withdraw',
    outputs: [
      { internalType: 'string', name: '_eventName', type: 'string' },
      { internalType: 'bytes', name: '_eventParam', type: 'bytes' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
];
