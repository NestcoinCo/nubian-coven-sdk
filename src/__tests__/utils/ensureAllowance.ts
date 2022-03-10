import Bnb from "../../protocols/utils/Bnb";
import Erc20 from "../../protocols/utils/Erc20";
import VToken from "../../protocols/utils/VToken";

const ensureAllowance = async (Tokens: ( Bnb|Erc20|VToken )[], owner: string, spender: string, amounts: (string|number)[]) => {
  for ( let i = 0; i < Tokens.length; i++){
    const token = Tokens[i];
    if(token instanceof Bnb) return;
    if ( await token.allowance(owner, spender) > amounts[i]) return;
    await token.approve(spender, {from: owner});
  }
}

export default ensureAllowance;

