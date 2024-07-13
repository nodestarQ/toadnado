import { ethers } from "ethers";


export function generateTree(commitments:string[]=[]) {
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

export function getProofFromTree(tree: string[], leafIndex:number, treeDepth:number) {
    const leaf = tree[leafIndex]
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

    return {hashPath, hashPathBools}
}


export function getMerkleProof(allCommitments: string[], targerCommitmentIndex: number) {
    const {tree, treeDepth} = generateTree(allCommitments)
    console.log({root: tree[tree.length-1], treeDepth})
    const {hashPath, hashPathBools} = getProofFromTree(tree, targerCommitmentIndex,treeDepth)
    return {hashPath, hashPathBools}

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

async function main() {
    await makeZeroBytes()
}
main()