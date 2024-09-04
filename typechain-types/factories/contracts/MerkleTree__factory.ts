/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BigNumberish,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  MerkleTree,
  MerkleTreeInterface,
} from "../../contracts/MerkleTree";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_levels",
        type: "uint32",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ROOT_HISTORY_SIZE",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "commitmentLeafs",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentRootIndex",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "filledSubtrees",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLastRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_left",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_right",
        type: "bytes32",
      },
    ],
    name: "hashLeftRight",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "_root",
        type: "bytes32",
      },
    ],
    name: "isKnownRoot",
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
  {
    inputs: [],
    name: "levels",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextIndex",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "roots",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "i",
        type: "uint256",
      },
    ],
    name: "zeros",
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
] as const;

const _bytecode =
  "0x6080604052600480546001600160401b031916905534801562000020575f80fd5b5060405162000d3838038062000d388339810160408190526200004391620005d7565b5f8163ffffffff1611620000aa5760405162461bcd60e51b815260206004820152602360248201527f5f6c6576656c732073686f756c642062652067726561746572207468616e207a60448201526265726f60e81b60648201526084015b60405180910390fd5b60148163ffffffff1610620001025760405162461bcd60e51b815260206004820152601e60248201527f5f6c6576656c732073686f756c64206265206c657373207468616e20323000006044820152606401620000a1565b5f805463ffffffff191663ffffffff83161781555b8163ffffffff168163ffffffff1610156200015b576200013d63ffffffff82166200019e565b63ffffffff82165f9081526002602052604090205560010162000117565b506200016d63ffffffff82166200019e565b5f805260036020527f3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92eff555062000603565b5f815f03620001ce57507f2fe54c60d3acabf3343a35b6eba15db4821b340f76e741e2249685ed4899af6c919050565b81600103620001fe57507f4fc2fe9184a25f44ce8ddb5f32671fcae6d9c85ed710c199acef16ad16b29911919050565b816002036200022e57507f0d826a474f851c563052d929ef0daa70f658aba9ba084f51f6e3483c13c0e59a919050565b816003036200025e57507ff7761a16b5e4c0120e4c5704b910dbe18ff6162a9668ed1c2c4efde7c4f15806919050565b816004036200028e57507fce9ce09a0ab259d6d14ca3dcd74e6c6b9e7d9074bff66973d4c57ccdffdb2a82919050565b81600503620002be57507f02efd44c63015ff1385344e0624867775486d05e6eb1290a24976964a598003b919050565b81600603620002ee57507fc4dec5845d407ce2ac2e6824bb7857c4b138f819e5789d5d11e812db10c846cd919050565b816007036200031e57507f5fbe3f20c23f3bd6ac347917fb0903433e0b9a48373412348240a5f919bfde19919050565b816008036200034e57507f92d1b07e56b3da96b7917778cb657f2c513eaeeb4d1579a73b5ea316f25b7289919050565b816009036200037e57507fa08add5656d6d3d0827ef909f7647981eac42aa1f51970a752f130f718f6d76a919050565b81600a03620003ae57507f1704c5f297590d8ec62776b0714f4f3f2234bae0524035342b0da8b8988ebd79919050565b81600b03620003de57507fc5ae2bd47379c2c6d1189cfc3d057948dc6054caf845fcacd8f7affe94b11944919050565b81600c036200040e57507f12a161d6d5561062f387d91ad9f0f8966c0956afdb9e8325458b9e5057b82bdb919050565b81600d036200043e57507f4ade524ba596de20bbe94507a761c45251ae7a27857ceb4287d9018525b99bc5919050565b81600e036200046e57507f38287ad69151fa833bf4bf8b8eb6ffb39400a38f1a7e53b473f639c8c60fd5e4919050565b81600f036200049e57507f57f2ade7d711707e785451f2aba6c95872c7fe03153a98b7327b4024e8068fa3919050565b81601003620004ce57507fb1982e0d1b0de46a88d8b17941472e41a86d3ff64571ed8e0ca72d58633547fc919050565b81601103620004fe57507fb7c60f8670af15eb32b4ee36727179bc085a3dde03d5f9a1486664ba576b30a6919050565b816012036200052e57507f5ff905c5c659a926b132ef3665a3de5d5a859c1d479e68851085bfc0348c5331919050565b816013036200055e57507fb4dfa78b912e98c9f7eb42d71eb537a02bf3173d44a2eb887a48b3972072dd8e919050565b816014036200058e57507f60919a16a2eb8b91cfb8ba1e5b4c155a76a14c217b5403edbd563f34e508ecdc919050565b60405162461bcd60e51b815260206004820152601360248201527f496e646578206f7574206f6620626f756e6473000000000000000000000000006044820152606401620000a1565b5f60208284031215620005e8575f80fd5b815163ffffffff81168114620005fc575f80fd5b9392505050565b61072780620006115f395ff3fe608060405234801561000f575f80fd5b50600436106100a6575f3560e01c8063ba70f7571161006e578063ba70f7571461016d578063c2b40ae414610189578063cd87a3b4146101a8578063e8295588146101b0578063f178e47c146101c3578063fc7e9c6f146101e2575f80fd5b806338bf282e146100aa5780634ecf518b146100f75780636d9833e31461011b57806390eeb02b1461013e5780639ec441541461014e575b5f80fd5b6100e46100b8366004610690565b604080516020808201949094528082019290925280518083038201815260609092019052805191012090565b6040519081526020015b60405180910390f35b5f546101069063ffffffff1681565b60405163ffffffff90911681526020016100ee565b61012e6101293660046106b0565b6101fa565b60405190151581526020016100ee565b6004546101069063ffffffff1681565b6100e461015c3660046106b0565b60016020525f908152604090205481565b60045463ffffffff165f908152600360205260409020546100e4565b6100e46101973660046106b0565b60036020525f908152604090205481565b610106601e81565b6100e46101be3660046106b0565b610273565b6100e46101d13660046106b0565b60026020525f908152604090205481565b60045461010690640100000000900463ffffffff1681565b5f81810361020957505f919050565b60045463ffffffff16805b63ffffffff81165f908152600360205260409020548403610239575060019392505050565b8063ffffffff165f0361024a5750601e5b80610254816106c7565b9150508163ffffffff168163ffffffff160361021457505f9392505050565b5f815f036102a257507f2fe54c60d3acabf3343a35b6eba15db4821b340f76e741e2249685ed4899af6c919050565b816001036102d157507f4fc2fe9184a25f44ce8ddb5f32671fcae6d9c85ed710c199acef16ad16b29911919050565b8160020361030057507f0d826a474f851c563052d929ef0daa70f658aba9ba084f51f6e3483c13c0e59a919050565b8160030361032f57507ff7761a16b5e4c0120e4c5704b910dbe18ff6162a9668ed1c2c4efde7c4f15806919050565b8160040361035e57507fce9ce09a0ab259d6d14ca3dcd74e6c6b9e7d9074bff66973d4c57ccdffdb2a82919050565b8160050361038d57507f02efd44c63015ff1385344e0624867775486d05e6eb1290a24976964a598003b919050565b816006036103bc57507fc4dec5845d407ce2ac2e6824bb7857c4b138f819e5789d5d11e812db10c846cd919050565b816007036103eb57507f5fbe3f20c23f3bd6ac347917fb0903433e0b9a48373412348240a5f919bfde19919050565b8160080361041a57507f92d1b07e56b3da96b7917778cb657f2c513eaeeb4d1579a73b5ea316f25b7289919050565b8160090361044957507fa08add5656d6d3d0827ef909f7647981eac42aa1f51970a752f130f718f6d76a919050565b81600a0361047857507f1704c5f297590d8ec62776b0714f4f3f2234bae0524035342b0da8b8988ebd79919050565b81600b036104a757507fc5ae2bd47379c2c6d1189cfc3d057948dc6054caf845fcacd8f7affe94b11944919050565b81600c036104d657507f12a161d6d5561062f387d91ad9f0f8966c0956afdb9e8325458b9e5057b82bdb919050565b81600d0361050557507f4ade524ba596de20bbe94507a761c45251ae7a27857ceb4287d9018525b99bc5919050565b81600e0361053457507f38287ad69151fa833bf4bf8b8eb6ffb39400a38f1a7e53b473f639c8c60fd5e4919050565b81600f0361056357507f57f2ade7d711707e785451f2aba6c95872c7fe03153a98b7327b4024e8068fa3919050565b8160100361059257507fb1982e0d1b0de46a88d8b17941472e41a86d3ff64571ed8e0ca72d58633547fc919050565b816011036105c157507fb7c60f8670af15eb32b4ee36727179bc085a3dde03d5f9a1486664ba576b30a6919050565b816012036105f057507f5ff905c5c659a926b132ef3665a3de5d5a859c1d479e68851085bfc0348c5331919050565b8160130361061f57507fb4dfa78b912e98c9f7eb42d71eb537a02bf3173d44a2eb887a48b3972072dd8e919050565b8160140361064e57507f60919a16a2eb8b91cfb8ba1e5b4c155a76a14c217b5403edbd563f34e508ecdc919050565b60405162461bcd60e51b8152602060048201526013602482015272496e646578206f7574206f6620626f756e647360681b604482015260640160405180910390fd5b5f80604083850312156106a1575f80fd5b50508035926020909101359150565b5f602082840312156106c0575f80fd5b5035919050565b5f63ffffffff8216806106e857634e487b7160e01b5f52601160045260245ffd5b5f19019291505056fea26469706673582212203c50495bad235eff5ec2908fe391fd05c99f9733dd83427c1ad5766daf3980b364736f6c63430008170033";

type MerkleTreeConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MerkleTreeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MerkleTree__factory extends ContractFactory {
  constructor(...args: MerkleTreeConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _levels: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_levels, overrides || {});
  }
  override deploy(
    _levels: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_levels, overrides || {}) as Promise<
      MerkleTree & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MerkleTree__factory {
    return super.connect(runner) as MerkleTree__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MerkleTreeInterface {
    return new Interface(_abi) as MerkleTreeInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): MerkleTree {
    return new Contract(address, _abi, runner) as unknown as MerkleTree;
  }
}
