import Web3 from "web3";

class Bnb{
  web3: Web3;
  decimals = () => 18;
  static address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  balanceOf: (address:string) => Promise<string>;

  constructor(web3: Web3){
    this.web3 = web3;
    this.balanceOf = async (address: string) => await this.web3.eth.getBalance(address);
  }
  
}

export default Bnb;