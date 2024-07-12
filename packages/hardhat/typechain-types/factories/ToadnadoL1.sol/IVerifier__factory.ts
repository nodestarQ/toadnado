/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IVerifier,
  IVerifierInterface,
} from "../../ToadnadoL1.sol/IVerifier";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_proof",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "_publicInputs",
        type: "bytes32[]",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IVerifier__factory {
  static readonly abi = _abi;
  static createInterface(): IVerifierInterface {
    return new Interface(_abi) as IVerifierInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IVerifier {
    return new Contract(address, _abi, runner) as unknown as IVerifier;
  }
}
