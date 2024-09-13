//import { poseidon2 } from 'poseidon-lite'
import {ethers } from 'ethers'
import * as fs from 'node:fs/promises';

export function getEmptyLevels(treeDepth=32, hashFunction:Function) {
    const levels = [ethers.zeroPadValue("0x00", 32)];
    for (let level = 1; level < treeDepth; level++) {
        const prevLevel =  levels[level-1]
        const nextLevel = hashFunction(prevLevel, prevLevel)
        levels.push(nextLevel)
    }
    return levels
}

function formatLevelsSol(levels:ethers.BytesLike[]) {
    let solidityStr = ""
    for (const [i, level] of levels.entries()) {
        solidityStr += `else if (i == ${i}) return bytes32(${level});\n`
    }
    return solidityStr
}

async function main() {
    const treeDepth = 21
    const hashFunction = (left:ethers.BytesLike,right:ethers.BytesLike)=>ethers.keccak256(ethers.concat([left,right]))
    const outputFolder = './scripts/output'

    const levels = getEmptyLevels(treeDepth, hashFunction)
    await fs.writeFile(`${outputFolder}/levels.json`, JSON.stringify(levels, null, 2));
    await fs.writeFile(`${outputFolder}/levelsSol.txt`, formatLevelsSol(levels))
    console.log(`output files genrated at: \n ${`${outputFolder}/levels.json`} \n ${`${outputFolder}/levelsSol.txt`}`)
}

main()