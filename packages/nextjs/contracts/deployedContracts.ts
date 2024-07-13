/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  2227728: {
    ToadnadoL2: {
      address: "0x3EF9b20C061588Ea749FD007A13e10a3321c4aF4",
      abi: [
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
              internalType: "address",
              name: "l1_contract",
              type: "address",
            },
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
      ],
      inheritedFunctions: {},
    },
  },
  11155111: {
    ToadnadoL1: {
      address: "0x3EF9b20C061588Ea749FD007A13e10a3321c4aF4",
      abi: [
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
          name: "FIELD_SIZE",
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
          name: "ZERO_VALUE",
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
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "commitmentsTree",
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
          inputs: [
            {
              internalType: "bytes32[]",
              name: "_commitmentsTree",
              type: "bytes32[]",
            },
            {
              internalType: "bytes32",
              name: "_root",
              type: "bytes32",
            },
          ],
          name: "setCommitmentsTree",
          outputs: [],
          stateMutability: "nonpayable",
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
              internalType: "address payable",
              name: "_recipient",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "_nullifier",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "chainId",
              type: "uint256",
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
      ],
      inheritedFunctions: {
        FIELD_SIZE: "contracts/Toadnado.sol",
        ROOT_HISTORY_SIZE: "contracts/Toadnado.sol",
        ZERO_VALUE: "contracts/Toadnado.sol",
        commitmentLeafs: "contracts/Toadnado.sol",
        commitments: "contracts/Toadnado.sol",
        commitmentsTree: "contracts/Toadnado.sol",
        commitmentsTreeRoots: "contracts/Toadnado.sol",
        currentRootIndex: "contracts/Toadnado.sol",
        denomination: "contracts/Toadnado.sol",
        deposit: "contracts/Toadnado.sol",
        filledSubtrees: "contracts/Toadnado.sol",
        getLastRoot: "contracts/Toadnado.sol",
        hashLeftRight: "contracts/Toadnado.sol",
        isKnownRoot: "contracts/Toadnado.sol",
        levels: "contracts/Toadnado.sol",
        nextIndex: "contracts/Toadnado.sol",
        nullifiers: "contracts/Toadnado.sol",
        roots: "contracts/Toadnado.sol",
        setCommitmentsTree: "contracts/Toadnado.sol",
        verifier: "contracts/Toadnado.sol",
        withdraw: "contracts/Toadnado.sol",
        zeros: "contracts/Toadnado.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
