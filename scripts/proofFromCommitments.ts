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

const NOIR_BACKEND = new BarretenbergBackend(circuit as CompiledCircuit);
const NOIR = new Noir(circuit as CompiledCircuit, NOIR_BACKEND)

const TREE_DEPTH = 5
const EMPTY_COMMITMENT = ethers.zeroPadBytes(ethers.toBeHex(21663839004416932945382355908790599225266501822907911457504978515578255421292n),32)

interface tree {
    tree: ethers.BytesLike[][];
    treeDepth: number;
  }

export function generateTree(commitments:string[]=[]): tree {
    const abiEncoder = new ethers.AbiCoder
    const commitmentsLen = commitments.length
    const treeDepth = Math.log(commitmentsLen) / Math.log(2)
    const tree =[commitments, ...Array(treeDepth).fill([]).map((x)=>structuredClone(x))]
    let offset = 0
    let preImagesLen = commitmentsLen

    for (let currentDepth = 0; currentDepth < treeDepth; currentDepth++) {
        //console.log({tree, currentDepth})
        const preImages = tree[currentDepth]//.slice(offset, offset+preImagesLen)
        
        //add new layer hashes
        for (let i=0; i < preImages.length; i+=2) {
            const left = preImages[i]
            const right = preImages[i+1]

            const hash = ethers.keccak256(abiEncoder.encode(["bytes32","bytes32"], [left,right]))
            tree[currentDepth+1].push(hash)
        }   

        // offset += preImagesLen
        // preImagesLen = preImages.length/2
    }

    return {tree, treeDepth}
}

export function indexToPathBools(leafIndex: BigInt, treeDepth: number) {
    const bools = leafIndex.toString(2).split('').map(x => x === '1')
    const hashPathBools = [...Array(treeDepth-bools.length).fill(false), ...bools].reverse()
    return hashPathBools
}

export function getProofFromTree(tree: ethers.BytesLike[][], leafIndex:number, treeDepth:number) {
    const leaf = tree[0][leafIndex]
    const hashPath = []

    //const bools = BigInt(leafIndex).toString(2).split('').map(x => x === '1')
    const hashPathBools = indexToPathBools(BigInt(leafIndex), treeDepth)
    let nodeIndex = leafIndex
    for (let currentLevel = 0; currentLevel < treeDepth; currentLevel++) {
        const syblingIsLeft = hashPathBools[currentLevel]
        if (syblingIsLeft) {
            hashPath.push(tree[currentLevel][nodeIndex-1])
        } else {
            hashPath.push(tree[currentLevel][nodeIndex+1])
        }
        
        nodeIndex = Math.floor(nodeIndex/2)
        
    }

    return {hashPath, hashPathBools, leaf}
}


export function getMerkleProof(allCommitments: string[], targerCommitmentIndex: number) {
    const {tree, treeDepth} = generateTree(allCommitments)
    const root = tree[tree.length-1][0]
    console.log({root: tree[tree.length-1], treeDepth})
    const {hashPath, hashPathBools, leaf} = getProofFromTree(tree, targerCommitmentIndex,treeDepth)
    return {hashPath, hashPathBools, leaf, root}

}


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
function bytes32ArrayToNoir(bytes:string[]) {
    return bytes.map((x)=>{
        const b=[...ethers.toBeArray(x)]
        const zeros = Array(32-b.length).fill(0)
        return [...zeros, ...b]
    }).map((x)=>`[${x.toString()}]`).toString()
}

function bytes32ArrayToNoirJs(bytes:string[]) : InputValue[]  {
    return bytes.map((x)=>{
        const b=[...ethers.toBeArray(x)]
        const zeros = Array(32-b.length).fill(0)
        return [...zeros, ...b]
    })
}
function singleBytes32ToNoir(bytes32:string) {
    const b=[...ethers.toBeArray(bytes32)]
    const zeros = Array(32-b.length).fill(0)
    return [...zeros, ...b].toString()
}

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

export async function getWithdrawCalldata(
    recipient:string, // <-- address
    secret:string, // string = ether.bytesLike. typescript sucks 
    nullifierHashPreImage:string, 
    chainId:BigInt ,
    commitmentIndex:number, 
    commitmentsL1:ethers.BytesLike[],
    commitmentsL2:ethers.BytesLike[],
    commitmentIsFromL1:boolean,
) { 
    // get metaRoot and trees ---------------------------------------------
    const allCommitmentsL1 = fillCommitmentsWithZeroValue(commitmentsL1)
    const allCommitmentsL2 = fillCommitmentsWithZeroValue(commitmentsL2)
    const hashFunction = (left:any,right:any)=>ethers.keccak256(ethers.concat([left,right]))
    const l1Tree =  new MerkleTree(TREE_DEPTH,allCommitmentsL1,{hashFunction,zeroElement:EMPTY_COMMITMENT}) //generateTree(allCommitmentsL1)
    const l2Tree = new MerkleTree(TREE_DEPTH,allCommitmentsL2,{hashFunction,zeroElement:EMPTY_COMMITMENT})//generateTree(allCommitmentsL2)
    const l1Root = ethers.zeroPadValue(ethers.toBeHex( l1Tree.root), 32) //l1Tree.tree[l1Tree.tree.length-1][0]
    const l2Root = ethers.zeroPadValue(ethers.toBeHex( l2Tree.root), 32) //l2Tree.tree[l2Tree.tree.length-1][0]
    //console.log({l1Root: l1Tree.tree[l1Tree.tree.length-1], l2Root: l2Tree.tree[l2Tree.tree.length-1]})
    const abiCoder = new ethers.AbiCoder()
    const metaRoot = ethers.keccak256(abiCoder.encode(["bytes32", "bytes32"], [l1Root,l2Root]))

    const rootOtherLayer = commitmentIsFromL1 ? l2Root as string :  l1Root  as string 

    // nullifier hash and commitment ---------------------------------------
    const nullifierHash = ethers.keccak256(nullifierHashPreImage)
    const commitmentHash  = ethers.keccak256(abiCoder.encode(["bytes32", "bytes32", "uint256"], [nullifierHashPreImage,secret,chainId])) //TODO make function of this 

    // get merkle proof
    const proofPath = commitmentIsFromL1 ? l1Tree.path(commitmentIndex) : l2Tree.path(commitmentIndex)
    const hashPath = proofPath.pathElements.map((hash:any)=>ethers.zeroPadValue(ethers.toBeHex(hash), 32)) // tree.path().proofPath returns a BigInt so we convert to ethers.BytesLike string
    const hashPathBools = indexToPathBools(BigInt(commitmentIndex), TREE_DEPTH)

    // format circuit inputs
    //console.log({metaRoot})
    const inputs:InputMap = {
        root:  paddArray([...ethers.toBeArray(metaRoot)],32,0,true),                                                       //pub [u8;32],
        nullifierHash: paddArray([...ethers.toBeArray(nullifierHash)],32,0,true),                                        //pub [u8;32], 
        recipient:ethers.zeroPadValue(recipient,32),                                                //pub Field, 
        chainId:Number(chainId)as InputValue,
        // relayer:                                                                                 //pub Field,
        // fee:                                                                                     //pub Field,
        // refund:                                                                                  //pub Field,
        //chainId:                                                                                  //pub Field,
        nullifierHashPreImage: paddArray([...ethers.toBeArray(nullifierHashPreImage)],32,0,true) ,  //[u8;32],
        secret: paddArray([...ethers.toBeArray(secret)],32,0,true),                                 //[u8;32],
        hash_path: bytes32ArrayToNoirJs(hashPath as string[]) as InputValue,                        //[[u8;32];TREE_DEPTH],
        hash_path_bools:  hashPathBools,                                                            //[bool; TREE_DEPTH],
        root_other_layer:  paddArray([...ethers.toBeArray(rootOtherLayer)],32,0,true),
        root_other_is_right: commitmentIsFromL1
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