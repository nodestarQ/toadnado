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
import type { NonPayableOverrides } from "../../../common";
import type {
  ToadnadoL2,
  ToadnadoL2Interface,
} from "../../../contracts/ToadnadoL2.sol/ToadnadoL2";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_l1Address",
        type: "address",
      },
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
    name: "L1_SLOAD_ADDRESS",
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
        internalType: "bytes32",
        name: "_root",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_nullifier",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "_formatPublicInputs",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "pure",
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
    name: "getAllCommitments",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "key",
        type: "uint256",
      },
    ],
    name: "getL1LeafCommitments",
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
        name: "key",
        type: "uint256",
      },
    ],
    name: "getL1Root",
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
    name: "l1Address",
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
    name: "l1_currentRootIndex",
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
        internalType: "address",
        name: "l1_contract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "slot",
        type: "uint256",
      },
    ],
    name: "readSingleSlot",
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
  "0x6080604052600480546001600160401b0319169055600c805463ffffffff19169055600d80546001600160a01b03191661010117905534801562000041575f80fd5b506040516200246a3803806200246a8339810160408190526200006491620006c1565b828282805f8163ffffffff1611620000cf5760405162461bcd60e51b815260206004820152602360248201527f5f6c6576656c732073686f756c642062652067726561746572207468616e207a60448201526265726f60e81b60648201526084015b60405180910390fd5b60148163ffffffff1610620001275760405162461bcd60e51b815260206004820152601e60248201527f5f6c6576656c732073686f756c64206265206c657373207468616e20323000006044820152606401620000c6565b5f805463ffffffff191663ffffffff83161781555b8163ffffffff168163ffffffff16101562000180576200016263ffffffff82166200026c565b63ffffffff82165f908152600260205260409020556001016200013c565b506200019263ffffffff82166200026c565b5f805260036020527f3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92eff55506001600555816200021f5760405162461bcd60e51b815260206004820152602560248201527f64656e6f6d696e6174696f6e2073686f756c6420626520677265617465722074604482015264068616e20360dc1b6064820152608401620000c6565b50600780546001600160a01b0319166001600160a01b03938416179055600655600c8054600160201b600160c01b031916640100000000969092169590950217909355506200071b915050565b5f815f036200029c57507f2fe54c60d3acabf3343a35b6eba15db4821b340f76e741e2249685ed4899af6c919050565b81600103620002cc57507f4fc2fe9184a25f44ce8ddb5f32671fcae6d9c85ed710c199acef16ad16b29911919050565b81600203620002fc57507f0d826a474f851c563052d929ef0daa70f658aba9ba084f51f6e3483c13c0e59a919050565b816003036200032c57507ff7761a16b5e4c0120e4c5704b910dbe18ff6162a9668ed1c2c4efde7c4f15806919050565b816004036200035c57507fce9ce09a0ab259d6d14ca3dcd74e6c6b9e7d9074bff66973d4c57ccdffdb2a82919050565b816005036200038c57507f02efd44c63015ff1385344e0624867775486d05e6eb1290a24976964a598003b919050565b81600603620003bc57507fc4dec5845d407ce2ac2e6824bb7857c4b138f819e5789d5d11e812db10c846cd919050565b81600703620003ec57507f5fbe3f20c23f3bd6ac347917fb0903433e0b9a48373412348240a5f919bfde19919050565b816008036200041c57507f92d1b07e56b3da96b7917778cb657f2c513eaeeb4d1579a73b5ea316f25b7289919050565b816009036200044c57507fa08add5656d6d3d0827ef909f7647981eac42aa1f51970a752f130f718f6d76a919050565b81600a036200047c57507f1704c5f297590d8ec62776b0714f4f3f2234bae0524035342b0da8b8988ebd79919050565b81600b03620004ac57507fc5ae2bd47379c2c6d1189cfc3d057948dc6054caf845fcacd8f7affe94b11944919050565b81600c03620004dc57507f12a161d6d5561062f387d91ad9f0f8966c0956afdb9e8325458b9e5057b82bdb919050565b81600d036200050c57507f4ade524ba596de20bbe94507a761c45251ae7a27857ceb4287d9018525b99bc5919050565b81600e036200053c57507f38287ad69151fa833bf4bf8b8eb6ffb39400a38f1a7e53b473f639c8c60fd5e4919050565b81600f036200056c57507f57f2ade7d711707e785451f2aba6c95872c7fe03153a98b7327b4024e8068fa3919050565b816010036200059c57507fb1982e0d1b0de46a88d8b17941472e41a86d3ff64571ed8e0ca72d58633547fc919050565b81601103620005cc57507fb7c60f8670af15eb32b4ee36727179bc085a3dde03d5f9a1486664ba576b30a6919050565b81601203620005fc57507f5ff905c5c659a926b132ef3665a3de5d5a859c1d479e68851085bfc0348c5331919050565b816013036200062c57507fb4dfa78b912e98c9f7eb42d71eb537a02bf3173d44a2eb887a48b3972072dd8e919050565b816014036200065c57507f60919a16a2eb8b91cfb8ba1e5b4c155a76a14c217b5403edbd563f34e508ecdc919050565b60405162461bcd60e51b815260206004820152601360248201527f496e646578206f7574206f6620626f756e6473000000000000000000000000006044820152606401620000c6565b919050565b80516001600160a01b0381168114620006a5575f80fd5b5f805f8060808587031215620006d5575f80fd5b620006e085620006aa565b9350620006f060208601620006aa565b925060408501519150606085015163ffffffff8116811462000710575f80fd5b939692955090935050565b611d4180620007295f395ff3fe6080604052600436106101c8575f3560e01c806390eeb02b116100f2578063c2eeeebd11610092578063e993d00b11610062578063e993d00b146105cd578063f178e47c146105ec578063f18d20be14610617578063fc7e9c6f1461061f575f80fd5b8063c2eeeebd14610546578063cd87a3b41461056c578063e5285dcc14610580578063e8295588146105ae575f80fd5b8063a867a5ef116100cd578063a867a5ef146104c1578063b214faa5146104e0578063ba70f757146104f3578063c2b40ae41461051b575f80fd5b806390eeb02b1461044e5780639ec441541461046a5780639fa12d0b14610495575f80fd5b80633ed4eae5116101685780635032d4f1116101385780635032d4f1146103cd5780636d9833e3146103ec578063839df9451461040b5780638bca6d1614610439575f80fd5b80633ed4eae5146103525780634ecf518b146103715780634fe3fbf01461038c57806350241a3f146103b8575f80fd5b80632b7ac3f3116101a35780632b7ac3f3146102775780632c0ee3c4146102ae5780633591d78d146102d057806338bf282e146102fe575f80fd5b8063102b72e7146101d3578063164ddd01146102085780632997e86b14610239575f80fd5b366101cf57005b5f80fd5b3480156101de575f80fd5b506101f26101ed366004611793565b610642565b6040516101ff91906117df565b60405180910390f35b348015610213575f80fd5b50600c546102249063ffffffff1681565b60405163ffffffff90911681526020016101ff565b348015610244575f80fd5b50610267610253366004611811565b60086020525f908152604090205460ff1681565b60405190151581526020016101ff565b348015610282575f80fd5b50600754610296906001600160a01b031681565b6040516001600160a01b0390911681526020016101ff565b3480156102b9575f80fd5b506102c261072d565b6040516101ff929190611862565b3480156102db575f80fd5b506102676102ea366004611811565b600a6020525f908152604090205460ff1681565b348015610309575f80fd5b5061034461031836600461188f565b604080516020808201949094528082019290925280518083038201815260609092019052805191012090565b6040519081526020016101ff565b34801561035d575f80fd5b5061034461036c366004611811565b610876565b34801561037c575f80fd5b505f546102249063ffffffff1681565b348015610397575f80fd5b506103ab6103a63660046118af565b6108df565b6040516101ff91906118e5565b6103cb6103c63660046118f7565b6109da565b005b3480156103d8575f80fd5b506103446103e7366004611811565b610c78565b3480156103f7575f80fd5b50610267610406366004611811565b610cae565b348015610416575f80fd5b50610267610425366004611811565b60096020525f908152604090205460ff1681565b348015610444575f80fd5b5061034460065481565b348015610459575f80fd5b506004546102249063ffffffff1681565b348015610475575f80fd5b50610344610484366004611811565b60016020525f908152604090205481565b3480156104a0575f80fd5b506104b46104af366004611990565b610d27565b6040516101ff91906119ff565b3480156104cc575f80fd5b50600d54610296906001600160a01b031681565b6103cb6104ee366004611811565b610de1565b3480156104fe575f80fd5b5060045463ffffffff165f90815260036020526040902054610344565b348015610526575f80fd5b50610344610535366004611811565b60036020525f908152604090205481565b348015610551575f80fd5b50600c5461029690600160201b90046001600160a01b031681565b348015610577575f80fd5b50610224601e81565b34801561058b575f80fd5b5061026761059a366004611811565b5f9081526008602052604090205460ff1690565b3480156105b9575f80fd5b506103446105c8366004611811565b610ecb565b3480156105d8575f80fd5b506102676105e7366004611811565b6112e4565b3480156105f7575f80fd5b50610344610606366004611811565b60026020525f908152604090205481565b6103cb611387565b34801561062a575f80fd5b5060045461022490600160201b900463ffffffff1681565b604051606083811b6bffffffffffffffffffffffff1916602083015260348201839052905f9060540160408051601f1981840301815290829052600d549092505f916060916001600160a01b03169061069c908590611a44565b5f60405180830381855afa9150503d805f81146106d4576040519150601f19603f3d011682016040523d82523d5f602084013e6106d9565b606091505b509092509050816107225760405162461bcd60e51b815260206004820152600e60248201526d130c54d313d0510819985a5b195960921b60448201526064015b60405180910390fd5b925050505b92915050565b604080516020808252610420820190925260609182915f908280820161040080368337019050506004549091505f90600160201b900463ffffffff1667ffffffffffffffff81111561078157610781611a5f565b6040519080825280602002602001820160405280156107aa578160200160208202803683370190505b5090505f5b60045463ffffffff600160201b909104811690821610156108065763ffffffff81165f8181526001602052604090205483519091849181106107f3576107f3611a73565b60209081029190910101526001016107af565b505f5b8363ffffffff168163ffffffff16101561086b5761082c8163ffffffff16610876565b1561086b576108408163ffffffff16610876565b838263ffffffff168151811061085857610858611a73565b6020908102919091010152600101610809565b509094909350915050565b600c54604080516020810184905260019181018290525f926108c591600160201b9091046001600160a01b0316906060015b604051602081830303815290604052805190602001205f1c610642565b8060200190518101906108d89190611a87565b9392505050565b60408051604180825261084082019092526060915f919060208201610820803683370190505090505f5b602081101561094f5785816020811061092457610924611a73565b835191901a9083908390811061093c5761093c611a73565b6020908102919091010152600101610909565b5060205b60408110156109a35784610968602083611ab2565b6020811061097857610978611a73565b835191901a9083908390811061099057610990611a73565b6020908102919091010152600101610953565b5080516001600160a01b038416908190839060409081106109c6576109c6611a73565b602090810291909101015250949350505050565b6109e2611448565b4662aa36a703610a345760405162461bcd60e51b815260206004820152601d60248201527f7769746864726177616c206f6e6c7920616c6c6f776564206f6e204c320000006044820152606401610719565b5f8481526008602052604090205460ff1615610a925760405162461bcd60e51b815260206004820152601f60248201527f546865206e6f746520686173206265656e20616c7265616479207370656e74006044820152606401610719565b610a9b85610cae565b610ae75760405162461bcd60e51b815260206004820152601f60248201527f43616e6e6f742066696e6420796f7572206c32206d65726b6c6520726f6f74006044820152606401610719565b610af0866112e4565b610b3c5760405162461bcd60e51b815260206004820152601f60248201527f43616e6e6f742066696e6420796f7572206c31206d65726b6c6520726f6f74006044820152606401610719565b604080516020808201899052818301889052825180830384018152606090920190925280519101205f610b708287876108df565b600754604051633a94343960e21b81529192506001600160a01b03169063ea50d0e490610ba590879087908690600401611ac5565b602060405180830381865afa158015610bc0573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610be49190611b0b565b610c015760405163439cc0cd60e01b815260040160405180910390fd5b5f868152600860205260409020805460ff19166001179055610c2285611472565b604080516001600160a01b0387168152602081018890527f0ce490531f6c8ae2f1ff174643bc8b7ed5e52987ab50dc1e8f33655d2cd8c90b910160405180910390a15050610c706001600555565b505050505050565b600c54604080516020810184905260039181018290525f926108c591600160201b9091046001600160a01b0316906060016108a8565b5f818103610cbd57505f919050565b60045463ffffffff16805b63ffffffff81165f908152600360205260409020548403610ced575060019392505050565b8063ffffffff165f03610cfe5750601e5b80610d0881611b2a565b9150508163ffffffff168163ffffffff1603610cc857505f9392505050565b60608167ffffffffffffffff811115610d4257610d42611a5f565b604051908082528060200260200182016040528015610d6b578160200160208202803683370190505b5090505f5b82811015610dda57610da8848483818110610d8d57610d8d611a73565b905060200201355f9081526008602052604090205460ff1690565b15610dd2576001828281518110610dc157610dc1611a73565b911515602092830291909101909101525b600101610d70565b5092915050565b610de9611448565b5f8181526009602052604090205460ff1615610e515760405162461bcd60e51b815260206004820152602160248201527f54686520636f6d6d69746d656e7420686173206265656e207375626d697474656044820152601960fa1b6064820152608401610719565b5f610e5b82611516565b5f838152600960205260409020805460ff191660011790559050610e7d611708565b6040805163ffffffff8316815242602082015283917fa945e51eec50ab98c161376f0db4cf2aeba3ec92755fe2fcd388bdbbb80ff196910160405180910390a250610ec86001600555565b50565b5f815f03610efa57507f2fe54c60d3acabf3343a35b6eba15db4821b340f76e741e2249685ed4899af6c919050565b81600103610f2957507f4fc2fe9184a25f44ce8ddb5f32671fcae6d9c85ed710c199acef16ad16b29911919050565b81600203610f5857507f0d826a474f851c563052d929ef0daa70f658aba9ba084f51f6e3483c13c0e59a919050565b81600303610f8757507ff7761a16b5e4c0120e4c5704b910dbe18ff6162a9668ed1c2c4efde7c4f15806919050565b81600403610fb657507fce9ce09a0ab259d6d14ca3dcd74e6c6b9e7d9074bff66973d4c57ccdffdb2a82919050565b81600503610fe557507f02efd44c63015ff1385344e0624867775486d05e6eb1290a24976964a598003b919050565b8160060361101457507fc4dec5845d407ce2ac2e6824bb7857c4b138f819e5789d5d11e812db10c846cd919050565b8160070361104357507f5fbe3f20c23f3bd6ac347917fb0903433e0b9a48373412348240a5f919bfde19919050565b8160080361107257507f92d1b07e56b3da96b7917778cb657f2c513eaeeb4d1579a73b5ea316f25b7289919050565b816009036110a157507fa08add5656d6d3d0827ef909f7647981eac42aa1f51970a752f130f718f6d76a919050565b81600a036110d057507f1704c5f297590d8ec62776b0714f4f3f2234bae0524035342b0da8b8988ebd79919050565b81600b036110ff57507fc5ae2bd47379c2c6d1189cfc3d057948dc6054caf845fcacd8f7affe94b11944919050565b81600c0361112e57507f12a161d6d5561062f387d91ad9f0f8966c0956afdb9e8325458b9e5057b82bdb919050565b81600d0361115d57507f4ade524ba596de20bbe94507a761c45251ae7a27857ceb4287d9018525b99bc5919050565b81600e0361118c57507f38287ad69151fa833bf4bf8b8eb6ffb39400a38f1a7e53b473f639c8c60fd5e4919050565b81600f036111bb57507f57f2ade7d711707e785451f2aba6c95872c7fe03153a98b7327b4024e8068fa3919050565b816010036111ea57507fb1982e0d1b0de46a88d8b17941472e41a86d3ff64571ed8e0ca72d58633547fc919050565b8160110361121957507fb7c60f8670af15eb32b4ee36727179bc085a3dde03d5f9a1486664ba576b30a6919050565b8160120361124857507f5ff905c5c659a926b132ef3665a3de5d5a859c1d479e68851085bfc0348c5331919050565b8160130361127757507fb4dfa78b912e98c9f7eb42d71eb537a02bf3173d44a2eb887a48b3972072dd8e919050565b816014036112a657507f60919a16a2eb8b91cfb8ba1e5b4c155a76a14c217b5403edbd563f34e508ecdc919050565b60405162461bcd60e51b8152602060048201526013602482015272496e646578206f7574206f6620626f756e647360681b6044820152606401610719565b5f60038282036112f657505f92915050565b600c545f9061131590600160201b90046001600160a01b031683610642565b8060200190518101906113289190611b48565b9050805b61133b8163ffffffff16610c78565b850361134c57506001949350505050565b8063ffffffff165f0361135d5750601e5b8061136781611b2a565b9150508163ffffffff168163ffffffff160361132c57505f949350505050565b61138f611448565b60405173be34cc4cebf526887ec2c0035463dd26b3e7fea4905f90829047908381818185875af1925050503d805f81146113e4576040519150601f19603f3d011682016040523d82523d5f602084013e6113e9565b606091505b505090508061143a5760405162461bcd60e51b815260206004820181905260248201527f7061796d656e7420746f2061646d696e20646964206e6f7420676f20746872756044820152606401610719565b50506114466001600555565b565b60026005540361146b57604051633ee5aeb560e01b815260040160405180910390fd5b6002600555565b34156114de5760405162461bcd60e51b815260206004820152603560248201527f4d6573736167652076616c756520697320737570706f73656420746f206265206044820152747a65726f20666f722045544820696e7374616e636560581b6064820152608401610719565b6006546040516001600160a01b0383169180156108fc02915f818181858888f19350505050158015611512573d5f803e3d5ffd5b5050565b6004545f8054909163ffffffff600160201b90910481169161153a91166002611c7a565b63ffffffff168163ffffffff16036115ad5760405162461bcd60e51b815260206004820152603060248201527f4d65726b6c6520747265652069732066756c6c2e204e6f206d6f7265206c656160448201526f1d995cc818d85b88189948185919195960821b6064820152608401610719565b80835f80805b5f5463ffffffff9081169082161015611667576115d1600286611caa565b63ffffffff165f0361160d578392506115ef8163ffffffff16610ecb565b63ffffffff82165f9081526002602052604090208590559150611628565b63ffffffff81165f9081526002602052604090205492508391505b60408051602080820186905281830185905282518083038401815260609092019092528051910120935061165d600286611ccc565b94506001016115b3565b506004545f90601e906116819063ffffffff166001611cee565b61168b9190611caa565b6004805463ffffffff191663ffffffff8381169182179092555f908152600360209081526040808320899055928a1682526001908190529190208a90559091506116d6908790611cee565b6004805463ffffffff92909216600160201b0267ffffffff000000001990921691909117905550939695505050505050565b60065434146114465760405162461bcd60e51b815260206004820152603860248201527f506c656173652073656e6420606d697844656e6f6d696e6174696f6e6020455460448201527f4820616c6f6e672077697468207472616e73616374696f6e00000000000000006064820152608401610719565b6001600160a01b0381168114610ec8575f80fd5b5f80604083850312156117a4575f80fd5b82356117af8161177f565b946020939093013593505050565b5f5b838110156117d75781810151838201526020016117bf565b50505f910152565b602081525f82518060208401526117fd8160408501602087016117bd565b601f01601f19169190910160400192915050565b5f60208284031215611821575f80fd5b5035919050565b5f815180845260208085019450602084015f5b838110156118575781518752958201959082019060010161183b565b509495945050505050565b604081525f6118746040830185611828565b82810360208401526118868185611828565b95945050505050565b5f80604083850312156118a0575f80fd5b50508035926020909101359150565b5f805f606084860312156118c1575f80fd5b833592506020840135915060408401356118da8161177f565b809150509250925092565b602081525f6108d86020830184611828565b5f805f805f8060a0878903121561190c575f80fd5b863595506020870135945060408701359350606087013561192c8161177f565b9250608087013567ffffffffffffffff80821115611948575f80fd5b818901915089601f83011261195b575f80fd5b813581811115611969575f80fd5b8a602082850101111561197a575f80fd5b6020830194508093505050509295509295509295565b5f80602083850312156119a1575f80fd5b823567ffffffffffffffff808211156119b8575f80fd5b818501915085601f8301126119cb575f80fd5b8135818111156119d9575f80fd5b8660208260051b85010111156119ed575f80fd5b60209290920196919550909350505050565b602080825282518282018190525f9190848201906040850190845b81811015611a38578351151583529284019291840191600101611a1a565b50909695505050505050565b5f8251611a558184602087016117bd565b9190910192915050565b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52603260045260245ffd5b5f60208284031215611a97575f80fd5b5051919050565b634e487b7160e01b5f52601160045260245ffd5b8181038181111561072757610727611a9e565b60408152826040820152828460608301375f606084830101525f601f19601f85011682016060838203016020840152611b016060820185611828565b9695505050505050565b5f60208284031215611b1b575f80fd5b815180151581146108d8575f80fd5b5f63ffffffff821680611b3f57611b3f611a9e565b5f190192915050565b5f60208284031215611b58575f80fd5b815163ffffffff811681146108d8575f80fd5b600181815b80851115611ba8578163ffffffff04821115611b8e57611b8e611a9e565b80851615611b9b57918102915b93841c9390800290611b70565b509250929050565b5f82611bbe57506001610727565b81611bca57505f610727565b8160018114611be05760028114611bea57611c1b565b6001915050610727565b60ff841115611bfb57611bfb611a9e565b6001841b915063ffffffff821115611c1557611c15611a9e565b50610727565b5060208310610133831016604e8410600b8410161715611c52575081810a63ffffffff811115611c4d57611c4d611a9e565b610727565b611c5c8383611b6b565b8063ffffffff04821115611c7257611c72611a9e565b029392505050565b5f63ffffffff611c8e818516828516611bb0565b949350505050565b634e487b7160e01b5f52601260045260245ffd5b5f63ffffffff80841680611cc057611cc0611c96565b92169190910692915050565b5f63ffffffff80841680611ce257611ce2611c96565b92169190910492915050565b63ffffffff818116838216019080821115610dda57610dda611a9e56fea2646970667358221220d0425862402643744300313571c85f0557ffe3b285021c218a9ff70f6c10709064736f6c63430008170033";

type ToadnadoL2ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ToadnadoL2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ToadnadoL2__factory extends ContractFactory {
  constructor(...args: ToadnadoL2ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _l1Address: AddressLike,
    _verifier: AddressLike,
    _denomination: BigNumberish,
    _merkleTreeHeight: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _l1Address,
      _verifier,
      _denomination,
      _merkleTreeHeight,
      overrides || {}
    );
  }
  override deploy(
    _l1Address: AddressLike,
    _verifier: AddressLike,
    _denomination: BigNumberish,
    _merkleTreeHeight: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _l1Address,
      _verifier,
      _denomination,
      _merkleTreeHeight,
      overrides || {}
    ) as Promise<
      ToadnadoL2 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ToadnadoL2__factory {
    return super.connect(runner) as ToadnadoL2__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ToadnadoL2Interface {
    return new Interface(_abi) as ToadnadoL2Interface;
  }
  static connect(address: string, runner?: ContractRunner | null): ToadnadoL2 {
    return new Contract(address, _abi, runner) as unknown as ToadnadoL2;
  }
}
