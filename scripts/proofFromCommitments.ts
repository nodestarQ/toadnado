import util from "util"
import { poseidon1, poseidon2, poseidon3 } from 'poseidon-lite';

import { ethers } from "ethers";

//noir
import { BarretenbergBackend, BarretenbergVerifier as Verifier } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { CompiledCircuit } from '@noir-lang/types';
import type {InputMap} from '@noir-lang/noir_js';
type InputValue = Field | InputMap | (Field | InputMap)[]
type Field = string | number | boolean;;
import circuit from '../circuits/prover/target/prover.json'  //assert {type: 'json'};

import {MerkleTree} from 'fixed-merkle-tree'

import { ToadnadoL1,ToadnadoL2  } from "../typechain-types";

const FIELD_LIMIT = 21888242871839275222246405745257275088548364400416034343698204186575808495617n

const NOIR_BACKEND = new BarretenbergBackend(circuit as CompiledCircuit);
const NOIR = new Noir(circuit as CompiledCircuit, NOIR_BACKEND)

const TREE_DEPTH = 5
const EMPTY_COMMITMENT = 0n//21663839004416932945382355908790599225266501822907911457504978515578255421292n// ethers.zeroPadBytes(ethers.toBeHex(21663839004416932945382355908790599225266501822907911457504978515578255421292n),32)

interface tree {
    tree: ethers.BytesLike[][];
    treeDepth: number;
  }

export function randomWithinFieldLimit(limit:bigint=FIELD_LIMIT) : bigint {
    let isBigger = true
    let number = 0n
    while (isBigger) {
        number = ethers.toBigInt(crypto.getRandomValues(new Uint8Array( new Array(32))))
        isBigger = number > limit
    }
    return number
}

// export function generateTree(commitments:string[]=[]): tree {
//     const abiEncoder = new ethers.AbiCoder
//     const commitmentsLen = commitments.length
//     const treeDepth = Math.log(commitmentsLen) / Math.log(2)
//     const tree =[commitments, ...Array(treeDepth).fill([]).map((x)=>structuredClone(x))]
//     let offset = 0
//     let preImagesLen = commitmentsLen

//     for (let currentDepth = 0; currentDepth < treeDepth; currentDepth++) {
//         //console.log({tree, currentDepth})
//         const preImages = tree[currentDepth]//.slice(offset, offset+preImagesLen)
        
//         //add new layer hashes
//         for (let i=0; i < preImages.length; i+=2) {
//             const left = preImages[i]
//             const right = preImages[i+1]

//             const hash = ethers.keccak256(abiEncoder.encode(["bytes32","bytes32"], [left,right]))
//             tree[currentDepth+1].push(hash)
//         }   

//         // offset += preImagesLen
//         // preImagesLen = preImages.length/2
//     }

//     return {tree, treeDepth}
// }

export function indexToPathBools(leafIndex: BigInt, treeDepth: number) {
    const bools = leafIndex.toString(2).split('').map(x => x === '1')
    const hashPathBools = [...Array(treeDepth-bools.length).fill(false), ...bools].reverse()
    return hashPathBools
}

// export function getProofFromTree(tree: ethers.BytesLike[][], leafIndex:number, treeDepth:number) {
//     const leaf = tree[0][leafIndex]
//     const hashPath = []

//     //const bools = BigInt(leafIndex).toString(2).split('').map(x => x === '1')
//     const hashPathBools = indexToPathBools(BigInt(leafIndex), treeDepth)
//     let nodeIndex = leafIndex
//     for (let currentLevel = 0; currentLevel < treeDepth; currentLevel++) {
//         const syblingIsLeft = hashPathBools[currentLevel]
//         if (syblingIsLeft) {
//             hashPath.push(tree[currentLevel][nodeIndex-1])
//         } else {
//             hashPath.push(tree[currentLevel][nodeIndex+1])
//         }
        
//         nodeIndex = Math.floor(nodeIndex/2)
        
//     }

//     return {hashPath, hashPathBools, leaf}
// }


// export function getMerkleProof(allCommitments: string[], targerCommitmentIndex: number) {
//     const {tree, treeDepth} = generateTree(allCommitments)
//     const root = tree[tree.length-1][0]
//     console.log({root: tree[tree.length-1], treeDepth})
//     const {hashPath, hashPathBools, leaf} = getProofFromTree(tree, targerCommitmentIndex,treeDepth)
//     return {hashPath, hashPathBools, leaf, root}

// }


// export async function makeZeroBytes() {
//     //const comitments = [0,1,2,3,4,5,6,7].map((x)=>ethers.zeroPadValue(ethers.toBeHex(x),32))
//     const treeDepth = 20n
//     const ammountCommitments = 2n ** treeDepth

//     const zeroBytes = ethers.zeroPadBytes(ethers.toBeHex(21663839004416932945382355908790599225266501822907911457504978515578255421292n),32) //keccack("tornado")
//     const commitments = Array(Number(ammountCommitments)).fill(zeroBytes); //["0x0000000000000000000000000000000000000000000000000000000000000014", ...Array(ammountCommitments-1).fill(zeroBytes)]
//     console.log({ammountCommitments, commitmentslen: commitments.length})
//     const {tree} = generateTree(commitments);
//     // 0 = leaf 20 = root
//     const levels = tree.map((x, i)=>[i, x[0]])
//     console.log({levels})
    

//     const path = `${import.meta.dir}/output/levels.json`
//     console.log({path})
//     await Bun.write(path, JSON.stringify({comment:"0 = leaf 20 = root",levels},null,2));


//     // console.log({commitmentsLen: commitments.length})
//     // const  {hashPath, hashPathBools} =   getMerkleProof(commitments, 0)
//     // console.log({hashPath, hashPathBools})
// }
// function bytes32ArrayToNoir(bytes:string[]) {
//     return bytes.map((x)=>{
//         const b=[...ethers.toBeArray(x)]
//         const zeros = Array(32-b.length).fill(0)
//         return [...zeros, ...b]
//     }).map((x)=>`[${x.toString()}]`).toString()
// }

function bytes32ArrayToNoirJs(bytes:string[]) : InputValue[]  {
    return bytes.map((x)=>{
        const b=[...ethers.toBeArray(x)]
        const zeros = Array(32-b.length).fill(0)
        return [...zeros, ...b]
    })
}
// function singleBytes32ToNoir(bytes32:string) {
//     const b=[...ethers.toBeArray(bytes32)]
//     const zeros = Array(32-b.length).fill(0)
//     return [...zeros, ...b].toString()
// }

function paddArray(arr:any[], len = 32, filler = 0, infront = true) {
    if (infront) {
        return [...Array(len - arr.length).fill(filler), ...arr]

    } else {
        return [...arr, ...Array(len - arr.length).fill(filler)]
    }
}

function fillCommitmentsWithZeroValue(
    commitments:ethers.BytesLike[], 
    emptyCommitment:ethers.BytesLike = EMPTY_COMMITMENT, 
    treeDepth=TREE_DEPTH
) { 
    //@notice js trips up when array length exceed 2**30
    const ammountCommitments =  2 ** treeDepth
    return [...commitments, ...Array(ammountCommitments-commitments.length).fill(emptyCommitment)]
}


export function hashCommitment(nullifierHashPreImage:bigint,secret:  bigint,chainId: bigint) : bigint {
    //const abiCoder = new ethers.AbiCoder()
    //return ethers.keccak256(abiCoder.encode(["bytes32", "bytes32", "uint256"], [nullifierHashPreImage,secret,chainId]))
    return poseidon3([nullifierHashPreImage,secret,chainId])
}

export async function getAllCommitments(ToadnadoL1:ToadnadoL1,ToadnadoL2:ToadnadoL2, startBlock=0, blocksPerScan=100, maxSimultaneousReqs=5, lastBlock="latest") {
    const depositEventFilter = ToadnadoL1.filters.Deposit()

    const L1events = await eventScanInChunks(ToadnadoL1,depositEventFilter,startBlock,blocksPerScan,maxSimultaneousReqs,lastBlock)
    const L2events = await eventScanInChunks(ToadnadoL2,depositEventFilter,startBlock,blocksPerScan,maxSimultaneousReqs,lastBlock)

    const commitmentsL1 = L1events.map((event) => event.topics[1])
    const commitmentsL2 = L2events.map((event) => event.topics[1])
    console.log({commitmentsL1, commitmentsL2})

    return {commitmentsL1, commitmentsL2}

}

export async function eventScanInChunks(contract: ethers.Contract | any, eventFilter: ethers.ContractEventName, startBlock: number = 0, blocksPerScan: number = 100, maxSimultaneousReqs: number = 5, lastBlock: number | string = "latest") {
    const provider = contract.runner?.provider as ethers.Provider
    const lastBlockNum: number = (lastBlock === "latest" ? await provider.getBlockNumber() : lastBlock) as number
    const events = []
    const pendingEvents: any = []
    const amountOfScans = Math.ceil((lastBlockNum - startBlock) / blocksPerScan)
    for (let index = 0; index < amountOfScans; index++) {
        if (pendingEvents.length > maxSimultaneousReqs) {
            console.log(pendingEvents)
            await Promise.any(pendingEvents)
            const fulfilledReqIndex = pendingEvents.findIndex((event: any) => util.inspect(event).includes("pending"))
            pendingEvents.splice(fulfilledReqIndex, 1) // remove the fulfilled req
    
        }

        const eventsChunk = contract.queryFilter(eventFilter, index * blocksPerScan, (index + 1) * blocksPerScan)
        events.push(eventsChunk)
        pendingEvents.push(eventsChunk)
    }

    return (await Promise.all(events)).flat()
}

export function hashMetaRoot(l1Root:bigint,l2Root:bigint) {
    return poseidon2([l1Root,l2Root])
}

export async function getWithdrawCalldata(
    recipient:string, // <-- address
    secret:bigint, // string = ether.bytesLike. typescript sucks 
    nullifierHashPreImage:bigint, 
    chainId: bigint ,
    commitmentIndex:number, 
    commitmentsL1:ethers.BytesLike[],
    commitmentsL2:ethers.BytesLike[],
    commitmentIsFromL1:boolean,
) { 
    // get metaRoot and trees ---------------------------------------------
    const allCommitmentsL1 = fillCommitmentsWithZeroValue(commitmentsL1)
    const allCommitmentsL2 = fillCommitmentsWithZeroValue(commitmentsL2)
    const hashFunction = (left:any,right:any)=>poseidon2([left,right]) as any//(left:any,right:any)=>ethers.keccak256(ethers.concat([left,right]))
    // @dev the bigint are gonna fuck with MerkleTree because it is used to bytesLike
    const l1Tree =  new MerkleTree(TREE_DEPTH,allCommitmentsL1,{hashFunction,zeroElement:EMPTY_COMMITMENT}) //generateTree(allCommitmentsL1)
    const l2Tree = new MerkleTree(TREE_DEPTH,allCommitmentsL2,{hashFunction,zeroElement:EMPTY_COMMITMENT})//generateTree(allCommitmentsL2)
    const l1Root = BigInt(l1Tree.root)
    const l2Root = BigInt(l2Tree.root)

    //console.log({l1Root: l1Tree.tree[l1Tree.tree.length-1], l2Root: l2Tree.tree[l2Tree.tree.length-1]})
    const metaRoot = hashMetaRoot( l1Root,l2Root) //ethers.keccak256(abiCoder.encode(["bytes32", "bytes32"], [l1Root,l2Root]))

    const rootOtherLayer = commitmentIsFromL1 ? l2Root  :  l1Root  

    // nullifier hash and commitment ---------------------------------------
    const nullifierHash = poseidon1([nullifierHashPreImage])
    const commitmentHash  = hashCommitment(nullifierHashPreImage,secret,chainId) //ethers.keccak256(abiCoder.encode(["bytes32", "bytes32", "uint256"], [nullifierHashPreImage,secret,chainId])) //TODO make function of this 

    // get merkle proof
    console.log({commitmentIndex})
    const proofPath = commitmentIsFromL1 ? l1Tree.path(commitmentIndex) : l2Tree.path(commitmentIndex)
    const hashPath = proofPath.pathElements.map((hash:any)=>ethers.zeroPadValue(ethers.toBeHex(hash), 32)) // tree.path().proofPath returns a BigInt so we convert to ethers.BytesLike string
    const hashPathBools = indexToPathBools(BigInt(commitmentIndex), TREE_DEPTH)

    // format circuit inputs
    //console.log({metaRoot})
    const inputs:InputMap = {
        root:                   ethers.toBeHex(metaRoot),                                   // pub Field,
        nullifierHash:          ethers.toBeHex(nullifierHash),                              // pub Field, 
        recipient:              ethers.zeroPadValue(recipient,32),                          // pub Field, 
        // relayer:                                                                         // --pub Field,
        // fee:                                                                             // --pub Field,
        // refund:                                                                          // --pub Field,
        nullifierHashPreImage:  ethers.toBeHex(nullifierHashPreImage),                      // priv Field
        secret:                 ethers.toBeHex(secret),                                     // priv Field
        chainId:                Number(chainId) as InputValue,                              // priv Field
        hash_path:              hashPath.map((v)=>ethers.toBeHex(v)) as InputValue,         // priv [Field;TREE_DEPTH],
        hash_path_bools:        hashPathBools,                                              // [bool; TREE_DEPTH],
        root_other_layer:       ethers.toBeHex(rootOtherLayer),                             // Field
        root_other_is_right:    commitmentIsFromL1                                          // Field
    }

    const snarkProofData = await NOIR.generateProof(inputs)
    
    // const verifiedLocally =await NOIR.verifyProof({proof:snarkProofData.proof, publicInputs:snarkProofData.publicInputs})
    // console.log({verifiedLocally})

    const contractInputs =  {
        l1Root,
        l2Root, 
        nullifierHash, 
        recipient, 
        snarkProof: ethers.hexlify(snarkProofData.proof),
        publicInputs: snarkProofData.publicInputs
    }

    return contractInputs
}