import { ethers } from "ethers";
const TREE_DEPTH = 5
const EMPTY_COMMITMENT = ethers.zeroPadBytes(ethers.toBeHex(21663839004416932945382355908790599225266501822907911457504978515578255421292n),32)


//noir
import { BarretenbergBackend, BarretenbergVerifier as Verifier } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import type {InputMap} from '@noir-lang/noir_js';
type InputValue = Field | InputMap | (Field | InputMap)[]
type Field = string | number | boolean;;
import circuit from '../../../circuits/prover/target/prover.json'  assert {type: 'json'};

const NOIR_BACKEND = new BarretenbergBackend(circuit);
const NOIR = new Noir(circuit, NOIR_BACKEND)

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

export function getProofFromTree(tree: ethers.BytesLike[][], leafIndex:number, treeDepth:number) {
    const leaf = tree[0][leafIndex]
    const hashPath = []

    const bools = BigInt(leafIndex).toString(2).split('').map(x => x === '1')
    const hashPathBools = [...Array(treeDepth-bools.length).fill(false), ...bools].reverse()
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


export async function makeZeroBytes() {
    //const comitments = [0,1,2,3,4,5,6,7].map((x)=>ethers.zeroPadValue(ethers.toBeHex(x),32))
    const treeDepth = 20n
    const ammountCommitments = 2n ** treeDepth

    const zeroBytes = ethers.zeroPadBytes(ethers.toBeHex(21663839004416932945382355908790599225266501822907911457504978515578255421292n),32) //keccack("tornado")
    const commitments = Array(Number(ammountCommitments)).fill(zeroBytes); //["0x0000000000000000000000000000000000000000000000000000000000000014", ...Array(ammountCommitments-1).fill(zeroBytes)]
    console.log({ammountCommitments, commitmentslen: commitments.length})
    const {tree} = generateTree(commitments);
    // 0 = leaf 20 = root
    const levels = tree.map((x, i)=>[i, x[0]])
    console.log({levels})
    

    const path = `${import.meta.dir}/output/levels.json`
    console.log({path})
    await Bun.write(path, JSON.stringify({comment:"0 = leaf 20 = root",levels},null,2));


    // console.log({commitmentsLen: commitments.length})
    // const  {hashPath, hashPathBools} =   getMerkleProof(commitments, 0)
    // console.log({hashPath, hashPathBools})
}
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

async function generateProof(
    commitments:string[], 
    nullifierHashPreImage: string,
    secret: string, 
    recipient: string, 
    commitmentIndex:number, 
    metaRoot:string,isL1:boolean, 
    rootOtherLayer:string
) {
    const  {hashPath, hashPathBools, leaf, root} =   getMerkleProof(commitments, commitmentIndex)

    const abiEncoder = new ethers.AbiCoder()
    const commitmentHash = ethers.keccak256(abiEncoder.encode(["bytes32", "bytes32"], [nullifierHashPreImage,secret])) 
    const nullifierHash = ethers.keccak256(nullifierHashPreImage)
    const backend = new BarretenbergBackend(circuit);
    const noir = new Noir(circuit, backend)
    const inputs:InputMap = {
        root:[...ethers.toBeArray(metaRoot)],                                      //pub [u8;32],
        nullifierHash: [...ethers.toBeArray(nullifierHash)],                    //pub [u8;32], 
        recipient:ethers.zeroPadValue(recipient,32),                            //pub Field, 
        // relayer:                                     //pub Field,
        // fee:                                         //pub Field,
        // refund:                                      //pub Field,
        //chainId:                                      //pub Field,
        nullifierHashPreImage: paddArray([...ethers.toBeArray(nullifierHashPreImage)],32,0,true) ,   //[u8;32],
        secret: paddArray([...ethers.toBeArray(secret)],32,0,true),                                 //[u8;32],
        hash_path: bytes32ArrayToNoirJs(hashPath) as InputValue,                            //[[u8;32];TREE_DEPTH],
        hash_path_bools:  hashPathBools,                //[bool; TREE_DEPTH],
        root_other_layer: [...ethers.toBeArray(rootOtherLayer)] ,
        root_other_is_right: isL1
    }
    console.log({inputs})
    const snarkProof = await noir.generateProof(inputs)
    return snarkProof 
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
    commitmentIndex:number, 
    commitmentsL1:ethers.BytesLike[],
    commitmentsL2:ethers.BytesLike[],
    commitmentIsFromL1:boolean,
) { 
    //chaindata
    // allCommitmentsL1
    // allCommitmentsL2
    // commitmentIndex
    // commitmentIsFromL1

    // get metaRoot and trees ---------------------------------------------
    const allCommitmentsL1 = fillCommitmentsWithZeroValue(commitmentsL1)
    const allCommitmentsL2 = fillCommitmentsWithZeroValue(commitmentsL2)
    const l1Tree = generateTree(allCommitmentsL1)
    const l2Tree = generateTree(allCommitmentsL2)
    const l1Root = l1Tree.tree[l1Tree.tree.length-1][0]
    const l2Root = l2Tree.tree[l2Tree.tree.length-1][0]
    console.log({l1Root: l1Tree.tree[l1Tree.tree.length-1], l2Root: l2Tree.tree[l2Tree.tree.length-1]})
    const abiCoder = new ethers.AbiCoder()
    const metaRoot = ethers.keccak256(abiCoder.encode(["bytes32", "bytes32"], [l1Root,l2Root]))

    let rootOtherLayer
    if(commitmentIsFromL1) {
        rootOtherLayer = l2Root as string
    } else {
        rootOtherLayer = l1Root  as string //typescript thing
    }

    // nullifier hash and commitment ---------------------------------------
    const nullifierHash = ethers.keccak256(nullifierHashPreImage)
    const commitmentHash  = ethers.keccak256(abiCoder.encode(["bytes32", "bytes32"], [nullifierHashPreImage,secret])) 


    // get merkle proof data -------------------------------
    let merkleProofData 
    if(commitmentIsFromL1) {
        merkleProofData = getProofFromTree(l1Tree.tree, commitmentIndex,TREE_DEPTH)
    } else {
        merkleProofData = getProofFromTree(l2Tree.tree, commitmentIndex,TREE_DEPTH)
    }
    const hashPath = merkleProofData.hashPath
    const hashPathBools = merkleProofData.hashPathBools





    // format circuit inputs
    console.log({metaRoot})
    const inputs:InputMap = {
        root:[...ethers.toBeArray(metaRoot)],                                                       //pub [u8;32],
        nullifierHash: [...ethers.toBeArray(nullifierHash)],                                        //pub [u8;32], 
        recipient:ethers.zeroPadValue(recipient,32),                                                //pub Field, 
        // relayer:                                                                                 //pub Field,
        // fee:                                                                                     //pub Field,
        // refund:                                                                                  //pub Field,
        //chainId:                                                                                  //pub Field,
        nullifierHashPreImage: paddArray([...ethers.toBeArray(nullifierHashPreImage)],32,0,true) ,  //[u8;32],
        secret: paddArray([...ethers.toBeArray(secret)],32,0,true),                                 //[u8;32],
        hash_path: bytes32ArrayToNoirJs(hashPath as string[]) as InputValue,                        //[[u8;32];TREE_DEPTH],
        hash_path_bools:  hashPathBools,                                                            //[bool; TREE_DEPTH],
        root_other_layer: [...ethers.toBeArray(rootOtherLayer)] ,
        root_other_is_right: commitmentIsFromL1
    }
    console.log({circuitInputs: inputs})
    const snarkProofData = await NOIR.generateProof(inputs)
    
    const verified =await NOIR.verifyProof({proof:snarkProofData.proof, publicInputs:snarkProofData.publicInputs})
    console.log({verified})

    const contractInputs =  {
        l1Root,
        l2Root, 
        nullifierHash, 
        recipient, 
        snarkProof: ethers.hexlify(snarkProofData.proof)
    }
    console.log({contractInputs})
    console.log({publicInputs:snarkProofData.publicInputs})
    return contractInputs
    


    // pubinputs
    // root:pub [u8;32],
    // nullifierHash:pub [u8;32], 
    // recipient:pub Field, 

    // non circuit contract inputs
    // snarkProof    
}

async function main() {
    //await makeZeroBytes()
    //const treeDepth = 5
    //const ammountCommitments = Number( 2 ** treeDepth)

    
    //const abiEncoder = new ethers.AbiCoder()
    
    // user secrets (should be from crypto.getRandomValues)
    const nullifierHashPreImage = "0x0000000000000000000000000000000000000000000000000000000000000014"
    const secret = "0x0000000000000000000000000000000000000000000000000000000000000014"
    
    // user withdraw address
    const recipient = "0x794464c8c91A2bE4aDdAbfdB82b6db7B1Bb1DBC7"
    const commitmentIndex = 1
    const isL1 = true

    const abiCoder = new ethers.AbiCoder()
    const commitmentHash  = ethers.keccak256(abiCoder.encode(["bytes32", "bytes32"], [nullifierHashPreImage,secret])) 
    console.log({commitmentHash})
    const commitmentsL1 = ["0x0000000000000000000000000000000000000000000000000000000000000001",commitmentHash] 
    const commitmentsL2:string[] = ["0x0000000000000000000000000000000000000000000000000000000000000001"] 

    await getWithdrawCalldata(
        recipient,
        secret,
        nullifierHashPreImage,
        commitmentIndex,
        commitmentsL1,
        commitmentsL2,
        isL1
    )



    process.exit();

    // the commitment that is used in the deposit and added to the tree
    //const commitmentHash  = ethers.keccak256(abiEncoder.encode(["bytes32", "bytes32"], [nullifierHashPreImage,secret])) 

    // make full list of commitments, used to recreate the merkle tree
    //const zeroBytes = ethers.zeroPadBytes(ethers.toBeHex(21663839004416932945382355908790599225266501822907911457504978515578255421292n),32)
    //const commitmentsL1 = [commitmentHash, ...Array(ammountCommitments-1).fill(zeroBytes)]
    //const commitmentsL2 = [...Array(ammountCommitments).fill(zeroBytes)]

    // get roots
    // const l2tree = generateTree(commitmentsL2)
    // const l2Root = l2tree.tree[treeDepth][0]
    // const l1tree = generateTree(commitmentsL1)
    // const l1Root = l1tree.tree[treeDepth][0]

    // const abiCoder = new ethers.AbiCoder()
    // const metaRoot = ethers.keccak256(abiCoder.encode(["bytes32", "bytes32"], [l1Root,l2Root])) 
    // console.log({l1Root, l2Root,metaRoot})


    // commitmentIndex = 0 = user was the first deposit


    // build the merkle tree from all commitments and generate a merkle proof (hashPath + hashPathBools)
    //const  {hashPath, hashPathBools, leaf, root} =   getMerkleProof(commitmentsL1, commitmentIndex)
    //console.log({hashPath,  hashPathBools: hashPathBools, leaf})//.slice().reverse()})
    //const {proof, publicInputs} = await generateProof(commitmentsL1,nullifierHashPreImage,secret,recipient,commitmentIndex, metaRoot, isL1, l2Root as string)



    // console.log("\n--------quick way to get inputs for testing inside noir-------\n")
    // console.log(`
    // let hash_path = [${bytes32ArrayToNoir(hashPath)}];
    // let leaf = [${singleBytes32ToNoir(leaf)}];
    // let real_root = [${singleBytes32ToNoir(root)}];
    // let hash_path_bools = [${hashPathBools}];
    // `)
}
//main()