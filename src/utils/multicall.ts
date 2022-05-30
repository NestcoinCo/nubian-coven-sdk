import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from "ethereum-multicall";
import Web3 from "web3";
// tslint:disable-next-line
const uniqueSlug = require('unique-slug')

export const singleContractMultipleData = async ({ web3, address, abi, methods, methodParams = []}: 
  {web3: Web3, reference: string, address: string, abi: any, methods: string[], methodParams?: ((string|number)[])[]}) => {
  const multicall = new Multicall({
    web3Instance: web3, tryAggregate: true, 
    multicallCustomContractAddress: process.env.NODE_ENV === "test" 
      ? "0xC50F4c1E81c873B2204D7eFf7069Ffec6Fbe136D" 
      : undefined
  });
  const callReferences: string[] = [];
  const calls = methods.map( (method, index): ContractCallContext["calls"][0] => {
    const reference = uniqueSlug(); 
    callReferences.push(reference);
    return {
      methodName: method,
      methodParameters: methodParams[index],
      reference,
    }
  })
  
  const mainRef = uniqueSlug();
  const context: ContractCallContext = {
    contractAddress: address,
    abi,
    reference: mainRef,
    calls
  }

  const results: ContractCallResults["results"] = (await multicall.call(context)).results;
  return callReferences.map( ref => {
    return results[mainRef].callsReturnContext.filter(({reference}) => ref === reference)[0].returnValues
  })
}

export const multipleContractsSingleData = async ({web3, addresses, abi, method, methodParams = []}: 
  {web3: Web3, addresses: string[], abi: any, method: string, methodParams?: (string|number)[]}) => {
  const multicall = new Multicall({
    web3Instance: web3, tryAggregate: true, 
    multicallCustomContractAddress: process.env.NODE_ENV === "test" 
      ? "0xC50F4c1E81c873B2204D7eFf7069Ffec6Fbe136D" 
      : undefined
  });
  const callReference = uniqueSlug();
  const calls: ContractCallContext["calls"] = [{
    methodName: method,
    methodParameters: methodParams,
    reference: callReference,
  }]
  
  const methodReferences: string[] = [];
  const context: ContractCallContext[] = addresses.map( address => {
    const reference = uniqueSlug();
    methodReferences.push(reference);
    return {
      contractAddress: address,
      abi,
      reference,
      calls,
    }
  });

  const results: ContractCallResults["results"] = (await multicall.call(context)).results;
  return methodReferences.map( ref => {
    return results[ref].callsReturnContext[0].returnValues
  })
}
