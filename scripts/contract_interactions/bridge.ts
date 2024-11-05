import { ToadnadoL1, ToadnadoL2 } from "../../typechain-types";
import { getWithdrawCalldata, hashCommitment, hashPreCommitment } from "../proofFromCommitments"
import ToadnadoL1Artifact from "../../artifacts/contracts/ToadnadoL1.sol/ToadnadoL1.json"
import ToadnadoL2Artifact from "../../artifacts/contracts/ToadnadoL2.sol/ToadnadoL2.json"
import UltraVerifierArtifact from "../../artifacts/contracts/plonk_vk.sol/UltraVerifier.json"
import { ethers } from "ethers";

import { vars } from "hardhat/config";


//config TODO make arg in terminal
const SOURCE_ON_L1: Boolean = false
const PRIVATE_KEY = vars.get("TEST_PRIVATE_KEY")

// constants
const BRIDGING_GASLIMIT = 100000000n

const L1_PROVIDER = new ethers.JsonRpcProvider("https://sepolia.drpc.org")
const L1_SIGNER = new ethers.Wallet(PRIVATE_KEY, L1_PROVIDER)
const L2_PROVIDER = new ethers.JsonRpcProvider("https://l1sload-rpc.scroll.io")
const L2_SIGNER = new ethers.Wallet(PRIVATE_KEY, L2_PROVIDER)

const L1_CONTRACT = "0xE9b3ED3F4cD738199D78adbe81c7a5dA9AdAB91f"
const L2_CONTRACT = "0xE075E49023217f56b7f00724C48d73420C766801"

const SOURCE_CONTRACT = SOURCE_ON_L1 ? new ethers.Contract(L1_CONTRACT, ToadnadoL1Artifact.abi, L1_SIGNER) : new ethers.Contract(L2_CONTRACT, ToadnadoL2Artifact.abi, L2_SIGNER)
const DESTINATION_CONTRACT = SOURCE_ON_L1 ? new ethers.Contract(L2_CONTRACT, ToadnadoL2Artifact.abi, L2_SIGNER)  :  new ethers.Contract(L1_CONTRACT, ToadnadoL1Artifact.abi, L1_SIGNER) 

async function main() {
    if (SOURCE_ON_L1 === false) {
        console.log(`Bridging latest root from L2 to L1 from contract: ${SOURCE_CONTRACT.target} at chain ${((await SOURCE_CONTRACT!.runner!.provider!.getNetwork()).chainId)}`)
        const sendLatestRootToL1Tx = (await SOURCE_CONTRACT.sendLatestRootToL1(BRIDGING_GASLIMIT)).wait(1)
        console.log({sendLatestRootToL1Tx})
    }

    const destContractDebt = await DESTINATION_CONTRACT.bridgeDebt()
    if (destContractDebt) {
        const requestEthBridgeTx = (await DESTINATION_CONTRACT.requestEthBridge(BRIDGING_GASLIMIT)).wait(1)
        console.log({requestEthBridgeTx})
    } else {
        console.log(`Destination contract: ${DESTINATION_CONTRACT.target} has no "bridgeDebt". No eth to bridge!`)
    }

}
main()