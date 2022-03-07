import { Abi } from '../../constants/abi';
import BigNumber from "bignumber.js";
import PancakeV2 from '.';
import { getTokenAddress } from '../../constants';


async function getLpPrice(this: PancakeV2, lpAddress: string) {
  const lpToken = new this.nub.web3.eth.Contract(
    Abi.pancakeswap.v2.lpToken, 
    lpAddress
  );

  const BNB = getTokenAddress("BNB", this.nub);
  const WBNB = getTokenAddress("WBNB", this.nub);
  const BUSD = getTokenAddress("BUSD", this.nub);

  const tokens = [await lpToken.methods.token0().call(), await lpToken.methods.token1().call()];

  let bnbValue = 0;
  for (let i = 0; i<2; ++i){
    if (tokens[i] === WBNB) {
      continue;
    }

    const token = new this.nub.web3.eth.Contract(this.ERC20_ABI, tokens[i]);
    const tokenDecimals = await token.methods.decimals().call();

    try{
      bnbValue = (await this.router.methods.getAmountsOut((new BigNumber(10)).pow(tokenDecimals), [
        tokens[i], BNB]).call())[1];
    }catch(err){
      console.log("Error in getting BNB value", err);
    }

    if(bnbValue === 0) continue;
    let bnbPrice = (await 
      this.router.methods.getAmountsOut(this.nub.web3.utils.toWei("1", "ether"), 
        [BNB, BUSD]
      ).call())[1];
    
    const lpSupply = await lpToken.methods.totalSupply().call();

    
    let lpBalance = await token.methods.balanceOf(lpAddress).call();

    bnbPrice = new BigNumber(bnbPrice);
    lpBalance = new BigNumber(lpBalance);

    const tokenPrice = bnbPrice.times(bnbValue).div(10**18).div(10**18);

    const totalUSDValue = (lpBalance.times(2).times(tokenPrice).div((new BigNumber(10)).pow(tokenDecimals)));
    return totalUSDValue.div(lpSupply).times(this.nub.web3.utils.toWei("1", "ether")).toFixed(2);
  }

  return 0;
  }

export default getLpPrice;