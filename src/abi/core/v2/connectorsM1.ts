import { AbiItem } from 'web3-utils';

export const connectorM1: AbiItem[] = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'string', name: 'connectorName', type: 'string' },
      { indexed: true, internalType: 'address', name: 'connector', type: 'address' },
    ],
    name: 'LogConnectorAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'string', name: 'connectorName', type: 'string' },
      { indexed: true, internalType: 'address', name: 'connector', type: 'address' },
    ],
    name: 'LogConnectorRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'string', name: 'connectorName', type: 'string' },
      { indexed: true, internalType: 'address', name: 'oldConnector', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newConnector', type: 'address' },
    ],
    name: 'LogConnectorUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'addr', type: 'address' },
      { indexed: true, internalType: 'bool', name: 'isChief', type: 'bool' },
    ],
    name: 'LogController',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'string[]', name: '_connectorNames', type: 'string[]' },
      { internalType: 'address[]', name: '_connectors', type: 'address[]' },
    ],
    name: 'addConnectors',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'chief',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '', type: 'string' }],
    name: 'connectors',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
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
    inputs: [{ internalType: 'string[]', name: '_connectorNames', type: 'string[]' }],
    name: 'isConnectors',
    outputs: [
      { internalType: 'bool', name: 'isOk', type: 'bool' },
      { internalType: 'address[]', name: '_connectors', type: 'address[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string[]', name: '_connectorNames', type: 'string[]' }],
    name: 'removeConnectors',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_chiefAddress', type: 'address' }],
    name: 'toggleChief',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string[]', name: '_connectorNames', type: 'string[]' },
      { internalType: 'address[]', name: '_connectors', type: 'address[]' },
    ],
    name: 'updateConnectors',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
