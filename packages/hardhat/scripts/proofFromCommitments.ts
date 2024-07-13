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
    const paddedBools = [...Array(treeDepth-bools.length).fill(false), ...bools].reverse()
    let nodeIndex = leafIndex
    for (let currentLevel = 0; currentLevel < treeDepth; currentLevel++) {
        const syblingIsLeft = paddedBools[currentLevel]
        console.log({syblingIsLeft})
        if (syblingIsLeft) {
            hashPath.push(tree[currentLevel][nodeIndex-1])
        } else {
            hashPath.push(tree[currentLevel][nodeIndex+1])
        }
        
        nodeIndex = Math.floor(nodeIndex/2)
        
    }

    return hashPath

}

function main() {
    const comitments = [0,1,2,3,4,5,6,7].map((x)=>ethers.zeroPadValue(ethers.toBeHex(x),32))
    const {tree, treeDepth} = generateTree(comitments)
    console.log({tree, treeDepth})
    const hashPath = getProofFromTree(tree, 5,treeDepth)
    console.log({hashPath})
}

main()