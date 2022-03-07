import { NUB } from "../../nub";
import deposit from "./deposit";
import withdraw from "./withdraw";

export default class Venus{
  constructor(public nub: NUB){
    
  }

  deposit = deposit.bind(this);
  withdraw = withdraw.bind(this);
}