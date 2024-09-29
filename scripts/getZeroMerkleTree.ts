//import { poseidon2 } from 'poseidon-lite'
import {ethers } from 'ethers'
import * as fs from 'node:fs/promises';
import {poseidon2 } from 'poseidon-lite';
export function getEmptyLevels(treeDepth=32, hashFunction:Function) {
    const levels = [0n];
    for (let level = 1; level < treeDepth; level++) {
        const prevLevel =  levels[level-1]
        const nextLevel = hashFunction(prevLevel, prevLevel)
        levels.push(nextLevel)
    }
    return levels
}

// formats it into solidity code like this: else if (i == 0) return bytes32(0x0000000000000000000000000000000000000000000000000000000000000000);
function formatLevelsSol(levels:bigint[]) {
    let solidityStr = ""
    for (const [i, level] of levels.entries()) {
        solidityStr += `else if (i == ${i}) return uint256(${level});\n`
    }
    return solidityStr
}

async function main() {
    const treeDepth = 34
    const hashFunction = (left:string | number | bigint,right:string | number | bigint)=>poseidon2([left,right])
    const outputFolder = './scripts/output'

    let levels = getEmptyLevels(treeDepth, hashFunction)
    //CaNt DeSerIaLizE bIgINt
    levels = levels.map((v:any)=> typeof(v) === "bigint"? v.toString() : v)
    console.log(levels)
    await fs.writeFile(`${outputFolder}/levels.json`, JSON.stringify(levels, null, 2));
    await fs.writeFile(`${outputFolder}/levelsSol.txt`, formatLevelsSol(levels))
    console.log(`output files genrated at: \n ${`${outputFolder}/levels.json`} \n ${`${outputFolder}/levelsSol.txt`}`)
}

main()