import Web3 from "web3";

interface TxOptions{
  from: string,
  gasPrice?: string,
  gas?: number,
  value?: number|string,
  nonce?: number,
}

class Bnb{
  web3: Web3;
  decimals = () => 18;
  static address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  balanceOf: (address:string) => Promise<string>;

  constructor(web3: Web3){
    this.web3 = web3;
    this.balanceOf = async (address: string) => await this.web3.eth.getBalance(address);
  }

  // write functions: used only in test files
  async send(receiver: string, amount: string, options: TxOptions){
    await this.web3.eth.sendTransaction({
      ...options,
      to: receiver,
      value: amount
    })
  }
}

export default Bnb;