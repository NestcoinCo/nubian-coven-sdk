import NUB from '..';
import { Abi } from '../abi';
import { Addresses } from '../addresses';

export default class Wbnb {
  contractInstance;
  nubInstance: NUB;
  constructor(nub: NUB) {
    this.contractInstance = new nub.web3.eth.Contract(Abi.Wbnb, Addresses.tokens.chains[nub.CHAIN_ID].WBNB);
    this.nubInstance = nub;
  }

  public async deposit(amount: number) {
    const from = await this.nubInstance.internal.getAddress();
    return await this.contractInstance.methods.deposit(amount).send({ from });
  }

  public async withdraw(amount: number) {
    const from = await this.nubInstance.internal.getAddress();
    return await this.contractInstance.methods.withdraw(amount).send({ from });
  }
}
