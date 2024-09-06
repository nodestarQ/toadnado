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
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  ToadnadoL1,
  ToadnadoL1Interface,
} from "../../contracts/ToadnadoL1";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_verifier",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_denomination",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "_merkleTreeHeight",
        type: "uint32",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [],
    name: "VerificationFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "commitment",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "leafIndex",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "nullifier",
        type: "bytes32",
      },
    ],
    name: "Withdrawal",
    type: "event",
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
    inputs: [],
    name: "adminWithdraw",
    outputs: [],
    stateMutability: "payable",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "commitments",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "commitmentsTreeRoots",
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
    inputs: [],
    name: "denomination",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_commitment",
        type: "bytes32",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
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
    name: "isKnownL1Root",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "_root",
        type: "bytes32",
      },
    ],
    name: "isKnownL2Root",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "_nullifierHash",
        type: "bytes32",
      },
    ],
    name: "isSpent",
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
    inputs: [
      {
        internalType: "bytes32[]",
        name: "_nullifierHashes",
        type: "bytes32[]",
      },
    ],
    name: "isSpentArray",
    outputs: [
      {
        internalType: "bool[]",
        name: "spent",
        type: "bool[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "l2Address",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
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
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "nullifiers",
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
    inputs: [],
    name: "verifier",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_l1root",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_l2root",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_nullifier",
        type: "bytes32",
      },
      {
        internalType: "address payable",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "snarkProof",
        type: "bytes",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "payable",
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
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x6080604052600480546001600160401b031916905534801562000020575f80fd5b5060405162001dd438038062001dd4833981016040819052620000439162000666565b828282805f8163ffffffff1611620000ae5760405162461bcd60e51b815260206004820152602360248201527f5f6c6576656c732073686f756c642062652067726561746572207468616e207a60448201526265726f60e81b60648201526084015b60405180910390fd5b60148163ffffffff1610620001065760405162461bcd60e51b815260206004820152601e60248201527f5f6c6576656c732073686f756c64206265206c657373207468616e20323000006044820152606401620000a5565b5f805463ffffffff191663ffffffff83161781555b8163ffffffff168163ffffffff1610156200015f576200014163ffffffff82166200022d565b63ffffffff82165f908152600260205260409020556001016200011b565b506200017163ffffffff82166200022d565b5f805260036020527f3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92eff5550600160055581620001fe5760405162461bcd60e51b815260206004820152602560248201527f64656e6f6d696e6174696f6e2073686f756c6420626520677265617465722074604482015264068616e20360dc1b6064820152608401620000a5565b50600780546001600160a01b0319166001600160a01b03939093169290921790915560065550620006bc915050565b5f815f036200025d57507f2fe54c60d3acabf3343a35b6eba15db4821b340f76e741e2249685ed4899af6c919050565b816001036200028d57507f4fc2fe9184a25f44ce8ddb5f32671fcae6d9c85ed710c199acef16ad16b29911919050565b81600203620002bd57507f0d826a474f851c563052d929ef0daa70f658aba9ba084f51f6e3483c13c0e59a919050565b81600303620002ed57507ff7761a16b5e4c0120e4c5704b910dbe18ff6162a9668ed1c2c4efde7c4f15806919050565b816004036200031d57507fce9ce09a0ab259d6d14ca3dcd74e6c6b9e7d9074bff66973d4c57ccdffdb2a82919050565b816005036200034d57507f02efd44c63015ff1385344e0624867775486d05e6eb1290a24976964a598003b919050565b816006036200037d57507fc4dec5845d407ce2ac2e6824bb7857c4b138f819e5789d5d11e812db10c846cd919050565b81600703620003ad57507f5fbe3f20c23f3bd6ac347917fb0903433e0b9a48373412348240a5f919bfde19919050565b81600803620003dd57507f92d1b07e56b3da96b7917778cb657f2c513eaeeb4d1579a73b5ea316f25b7289919050565b816009036200040d57507fa08add5656d6d3d0827ef909f7647981eac42aa1f51970a752f130f718f6d76a919050565b81600a036200043d57507f1704c5f297590d8ec62776b0714f4f3f2234bae0524035342b0da8b8988ebd79919050565b81600b036200046d57507fc5ae2bd47379c2c6d1189cfc3d057948dc6054caf845fcacd8f7affe94b11944919050565b81600c036200049d57507f12a161d6d5561062f387d91ad9f0f8966c0956afdb9e8325458b9e5057b82bdb919050565b81600d03620004cd57507f4ade524ba596de20bbe94507a761c45251ae7a27857ceb4287d9018525b99bc5919050565b81600e03620004fd57507f38287ad69151fa833bf4bf8b8eb6ffb39400a38f1a7e53b473f639c8c60fd5e4919050565b81600f036200052d57507f57f2ade7d711707e785451f2aba6c95872c7fe03153a98b7327b4024e8068fa3919050565b816010036200055d57507fb1982e0d1b0de46a88d8b17941472e41a86d3ff64571ed8e0ca72d58633547fc919050565b816011036200058d57507fb7c60f8670af15eb32b4ee36727179bc085a3dde03d5f9a1486664ba576b30a6919050565b81601203620005bd57507f5ff905c5c659a926b132ef3665a3de5d5a859c1d479e68851085bfc0348c5331919050565b81601303620005ed57507fb4dfa78b912e98c9f7eb42d71eb537a02bf3173d44a2eb887a48b3972072dd8e919050565b816014036200061d57507f60919a16a2eb8b91cfb8ba1e5b4c155a76a14c217b5403edbd563f34e508ecdc919050565b60405162461bcd60e51b815260206004820152601360248201527f496e646578206f7574206f6620626f756e6473000000000000000000000000006044820152606401620000a5565b5f805f6060848603121562000679575f80fd5b83516001600160a01b038116811462000690575f80fd5b60208501516040860151919450925063ffffffff81168114620006b1575f80fd5b809150509250925092565b61170a80620006ca5f395ff3fe60806040526004361061013f575f3560e01c80639fa12d0b116100b3578063e5285dcc1161006d578063e5285dcc146103d2578063e829558814610400578063e993d00b1461041f578063f178e47c1461043e578063f18d20be14610469578063fc7e9c6f14610471575f80fd5b80639fa12d0b1461030d578063b214faa514610339578063ba70f7571461034c578063c2b40ae414610374578063cd87a3b41461039f578063d0f94b55146103b3575f80fd5b80634ecf518b116101045780634ecf518b1461023e57806350241a3f1461026e578063839df945146102835780638bca6d16146102b157806390eeb02b146102c65780639ec44154146102e2575f80fd5b80632997e86b1461014a5780632b7ac3f31461018d5780633591d78d146101c457806338bf282e146101f257806341a0c2c61461021f575f80fd5b3661014657005b5f80fd5b348015610155575f80fd5b5061017861016436600461129a565b60086020525f908152604090205460ff1681565b60405190151581526020015b60405180910390f35b348015610198575f80fd5b506007546101ac906001600160a01b031681565b6040516001600160a01b039091168152602001610184565b3480156101cf575f80fd5b506101786101de36600461129a565b600a6020525f908152604090205460ff1681565b3480156101fd575f80fd5b5061021161020c3660046112b1565b610495565b604051908152602001610184565b34801561022a575f80fd5b50600b546101ac906001600160a01b031681565b348015610249575f80fd5b505f546102599063ffffffff1681565b60405163ffffffff9091168152602001610184565b61028161027c3660046112d1565b6104c4565b005b34801561028e575f80fd5b5061017861029d36600461129a565b60096020525f908152604090205460ff1681565b3480156102bc575f80fd5b5061021160065481565b3480156102d1575f80fd5b506004546102599063ffffffff1681565b3480156102ed575f80fd5b506102116102fc36600461129a565b60016020525f908152604090205481565b348015610318575f80fd5b5061032c610327366004611375565b610718565b60405161018491906113e4565b61028161034736600461129a565b6107d2565b348015610357575f80fd5b5060045463ffffffff165f90815260036020526040902054610211565b34801561037f575f80fd5b5061021161038e36600461129a565b60036020525f908152604090205481565b3480156103aa575f80fd5b50610259601e81565b3480156103be575f80fd5b506101786103cd36600461129a565b6108c4565b3480156103dd575f80fd5b506101786103ec36600461129a565b5f9081526008602052604090205460ff1690565b34801561040b575f80fd5b5061021161041a36600461129a565b610904565b34801561042a575f80fd5b5061017861043936600461129a565b610d1d565b348015610449575f80fd5b5061021161045836600461129a565b60026020525f908152604090205481565b610281610d27565b34801561047c575f80fd5b5060045461025990640100000000900463ffffffff1681565b604080516020808201859052818301849052825180830384018152606090920190925280519101205b92915050565b6104cc610de8565b5f8481526008602052604090205460ff161561052f5760405162461bcd60e51b815260206004820152601f60248201527f546865206e6f746520686173206265656e20616c7265616479207370656e740060448201526064015b60405180910390fd5b610538856108c4565b6105845760405162461bcd60e51b815260206004820152601f60248201527f43616e6e6f742066696e6420796f7572206c32206d65726b6c6520726f6f74006044820152606401610526565b61058d86610d1d565b6105d95760405162461bcd60e51b815260206004820152601f60248201527f43616e6e6f742066696e6420796f7572206c31206d65726b6c6520726f6f74006044820152606401610526565b60408051602080820189905281830188905282518083038401815260609092019092528051910120465f61060f83888885610e12565b600754604051633a94343960e21b81529192506001600160a01b03169063ea50d0e49061064490889088908690600401611429565b602060405180830381865afa15801561065f573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061068391906114a1565b6106a05760405163439cc0cd60e01b815260040160405180910390fd5b5f878152600860205260409020805460ff191660011790556106c186610f30565b604080516001600160a01b0388168152602081018990527f0ce490531f6c8ae2f1ff174643bc8b7ed5e52987ab50dc1e8f33655d2cd8c90b910160405180910390a15050506107106001600555565b505050505050565b60608167ffffffffffffffff811115610733576107336114c7565b60405190808252806020026020018201604052801561075c578160200160208202803683370190505b5090505f5b828110156107cb5761079984848381811061077e5761077e6114db565b905060200201355f9081526008602052604090205460ff1690565b156107c35760018282815181106107b2576107b26114db565b911515602092830291909101909101525b600101610761565b5092915050565b6107da610de8565b5f8181526009602052604090205460ff161561084a5760405162461bcd60e51b815260206004820152602960248201527f54686520636f6d6d69746d656e742068617320616c7265616479206265656e206044820152681cdd589b5a5d1d195960ba1b6064820152608401610526565b5f61085482610fd4565b5f838152600960205260409020805460ff1916600117905590506108766111aa565b6040805163ffffffff8316815242602082015283917fa945e51eec50ab98c161376f0db4cf2aeba3ec92755fe2fcd388bdbbb80ff196910160405180910390a2506108c16001600555565b50565b60405162461bcd60e51b81526020600482015260136024820152721b9bdd081a5b5c1b195b595b9d1959081e595d606a1b60448201525f90606401610526565b5f815f0361093357507f2fe54c60d3acabf3343a35b6eba15db4821b340f76e741e2249685ed4899af6c919050565b8160010361096257507f4fc2fe9184a25f44ce8ddb5f32671fcae6d9c85ed710c199acef16ad16b29911919050565b8160020361099157507f0d826a474f851c563052d929ef0daa70f658aba9ba084f51f6e3483c13c0e59a919050565b816003036109c057507ff7761a16b5e4c0120e4c5704b910dbe18ff6162a9668ed1c2c4efde7c4f15806919050565b816004036109ef57507fce9ce09a0ab259d6d14ca3dcd74e6c6b9e7d9074bff66973d4c57ccdffdb2a82919050565b81600503610a1e57507f02efd44c63015ff1385344e0624867775486d05e6eb1290a24976964a598003b919050565b81600603610a4d57507fc4dec5845d407ce2ac2e6824bb7857c4b138f819e5789d5d11e812db10c846cd919050565b81600703610a7c57507f5fbe3f20c23f3bd6ac347917fb0903433e0b9a48373412348240a5f919bfde19919050565b81600803610aab57507f92d1b07e56b3da96b7917778cb657f2c513eaeeb4d1579a73b5ea316f25b7289919050565b81600903610ada57507fa08add5656d6d3d0827ef909f7647981eac42aa1f51970a752f130f718f6d76a919050565b81600a03610b0957507f1704c5f297590d8ec62776b0714f4f3f2234bae0524035342b0da8b8988ebd79919050565b81600b03610b3857507fc5ae2bd47379c2c6d1189cfc3d057948dc6054caf845fcacd8f7affe94b11944919050565b81600c03610b6757507f12a161d6d5561062f387d91ad9f0f8966c0956afdb9e8325458b9e5057b82bdb919050565b81600d03610b9657507f4ade524ba596de20bbe94507a761c45251ae7a27857ceb4287d9018525b99bc5919050565b81600e03610bc557507f38287ad69151fa833bf4bf8b8eb6ffb39400a38f1a7e53b473f639c8c60fd5e4919050565b81600f03610bf457507f57f2ade7d711707e785451f2aba6c95872c7fe03153a98b7327b4024e8068fa3919050565b81601003610c2357507fb1982e0d1b0de46a88d8b17941472e41a86d3ff64571ed8e0ca72d58633547fc919050565b81601103610c5257507fb7c60f8670af15eb32b4ee36727179bc085a3dde03d5f9a1486664ba576b30a6919050565b81601203610c8157507f5ff905c5c659a926b132ef3665a3de5d5a859c1d479e68851085bfc0348c5331919050565b81601303610cb057507fb4dfa78b912e98c9f7eb42d71eb537a02bf3173d44a2eb887a48b3972072dd8e919050565b81601403610cdf57507f60919a16a2eb8b91cfb8ba1e5b4c155a76a14c217b5403edbd563f34e508ecdc919050565b60405162461bcd60e51b8152602060048201526013602482015272496e646578206f7574206f6620626f756e647360681b6044820152606401610526565b5f6104be82611221565b610d2f610de8565b60405173be34cc4cebf526887ec2c0035463dd26b3e7fea4905f90829047908381818185875af1925050503d805f8114610d84576040519150601f19603f3d011682016040523d82523d5f602084013e610d89565b606091505b5050905080610dda5760405162461bcd60e51b815260206004820181905260248201527f7061796d656e7420746f2061646d696e20646964206e6f7420676f20746872756044820152606401610526565b5050610de66001600555565b565b600260055403610e0b57604051633ee5aeb560e01b815260040160405180910390fd5b6002600555565b60408051604280825261086082019092526060915f919060208201610840803683370190505090505f5b6020811015610e8257868160208110610e5757610e576114db565b835191901a90839083908110610e6f57610e6f6114db565b6020908102919091010152600101610e3c565b5060205b6040811015610ed65785610e9b602083611503565b60208110610eab57610eab6114db565b835191901a90839083908110610ec357610ec36114db565b6020908102919091010152600101610e86565b5080516001600160a01b03851690819083906040908110610ef957610ef96114db565b602002602001018181525050835f1b82604181518110610f1b57610f1b6114db565b60209081029190910101525095945050505050565b3415610f9c5760405162461bcd60e51b815260206004820152603560248201527f4d6573736167652076616c756520697320737570706f73656420746f206265206044820152747a65726f20666f722045544820696e7374616e636560581b6064820152608401610526565b6006546040516001600160a01b0383169180156108fc02915f818181858888f19350505050158015610fd0573d5f803e3d5ffd5b5050565b6004545f8054909163ffffffff640100000000909104811691610ff991166002611625565b63ffffffff168163ffffffff160361106c5760405162461bcd60e51b815260206004820152603060248201527f4d65726b6c6520747265652069732066756c6c2e204e6f206d6f7265206c656160448201526f1d995cc818d85b88189948185919195960821b6064820152608401610526565b80835f80805b5f5463ffffffff908116908216101561110857611090600286611655565b63ffffffff165f036110cc578392506110ae8163ffffffff16610904565b63ffffffff82165f90815260026020526040902085905591506110e7565b63ffffffff81165f9081526002602052604090205492508391505b6110f18383610495565b93506110fe600286611677565b9450600101611072565b506004545f90601e906111229063ffffffff166001611699565b61112c9190611655565b6004805463ffffffff191663ffffffff8381169182179092555f908152600360209081526040808320899055928a1682526001908190529190208a9055909150611177908790611699565b6004805463ffffffff929092166401000000000267ffffffff000000001990921691909117905550939695505050505050565b6006543414610de65760405162461bcd60e51b815260206004820152603860248201527f506c656173652073656e6420606d697844656e6f6d696e6174696f6e6020455460448201527f4820616c6f6e672077697468207472616e73616374696f6e00000000000000006064820152608401610526565b5f81810361123057505f919050565b60045463ffffffff16805b63ffffffff81165f908152600360205260409020548403611260575060019392505050565b8063ffffffff165f036112715750601e5b8061127b816116b6565b9150508163ffffffff168163ffffffff160361123b57505f9392505050565b5f602082840312156112aa575f80fd5b5035919050565b5f80604083850312156112c2575f80fd5b50508035926020909101359150565b5f805f805f8060a087890312156112e6575f80fd5b86359550602087013594506040870135935060608701356001600160a01b0381168114611311575f80fd5b9250608087013567ffffffffffffffff8082111561132d575f80fd5b818901915089601f830112611340575f80fd5b81358181111561134e575f80fd5b8a602082850101111561135f575f80fd5b6020830194508093505050509295509295509295565b5f8060208385031215611386575f80fd5b823567ffffffffffffffff8082111561139d575f80fd5b818501915085601f8301126113b0575f80fd5b8135818111156113be575f80fd5b8660208260051b85010111156113d2575f80fd5b60209290920196919550909350505050565b602080825282518282018190525f9190848201906040850190845b8181101561141d5783511515835292840192918401916001016113ff565b50909695505050505050565b60408152826040820152828460608301375f606084830101525f601f19601f850116820160608101602060608584030160208601528186518084526080850191506020880194505f93505b808410156114945784518252938201936001939093019290820190611474565b5098975050505050505050565b5f602082840312156114b1575f80fd5b815180151581146114c0575f80fd5b9392505050565b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b818103818111156104be576104be6114ef565b600181815b80851115611553578163ffffffff04821115611539576115396114ef565b8085161561154657918102915b93841c939080029061151b565b509250929050565b5f82611569575060016104be565b8161157557505f6104be565b816001811461158b5760028114611595576115c6565b60019150506104be565b60ff8411156115a6576115a66114ef565b6001841b915063ffffffff8211156115c0576115c06114ef565b506104be565b5060208310610133831016604e8410600b84101617156115fd575081810a63ffffffff8111156115f8576115f86114ef565b6104be565b6116078383611516565b8063ffffffff0482111561161d5761161d6114ef565b029392505050565b5f63ffffffff61163981851682851661155b565b949350505050565b634e487b7160e01b5f52601260045260245ffd5b5f63ffffffff8084168061166b5761166b611641565b92169190910692915050565b5f63ffffffff8084168061168d5761168d611641565b92169190910492915050565b63ffffffff8181168382160190808211156107cb576107cb6114ef565b5f63ffffffff8216806116cb576116cb6114ef565b5f19019291505056fea2646970667358221220fe5d66683641dc68aafdcf88c3b9598f0ebc05f2191422fcc252991952f6bf6f64736f6c63430008170033";

type ToadnadoL1ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ToadnadoL1ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ToadnadoL1__factory extends ContractFactory {
  constructor(...args: ToadnadoL1ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _verifier: AddressLike,
    _denomination: BigNumberish,
    _merkleTreeHeight: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _verifier,
      _denomination,
      _merkleTreeHeight,
      overrides || {}
    );
  }
  override deploy(
    _verifier: AddressLike,
    _denomination: BigNumberish,
    _merkleTreeHeight: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _verifier,
      _denomination,
      _merkleTreeHeight,
      overrides || {}
    ) as Promise<
      ToadnadoL1 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ToadnadoL1__factory {
    return super.connect(runner) as ToadnadoL1__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ToadnadoL1Interface {
    return new Interface(_abi) as ToadnadoL1Interface;
  }
  static connect(address: string, runner?: ContractRunner | null): ToadnadoL1 {
    return new Contract(address, _abi, runner) as unknown as ToadnadoL1;
  }
}
