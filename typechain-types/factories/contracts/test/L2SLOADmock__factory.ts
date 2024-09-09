/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  L2SLOADmock,
  L2SLOADmockInterface,
} from "../../../contracts/test/L2SLOADmock";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    stateMutability: "nonpayable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "decodeInput",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "key",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "slotNumber",
        type: "uint256",
      },
    ],
    name: "hashMappingSlot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "hii",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "mockedSlots",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_l1ContactAddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_slot",
        type: "uint256",
      },
    ],
    name: "readMockedSlot",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "l1ContactAddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "slot",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "value",
        type: "bytes",
      },
    ],
    name: "setMockedSlot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561000f575f80fd5b506107e08061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610060575f3560e01c806326e2872b1461012d5780632e065ae514610153578063540811ed1461018557806373475633146101a55780637693efb6146101ba578063aa628538146101cd575b5f3660605f8061007085856101d5565b6001600160a01b0382165f9081526020818152604080832084845290915290208054929450909250906100a290610469565b80601f01602080910402602001604051908101604052809291908181526020018280546100ce90610469565b80156101195780601f106100f057610100808354040283529160200191610119565b820191905f5260205f20905b8154815290600101906020018083116100fc57829003601f168201915b505050505092505050915050805190602001f35b61014061013b3660046104a1565b610211565b6040519081526020015b60405180910390f35b6101666101613660046104ff565b6101d5565b604080516001600160a01b03909316835260208301919091520161014a565b610198610193366004610555565b610240565b60405161014a919061057f565b6101b86101b33660046105cb565b610398565b005b6101986101c8366004610555565b6103ca565b6101a4610140565b5f806101e46014828587610623565b6101ed9161064a565b6101fb603460148688610623565b6102049161064a565b90925090505b9250929050565b604080516020808201859052818301849052825180830384018152606090920190925280519101205b92915050565b604051606083811b6bffffffffffffffffffffffff1916602083015260348201839052905f9060540160408051601f1981840301815290829052632e065ae560e01b825291505f9081903090632e065ae5906102a090869060040161057f565b6040805180830381865afa1580156102ba573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906102de9190610667565b6001600160a01b0388165f90815260208181526040808320848452909152812080549395509193509161031090610469565b80601f016020809104026020016040519081016040528092919081815260200182805461033c90610469565b80156103875780601f1061035e57610100808354040283529160200191610387565b820191905f5260205f20905b81548152906001019060200180831161036a57829003601f168201915b50939b9a5050505050505050505050565b6001600160a01b0384165f9081526020818152604080832086845290915290206103c38284836106f0565b5050505050565b5f602081815292815260408082209093529081522080546103ea90610469565b80601f016020809104026020016040519081016040528092919081815260200182805461041690610469565b80156104615780601f1061043857610100808354040283529160200191610461565b820191905f5260205f20905b81548152906001019060200180831161044457829003601f168201915b505050505081565b600181811c9082168061047d57607f821691505b60208210810361049b57634e487b7160e01b5f52602260045260245ffd5b50919050565b5f80604083850312156104b2575f80fd5b50508035926020909101359150565b5f8083601f8401126104d1575f80fd5b50813567ffffffffffffffff8111156104e8575f80fd5b60208301915083602082850101111561020a575f80fd5b5f8060208385031215610510575f80fd5b823567ffffffffffffffff811115610526575f80fd5b610532858286016104c1565b90969095509350505050565b6001600160a01b0381168114610552575f80fd5b50565b5f8060408385031215610566575f80fd5b82356105718161053e565b946020939093013593505050565b5f602080835283518060208501525f5b818110156105ab5785810183015185820160400152820161058f565b505f604082860101526040601f19601f8301168501019250505092915050565b5f805f80606085870312156105de575f80fd5b84356105e98161053e565b935060208501359250604085013567ffffffffffffffff81111561060b575f80fd5b610617878288016104c1565b95989497509550505050565b5f8085851115610631575f80fd5b8386111561063d575f80fd5b5050820193919092039150565b8035602083101561023a575f19602084900360031b1b1692915050565b5f8060408385031215610678575f80fd5b82516106838161053e565b6020939093015192949293505050565b634e487b7160e01b5f52604160045260245ffd5b601f8211156106eb57805f5260205f20601f840160051c810160208510156106cc5750805b601f840160051c820191505b818110156103c3575f81556001016106d8565b505050565b67ffffffffffffffff83111561070857610708610693565b61071c836107168354610469565b836106a7565b5f601f84116001811461074d575f85156107365750838201355b5f19600387901b1c1916600186901b1783556103c3565b5f83815260208120601f198716915b8281101561077c578685013582556020948501946001909201910161075c565b5086821015610798575f1960f88860031b161c19848701351681555b505060018560011b018355505050505056fea264697066735822122044adc93ada42570cb2ea3150f89bd674c96b0a0c6d79a56d16dcb1287af3712e64736f6c63430008170033";

type L2SLOADmockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: L2SLOADmockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class L2SLOADmock__factory extends ContractFactory {
  constructor(...args: L2SLOADmockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      L2SLOADmock & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): L2SLOADmock__factory {
    return super.connect(runner) as L2SLOADmock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): L2SLOADmockInterface {
    return new Interface(_abi) as L2SLOADmockInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): L2SLOADmock {
    return new Contract(address, _abi, runner) as unknown as L2SLOADmock;
  }
}