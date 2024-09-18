import hre from "hardhat"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ToadnadoL1Module from "../ignition/modules/ToadnadoL1"
import ToadnadoL2Module from "../ignition/modules/ToadnadoL2"

const IS_MAINNET = false

const L1Name: string = IS_MAINNET ? 'mainnet' : 'sepolia'
const L2Name: string = IS_MAINNET ? 'scroll': 'scrollSepolia'

const MERKLE_TREE_HEIGHT = 5n;
const DENOMINATION = BigInt((10 ** 18) / 100); //0.01eth

//const L1_SLOAD_ADDRESS = "0x0000000000000000000000000000000000000101"
const L1_SCROLL_MESSENGER = IS_MAINNET ? "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367" : "0x50c7d3e7f7c656493D1D76aaa1a836CedfCBB16A"
const L2_SCROLL_MESSENGER =  IS_MAINNET ? "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC" : "0xBa50f5340FB9F3Bd074bD638c9BE13eCB36E603d"


async function main() {
    console.log(`deploying contracts on ${L1Name}`)
    await hre.switchNetwork(L1Name);
    const toadnadoL1ModuleArgs = {denomination: DENOMINATION, merkleTreeHeight: MERKLE_TREE_HEIGHT, l1ScrollMessenger: L1_SCROLL_MESSENGER}

    const {toadnadoL1, ultraVerifier: ultraVerifierL1} = await hre.ignition.deploy(
        ToadnadoL1Module, 
        {parameters: {ToadnadoL1Module: {...toadnadoL1ModuleArgs}},}
    );

    console.log(`deploying contracts on ${L2Name}`);
    (L2Name === "scrollSepolia") ? console.log("NOTICE deploying to scrollSepolia instead of L1SLOAD, since its down. This breaks bridging of the L1ROOT") : null;
    await hre.switchNetwork(L2Name);

    const toadnadoL2ModuleArgs = {denomination: DENOMINATION, merkleTreeHeight: MERKLE_TREE_HEIGHT, l2ScrollMessenger: L2_SCROLL_MESSENGER, l1ToadnadoAddress: toadnadoL1.target as string} // bro i swear typescript is trash
    const {toadnadoL2, ultraVerifier: ultraVerifierL2} = await hre.ignition.deploy(
        ToadnadoL2Module, 
        {parameters: {ToadnadoL2Module: {...toadnadoL2ModuleArgs}},}
    );

    console.log(`setting setL2ScrollToadnadoAddress at toadnadoL1`);
    await hre.switchNetwork(L1Name);
    const toadnadoL1s_L2Address = await toadnadoL1.l2ScrollToadnadoAddress() 
    if (toadnadoL1s_L2Address === "0x0000000000000000000000000000000000000000") {
        await toadnadoL1.setL2ScrollToadnadoAddress(toadnadoL2.target)
    } else if (toadnadoL1s_L2Address !== toadnadoL2.target) {
        throw new Error(`toadnadoL1 is already deployed and its L2 conterpart was set to a different address than this script deployed\n expected: ${toadnadoL2.target} got ${toadnadoL1s_L2Address}`)
    } else {
        console.log("setL2ScrollToadnadoAddress was already set!")
    }
    

    console.log(`verifying contracts on ${L1Name}`)
    const toadnadoL1Verification = hre.run("verify:verify", {address: toadnadoL1.target,constructorArguments: [ultraVerifierL1.target, toadnadoL1ModuleArgs.denomination, toadnadoL1ModuleArgs.merkleTreeHeight ,toadnadoL1ModuleArgs.l1ScrollMessenger]})
    const ultraVerifierL1Verification = hre.run("verify:verify", {address: ultraVerifierL1.target,constructorArguments: []})
    await Promise.all([toadnadoL1Verification,ultraVerifierL1Verification])

    console.log(`verifying contracts on ${L2Name}`)
    await hre.switchNetwork(L2Name);
    const toadnadoL2Verification = hre.run("verify:verify", {address: toadnadoL2.target,constructorArguments: [ultraVerifierL2.target, toadnadoL2ModuleArgs.denomination, toadnadoL2ModuleArgs.merkleTreeHeight ,toadnadoL2ModuleArgs.l2ScrollMessenger, toadnadoL2ModuleArgs.l1ToadnadoAddress]})
    const ultraVerifierL2Verification = hre.run("verify:verify", {address: ultraVerifierL2.target,constructorArguments: []})
    await Promise.all([toadnadoL2Verification,ultraVerifierL2Verification])
}
main()