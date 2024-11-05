import { ToadnadoL1, ToadnadoL2 } from "../../typechain-types";
import { getWithdrawCalldata, hashCommitment, hashPreCommitment } from "../proofFromCommitments"
import ToadnadoL1Artifact from "../../artifacts/contracts/ToadnadoL1.sol/ToadnadoL1.json"
import ToadnadoL2Artifact from "../../artifacts/contracts/ToadnadoL2.sol/ToadnadoL2.json"
import UltraVerifierArtifact from "../../artifacts/contracts/plonk_vk.sol/UltraVerifier.json"
import { ethers } from "ethers";

import { vars } from "hardhat/config";

//config TODO make arg in terminal
import note from "./output/note-2024-10-28T23:05:06.241Z.json"


const PRIVATE_KEY = vars.get("TEST_PRIVATE_KEY")

const WITHDRAW_ADDRESS = "0x0000000000000000000000000000000420420420"

// constants
const L1_PROVIDER = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/2LPfLOYBTHSHfLWYSv8xib2Y7OA")//"https://sepolia.drpc.org")
const L2_PROVIDER = new ethers.JsonRpcProvider("https://l1sload-rpc.scroll.io")

const L1_CONTRACT = "0xE9b3ED3F4cD738199D78adbe81c7a5dA9AdAB91f";
const L2_CONTRACT = "0xE075E49023217f56b7f00724C48d73420C766801";

const L1_DEPLOYMENT_BLOCK = 6965716;
const L2_DEPLOYMENT_BLOCK = 687087;



async function main() {
    const L1_CHAIN_ID = (await L1_PROVIDER.getNetwork()).chainId

    const DEPOSIT_ON_L1: Boolean = BigInt(note.depositChainId) === L1_CHAIN_ID
    const WITHDRAW_ON_L1: Boolean = BigInt(note.withdrawChainId) === L1_CHAIN_ID

    const DEPOSIT_PROVIDER = DEPOSIT_ON_L1 ? L1_PROVIDER : L2_PROVIDER
    const WITHDRAW_PROVIDER = WITHDRAW_ON_L1 ? L1_PROVIDER : L2_PROVIDER

    const DEPOSIT_CONTRACT = DEPOSIT_ON_L1 ? L1_CONTRACT : L2_CONTRACT
    const WITHDRAW_CONTRACT = WITHDRAW_ON_L1 ? L1_CONTRACT : L2_CONTRACT

    const WITHDRAW_CONTRACT_DEPLOYMENT_BLOCK = WITHDRAW_ON_L1 ? L1_DEPLOYMENT_BLOCK : L2_DEPLOYMENT_BLOCK
    const DEPOSIT_CONTRACT_DEPLOYMENT_BLOCK = DEPOSIT_ON_L1 ? L1_DEPLOYMENT_BLOCK : L2_DEPLOYMENT_BLOCK

    // hash
    const preCommitmentHash = hashPreCommitment(ethers.toBigInt(note.nullifierPreimage), ethers.toBigInt(note.secret), ethers.toBigInt(note.withdrawChainId))
    const commitmentHash = hashCommitment(preCommitmentHash, ethers.toBigInt(note.amount))

    // TODO store as json file
    // note: the secret, nullifierPreimage and withdrawChainId are enough to know how withdraw the note. but other information makes it much easier
    //const note = {commitmentHash: ethers.toBeHex(commitmentHash), secret: ethers.toBeHex(secret), nullifierPreimage: ethers.toBeHex(nullifierPreimage), withdrawChainId: Number(withdrawChainId), depositChainId: Number(depositChainId) , amount: Number(BRIDGE_AMOUNT)}
    const ToadnadoL1:ToadnadoL1 = new ethers.Contract(L1_CONTRACT, ToadnadoL1Artifact.abi, L1_PROVIDER) as unknown as ToadnadoL1 //typescript is awful
    const ToadnadoL2:ToadnadoL2 = new ethers.Contract(L2_CONTRACT, ToadnadoL2Artifact.abi, L2_PROVIDER) as unknown as ToadnadoL2
    
    const signer = new ethers.Wallet(PRIVATE_KEY, WITHDRAW_PROVIDER)
    const ToadnadoForWithdraw = new ethers.Contract(WITHDRAW_CONTRACT, ToadnadoL1Artifact.abi, signer)


    // const test = await ToadnadoL2.getL1Root(1)
    // console.log({test})
    // const L2RootOnL2 = await ToadnadoL2.getLastKnowL2Root()
    // console.log({L2RootOnL2})

    // const L1RootOnL2 = await ToadnadoL2.getLastKnowL1Root()
    // console.log({ L1RootOnL2})
    // calculate the snarkproof and process the data
    console.log("calculating snarkproof")
    const {
        l1Root,
        l2Root,
        nullifierHash,
        recipient,
        snarkProof,
        publicInputs
    } = await getWithdrawCalldata(
        ToadnadoL1,
        ToadnadoL2,
        WITHDRAW_ADDRESS, 
        ethers.toBigInt(note.secret), 
        ethers.toBigInt(note.nullifierPreimage), 
        ethers.toBigInt(note.withdrawChainId), 
        ethers.toBigInt(note.amount), 
        DEPOSIT_ON_L1,
        DEPOSIT_CONTRACT_DEPLOYMENT_BLOCK,
        1
    )


    // verify of chain (sanity check)
    const UltraVerifierContractAddress = await ToadnadoForWithdraw.verifier()
    console.log({UltraVerifierContractAddress})
    const UltraVerifier = new ethers.Contract(UltraVerifierContractAddress, UltraVerifierArtifact.abi, WITHDRAW_PROVIDER)
    const verifiedOnchain = await UltraVerifier.verify(snarkProof, publicInputs)
    console.log({ verifiedOnchain })

    //try withdraw
    console.log("submitting transaction")
    const tx = await (await ToadnadoForWithdraw.withdraw(l1Root, l2Root, nullifierHash, recipient, ethers.toBeHex(note.amount), snarkProof)).wait(1);

    console.log("submitted transaction at: ", tx.hash)
    process.exit(0)
}
main()