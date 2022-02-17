import Web3 from "web3";
import { maxUint256 } from "../../constants";
import { Abi } from "../../constants/abi";

class Erc20{
  address: string;
  contract: any;
  private _decimals: number;

  constructor(address: string, web3: Web3){
    this.contract = new web3.eth.Contract(Abi.basics.erc20, address);
    this.address = address;
    this._decimals = -1;
  }

  async decimals(){
    if(this._decimals !== -1) return this._decimals;
    this._decimals = await this.contract.methods.decimals().call();
    return this._decimals;
  }

  async balanceOf(address: string){
    const balance = await this.contract.methods.balanceOf(address).call()
    return balance;
  }

  async approve(address: string){
    return this.contract.methods.approve(address, maxUint256).call();
  }

  async allowance(owner: string, spender:string){
    return this.contract.methods.allowance(owner, spender).call();
  }
}

export default Erc20;