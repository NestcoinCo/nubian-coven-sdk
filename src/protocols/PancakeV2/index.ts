import { NUB } from '../../nub';
import { Abi } from '../../constants/abi';
import { Addresses, getTokenAddresses } from '../../constants';
import { AbiItem } from "web3-utils";


import getRoute from './getRoute';
import getLpPrice from './getLpPrice';
import swap from "./swap";


export default class PancakeV2 {
  private version: 2 = 2;
  // addresses
  ROUTER02_A: string = 
    Addresses.protocols.pancakeswap.chains[this.nub.CHAIN_ID].versions[this.version].ROUTER02;
  FACTORY_A: string = 
    Addresses.protocols.pancakeswap.chains[this.nub.CHAIN_ID].versions[this.version].FACTORY;
  
  // abis
  ROUTER02_ABI: AbiItem[] = Abi.pancakeswap.v2.router02;
  ERC20_ABI: AbiItem[] = Abi.basics.erc20;
  FACTORY_ABI: AbiItem[] = Abi.pancakeswap.v2.factory;

  // contracts
  router = new this.nub.web3.eth.Contract(this.ROUTER02_ABI, 
    this.ROUTER02_A
  );
  factory = new this.nub.web3.eth.Contract(this.FACTORY_ABI, 
    this.FACTORY_A
  );

  constructor(public nub: NUB) {
    
  }

  getRoute = getRoute.bind(this);
  getLpPrice = getLpPrice.bind(this);
  swap = swap.bind(this);
};
