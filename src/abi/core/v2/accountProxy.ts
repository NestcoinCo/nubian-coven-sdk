import { AbiItem } from 'web3-utils';
// @ts-ignore
export const accountProxy: AbiItem[] = [
  {
    inputs: [{ internalType: 'address', name: '_implementations', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [],
    name: 'implementations',
    outputs: [{ internalType: 'contract AccountImplementations', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];
