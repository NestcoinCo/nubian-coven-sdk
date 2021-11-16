import { NUB } from '../nub';
import axios from "axios";

/**
 * generic ERC20 token methods
 */

export class PancakeV2 {
  constructor(private nub: NUB) {}
  
  /**
   * @param {address} _d.address address
   */
  async getLpPrice(address: string){
    address = address.toLowerCase();
    const res = await
            axios(
              {
                url: "https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2",
                method: "post",
                data: JSON.stringify({
                  query: `
                  query {
                    pair(id: "${address}"){
                      reserveUSD,
                      totalSupply
                    }
                  }`,
                }),
              }
            );
    if(res.data.pair === null){
      return 0;
    }
    
    const {data: {pair: {reserveUSD, totalSupply}}} = res.data;
    return reserveUSD/totalSupply;
  }
}
