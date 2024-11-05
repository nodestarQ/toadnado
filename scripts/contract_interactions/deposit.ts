import { ToadnadoL1, ToadnadoL2 } from "../../typechain-types";
import { hashCommitment, randomWithinFieldLimit, hashPreCommitment } from "../proofFromCommitments"
import ToadnadoL1Artifact from "../../artifacts/contracts/ToadnadoL1.sol/ToadnadoL1.json"
import { ethers } from "ethers";

import { vars } from "hardhat/config";
import * as fs from 'node:fs/promises';

//config TODO make arg in terminal
const DEPOSIT_ON_L1 = false
const WITHDRAW_ON_L1 = false
const BRIDGE_AMOUNT = ethers.parseEther("0.001")
const PRIVATE_KEY = vars.get("TEST_PRIVATE_KEY")

// constants
const L1_PROVIDER = new ethers.JsonRpcProvider("https://sepolia.drpc.org")
const L2_PROVIDER = new ethers.JsonRpcProvider("https://l1sload-rpc.scroll.io")

const L1_CONTRACT = "0xE9b3ED3F4cD738199D78adbe81c7a5dA9AdAB91f"
const L2_CONTRACT = "0xE075E49023217f56b7f00724C48d73420C766801"

const DEPOSIT_PROVIDER = DEPOSIT_ON_L1 ? L1_PROVIDER : L2_PROVIDER
const WITHDRAW_PROVIDER =  WITHDRAW_ON_L1 ? L1_PROVIDER : L2_PROVIDER

const DEPOSIT_CONTRACT =  DEPOSIT_ON_L1 ? L1_CONTRACT : L2_CONTRACT


async function main() {
    const secret = randomWithinFieldLimit()
    const nullifierPreimage = randomWithinFieldLimit()
    // hash
    const depositChainId = (await DEPOSIT_PROVIDER.getNetwork()).chainId
    const withdrawChainId = (await WITHDRAW_PROVIDER.getNetwork()).chainId
    

    const preCommitmentHash = hashPreCommitment(nullifierPreimage, secret, withdrawChainId)
    const commitmentHash = hashCommitment(preCommitmentHash, BRIDGE_AMOUNT)
    
    // TODO store as json file
    // note: the secret, nullifierPreimage and withdrawChainId are enough to know how withdraw the note. but other information makes it much easier
    const note = {commitmentHash: ethers.toBeHex(commitmentHash), secret: ethers.toBeHex(secret), nullifierPreimage: ethers.toBeHex(nullifierPreimage), withdrawChainId: Number(withdrawChainId), depositChainId: Number(depositChainId) , amount: Number(BRIDGE_AMOUNT)}
    
    console.log("generated deposit note: ",{note})
    const filePath = `./scripts/contract_interactions/output/note-${(new Date()).toISOString()}.json`
    await fs.writeFile(filePath, JSON.stringify(note, null, 2));
    const signer = new ethers.Wallet(PRIVATE_KEY, DEPOSIT_PROVIDER)
    const Toadnado = new ethers.Contract(DEPOSIT_CONTRACT, ToadnadoL1Artifact.abi, signer) 
    const tx = await (await Toadnado.deposit(preCommitmentHash, { value: BRIDGE_AMOUNT })).wait(1)

    console.log("submitted transaction at: ", tx.hash)
    
}
main()