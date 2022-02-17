import Web3 from "web3";
import { Abi } from "../../constants/abi";
import Erc20 from "./Erc20";

class VToken extends Erc20{
  address: string;
  contract: any;

  constructor(address: string, web3: Web3){
    super(address, web3);
    this.contract = new web3.eth.Contract(Abi.Venus.VToken, address);
    this.address = address;
  }

  async balanceOf(address: string){
    return this.contract.methods.balanceOf(address).call();
  }

  async getTokens(amount: string | number, underlyingDecimals:string){
    const oneVTokenInUnderlying = await this.getOneVTokenInUnderlying(underlyingDecimals);
    return +amount * oneVTokenInUnderlying;
  }

  async getOneVTokenInUnderlying(underlyingDecimals:string){
    const mantissa = 18 + parseInt(underlyingDecimals) - 8;
    const exchangeRate = await this.exchangeRate();
    return exchangeRate / Math.pow(10, mantissa);
  }

  async getVTokens(amount: string | number, underlyingDecimals:string){
    const oneVTokenInUnderlying = await this.getOneVTokenInUnderlying(underlyingDecimals);
    return +amount / oneVTokenInUnderlying;
  }

  async getCash(){
    return await this.contract.methods.getCash().call();
  }

  async exchangeRate(){
    return await this.contract.methods.exchangeRateCurrent().call();
  }

  async totalBorrows(){
    return await this.contract.methods.totalBorrowsCurrent().call();
  }

  async totalReserves(){
    return await this.contract.methods.totalReserves().call();
  }

  async totalSupply(){
    return await this.contract.methods.totalSupply().call();
  }

}

export default VToken;