import { AbiItem } from 'web3-utils'

export const read: AbiItem[] = [
  {
    inputs: [
      { internalType: 'address', name: '_index', type: 'address' },
      { internalType: 'address', name: 'gnosisFactory', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'connectors',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint64', name: 'id', type: 'uint64' }],
    name: 'getAccount',
    outputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getAccountAuthorities',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getAccountAuthoritiesTypes',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'uint256', name: 'authType', type: 'uint256' },
        ],
        internalType: 'struct AccountResolver.AuthType[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getAccountDetails',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'ID', type: 'uint256' },
          { internalType: 'address', name: 'account', type: 'address' },
          { internalType: 'uint256', name: 'version', type: 'uint256' },
          {
            internalType: 'address[]',
            name: 'authorities',
            type: 'address[]',
          },
        ],
        internalType: 'struct AccountResolver.AccountData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'getAccountIdDetails',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'ID', type: 'uint256' },
          { internalType: 'address', name: 'account', type: 'address' },
          { internalType: 'uint256', name: 'version', type: 'uint256' },
          {
            internalType: 'address[]',
            name: 'authorities',
            type: 'address[]',
          },
        ],
        internalType: 'struct AccountResolver.AccountData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address[]', name: 'accounts', type: 'address[]' }],
    name: 'getAccountVersions',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'authority', type: 'address' }],
    name: 'getAuthorityAccounts',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'authority', type: 'address' }],
    name: 'getAuthorityDetails',
    outputs: [
      {
        components: [
          { internalType: 'uint64[]', name: 'IDs', type: 'uint64[]' },
          {
            internalType: 'address[]',
            name: 'accounts',
            type: 'address[]',
          },
          {
            internalType: 'uint256[]',
            name: 'versions',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct AccountResolver.AuthorityData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'authority', type: 'address' }],
    name: 'getAuthorityIDs',
    outputs: [{ internalType: 'uint64[]', name: '', type: 'uint64[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'authorities',
        type: 'address[]',
      },
    ],
    name: 'getAuthorityTypes',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'uint256', name: 'authType', type: 'uint256' },
        ],
        internalType: 'struct AccountResolver.AuthType[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_addr', type: 'address' }],
    name: 'getContractCode',
    outputs: [{ internalType: 'bytes', name: 'o_code', type: 'bytes' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getEnabledConnectors',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getEnabledConnectorsData',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'connector', type: 'address' },
          {
            internalType: 'uint256',
            name: 'connectorID',
            type: 'uint256',
          },
          { internalType: 'string', name: 'name', type: 'string' },
        ],
        internalType: 'struct ConnectorsResolver.ConnectorsData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getID',
    outputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'getIDAuthorities',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStaticConnectors',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStaticConnectorsData',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'connector', type: 'address' },
          {
            internalType: 'uint256',
            name: 'connectorID',
            type: 'uint256',
          },
          { internalType: 'string', name: 'name', type: 'string' },
        ],
        internalType: 'struct ConnectorsResolver.ConnectorsData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'index',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'isShield',
    outputs: [{ internalType: 'bool', name: 'shield', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'list',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
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
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]
