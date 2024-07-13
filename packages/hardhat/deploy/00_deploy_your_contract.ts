import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";



const merkleTreeHeight = 5;
const denomination = BigInt((10**18)/100); //0.01eth
let l1Address = "0x403F9ADd4272c24cf27DC3A5454aEE95B1DD9904";
let l2Address = "";

/*
1. deploy Plonk on L1
2. Deploy L1 SC -> add Plonk addy as verifier addy
3. Deploy Plonk on L2
4. Deploy L2 SC -> add plonk add as verifier and add l1 addy as L1sload target
*/

const deployL1: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const UltraVerifier = await deploy("UltraVerifier", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const ultraVerifier = await hre.ethers.getContract<Contract>("UltraVerifier", deployer);
  let verifierL1 = await ultraVerifier.getAddress();

  await deploy("ToadnadoL1", {
    from: deployer,
    // Contract constructor arguments
    args: [verifierL1, denomination, merkleTreeHeight],
    log: true,
    autoMine: true,
  });

  const toadnadoL1 = await hre.ethers.getContract<Contract>("ToadnadoL1", deployer);
  console.log("ToadnadoL1 Address: "+ await toadnadoL1.getAddress())
};

const deployL2: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const UltraVerifier = await deploy("UltraVerifier", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const ultraVerifier = await hre.ethers.getContract<Contract>("UltraVerifier", deployer);
  let verifierL2 = await ultraVerifier.getAddress();

  await deploy("ToadnadoL2", {
    from: deployer,
    args: [l1Address],
    log: true,
    autoMine: true,
  });
  
};

export default deployL1;
//export default  deployL2;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployL1.tags = ["L1"];
deployL2.tags = ["L2"];
