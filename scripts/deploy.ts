import hre from "hardhat"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ToadnadoL1Module from "../ignition/modules/ToadnadoL1"
import ToadnadoL2Module from "../ignition/modules/ToadnadoL2"


import util  from 'util';
import {spawn, exec} from 'node:child_process';
const execPromisified = util.promisify(exec)

import fs from "fs/promises"
import { ChildProcess } from "child_process";

const IS_MAINNET = hre.network.name === "mainnet"

const L1Name: string = IS_MAINNET ? 'mainnet' : 'sepolia'
const L2Name: string = IS_MAINNET ? 'scroll': 'scrollSepolia'

const MERKLE_TREE_HEIGHT = 5n;
const DENOMINATION = BigInt((10 ** 18) / 100); //0.01eth

//const L1_SLOAD_ADDRESS = "0x0000000000000000000000000000000000000101"
const L1_SCROLL_MESSENGER = IS_MAINNET ? "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367" : "0x50c7d3e7f7c656493D1D76aaa1a836CedfCBB16A"
const L2_SCROLL_MESSENGER =  IS_MAINNET ? "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC" : "0xBa50f5340FB9F3Bd074bD638c9BE13eCB36E603d"

function delay(delayInms:number) {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  };
async function deploy(modulePath:string,moduleName:string, networkName:string, parameters={}) {
    //CaNt DeSerIaLizE bIgINt
    parameters = Object.fromEntries(Object.entries(parameters).map((v:any)=> [v[0], typeof(v[1]) === "bigint"? v[1].toString() : v[1]]))
    const formattedParams:any = {};
    formattedParams[moduleName] = parameters;
    
    // cant pass parameters in command it self. very silly
    const tempParametersFile = "scripts/output/deploymentArgs.json"
    await fs.writeFile(tempParametersFile,JSON.stringify(formattedParams));

    const command = `yarn hardhat ignition deploy ${modulePath} --network ${networkName} --parameters ${tempParametersFile}`
    console.log(`deploying with command: :"${command}"`)
    const childProcess = exec(command)

    const output:string[] = [];
    childProcess?.stdout?.on("data", (d) =>{output.push(d);console.log(d)});
    
    await delay(1000);
    childProcess.stdin!.write('y\n') //it asks "would you like to deploy to chain x" Yes ofc i want that!!
    
    await new Promise( (resolve) => {childProcess.on('close', resolve)})

    const lasMessage = output[output.length-1]
    console.log(lasMessage)
    const moduleAddresses:any = {}
    for (const line of lasMessage.split("\n")) {
        if (line.startsWith(moduleName)) {
            const words = line.split(" ")
            moduleAddresses[words[0].replace(moduleName+"#",'')] = words[2]

        }

    }
    console.log({moduleAddresses})
    await fs.rm(tempParametersFile)
    return moduleAddresses
}

async function main() {
    // ffs rollups has been live for 4 years yet hardhat is too retarded to allow me to switch the network
    console.log(`deploying contracts on ${L1Name}`)

    const toadnadoL1ModuleArgs = {denomination: DENOMINATION, merkleTreeHeight: MERKLE_TREE_HEIGHT, l1ScrollMessenger: L1_SCROLL_MESSENGER}
    //await hre.switchNetwork(L1Name);
    // const {toadnadoL1, ultraVerifier: ultraVerifierL1} = await hre.ignition.deploy(
    //     ToadnadoL1Module, 
    //     {parameters: {ToadnadoL1Module: {...toadnadoL1ModuleArgs}},}
    // );
    const { ToadnadoL1, UltraVerifier: ultraVerifierL1} = await deploy("./ignition/modules/ToadnadoL1.ts","ToadnadoL1Module",L1Name,toadnadoL1ModuleArgs);

    // console.log(`deploying contracts on ${L2Name}`);
    (L2Name === "scrollSepolia") ? console.log("NOTICE deploying to scrollSepolia instead of L1SLOAD, since its down. This breaks bridging of the L1ROOT") : null;
    // await hre.switchNetwork(L2Name);

    // const toadnadoL2ModuleArgs = {denomination: DENOMINATION, merkleTreeHeight: MERKLE_TREE_HEIGHT, l2ScrollMessenger: L2_SCROLL_MESSENGER, l1ToadnadoAddress: toadnadoL1.target as string} // bro i swear typescript is trash
    const toadnadoL2ModuleArgs = {denomination: DENOMINATION, merkleTreeHeight: MERKLE_TREE_HEIGHT, l2ScrollMessenger: L2_SCROLL_MESSENGER, l1ToadnadoAddress: ToadnadoL1}
    // const {toadnadoL2, ultraVerifier: ultraVerifierL2} = await hre.ignition.deploy(
    //     ToadnadoL2Module, 
    //     {parameters: {ToadnadoL2Module: {...toadnadoL2ModuleArgs}},}
    // );
    const {ToadnadoL2, UltraVerifier: ultraVerifierL2} = await deploy("./ignition/modules/ToadnadoL2.ts","ToadnadoL2Module",L2Name,toadnadoL2ModuleArgs);

    console.log(`setting setL2ScrollToadnadoAddress at toadnadoL1: ${ToadnadoL1}`);
    const toadnadoL1Factory = await hre.ethers.getContractFactory("ToadnadoL1");
    const toadnadoL1Contract:any = toadnadoL1Factory.attach(ToadnadoL1)
    //await hre.switchNetwork(L1Name);
    const toadnadoL1s_L2Address = await toadnadoL1Contract.l2ScrollToadnadoAddress() 
    if (toadnadoL1s_L2Address === "0x0000000000000000000000000000000000000000") {
        await (await toadnadoL1Contract.setL2ScrollToadnadoAddress(ToadnadoL2)).wait(1)
    } else if (toadnadoL1s_L2Address !== ToadnadoL2) {
        throw new Error(`toadnadoL1 is already deployed and its L2 counterpart was set to a different address than this script deployed\n expected: ${ToadnadoL2.target} got ${toadnadoL1s_L2Address}`)
    } else {
        console.log("setL2ScrollToadnadoAddress was already set!")
    }
    

    console.log(`verifying contracts on ${L1Name}`)
    const toadnadoL1Verification = hre.run("verify:verify", {address: ToadnadoL1,constructorArguments: [ultraVerifierL1, toadnadoL1ModuleArgs.denomination, toadnadoL1ModuleArgs.merkleTreeHeight ,toadnadoL1ModuleArgs.l1ScrollMessenger]})
    const ultraVerifierL1Verification = hre.run("verify:verify", {address: ultraVerifierL1,constructorArguments: []})
    await Promise.all([toadnadoL1Verification,ultraVerifierL1Verification])

    console.log(`verifying contracts on ${L2Name}`)
    // so switchNetwork is from the package hardhat-switch-network which is hacky af
    // but it does work for verifying contracts, but not with deploying with ignition
    await hre.switchNetwork(L2Name); 
    const toadnadoL2Verification = hre.run("verify:verify", {address: ToadnadoL2,constructorArguments: [ultraVerifierL2, toadnadoL2ModuleArgs.denomination, toadnadoL2ModuleArgs.merkleTreeHeight ,toadnadoL2ModuleArgs.l2ScrollMessenger, toadnadoL2ModuleArgs.l1ToadnadoAddress]})
    const ultraVerifierL2Verification = hre.run("verify:verify", {address: ultraVerifierL2,constructorArguments: []})
    await Promise.all([toadnadoL2Verification,ultraVerifierL2Verification])
}
main()