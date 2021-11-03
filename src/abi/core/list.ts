import { AbiItem } from 'web3-utils';

export const list: AbiItem[] = [
  {
    inputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    name: 'accountAddr',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'accountID',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    name: 'accountLink',
    outputs: [
      { internalType: 'address', name: 'first', type: 'address' },
      { internalType: 'address', name: 'last', type: 'address' },
      { internalType: 'uint64', name: 'count', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint64', name: '', type: 'uint64' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'accountList',
    outputs: [
      { internalType: 'address', name: 'prev', type: 'address' },
      { internalType: 'address', name: 'next', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'accounts',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
    name: 'addAuth',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'instaIndex',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
    name: 'removeAuth',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'userLink',
    outputs: [
      { internalType: 'uint64', name: 'first', type: 'uint64' },
      { internalType: 'uint64', name: 'last', type: 'uint64' },
      { internalType: 'uint64', name: 'count', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint64', name: '', type: 'uint64' },
    ],
    name: 'userList',
    outputs: [
      { internalType: 'uint64', name: 'prev', type: 'uint64' },
      { internalType: 'uint64', name: 'next', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
