import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { time, setCode } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import {getWithdrawCalldata} from "../scripts/proofFromCommitments"

const merkleTreeHeight = 5;
const denomination = BigInt((10**18)/100); //0.01eth
const L2SLOADAddress = "0x0000000000000000000000000000000000000101"
const L1RootMappingSlot = 3
const L1CurrentRootIndexSlot = 3
const commitmentLeafsSlot = 1

function getRandom32Bytes() {
  return ethers.hexlify(crypto.getRandomValues(new Uint8Array(new Array(32))))
}

async function deposit(ToadnadoL1:any,L1SLOADmock:any, chainId:any, ToadnadoL2:any) {
  const secret = getRandom32Bytes()
  const nullifierPreimage = getRandom32Bytes()
  const abiCoder = new ethers.AbiCoder()
  const commitmentHash = ethers.keccak256(abiCoder.encode(["bytes32","bytes32","uint256"],[nullifierPreimage,secret, chainId]))
  console.log({commitmentHash})
  const commitmentIndex = await ToadnadoL1.nextIndex()
  const currentRootIndex = (await ToadnadoL1.currentRootIndex()) +1n
  await ToadnadoL1.deposit(commitmentHash, {value: denomination})

  const commitmentLeafsSlotMapping = ethers.keccak256(abiCoder.encode(["uint256","uint256"],[commitmentIndex,commitmentLeafsSlot]))
  await L1SLOADmock.setMockedSlot(ToadnadoL1.target, commitmentLeafsSlotMapping, commitmentHash )
  const latestRoot = await ToadnadoL1.getLastRoot()
  console.log({latestRoot,currentRootIndex})
  console.log(ethers.solidityPacked(["uint256","uint256"],[currentRootIndex,L1RootMappingSlot]),"aaaaaaaaaaaaaaaaaaaaaaaaaaa")
  const L1RootMappingSlotMapping = ethers.keccak256(ethers.solidityPacked(["uint256","uint256"],[currentRootIndex,L1RootMappingSlot]))
  await L1SLOADmock.setMockedSlot(ToadnadoL1.target, L1RootMappingSlotMapping, latestRoot )

  const currentL1RootIndex = await ToadnadoL1.currentRootIndex()
  console.log("setting L1RootIndex",ToadnadoL1.target, ethers.zeroPadValue(ethers.toBeHex(L1CurrentRootIndexSlot),32),  ethers.zeroPadValue(ethers.toBeHex(currentL1RootIndex),32) )
  await L1SLOADmock.setMockedSlot(ToadnadoL1.target, ethers.zeroPadValue(ethers.toBeHex(L1CurrentRootIndexSlot),32),  ethers.zeroPadValue(ethers.toBeHex(currentL1RootIndex),32) )

  const retrievedFromContractDirect = await L1SLOADmock.readMockedSlot(ToadnadoL1.target,L1RootMappingSlotMapping)
  console.log({L1RootMappingSlotMapping, retrievedFromContractDirect})

  return {secret, nullifierPreimage, commitmentHash}
}

describe("UltraVerifier", function () {
  it("Should deploy", async function () {
    const [deployer, alicePublic, alicePrivate] = await ethers.getSigners()

    //deploy L1SLOADmock ---------------------------
    const L1SLOADmockFactory = (await hre.ethers.getContractFactory("L1SLOADmock"));
    // cant use factory for byte code have to get bytecode from deployec contract
    const L1SLOADmockDeployedNormal = await hre.ethers.deployContract("L1SLOADmock",) 
    await setCode(L2SLOADAddress,await hre.ethers.provider.getCode(L1SLOADmockDeployedNormal.target))
    const L1SLOADmock = L1SLOADmockFactory.attach(L2SLOADAddress)
    console.log("L1SLOADmock", L1SLOADmock.target)
    


    const UltraVerifier = await hre.ethers.deployContract("UltraVerifier", [], {
      value: 0n,
    });

    // check that it/s deployed with *a* key
    //console.log(await UltraVerifier.getVerificationKeyHash())
    expect(await UltraVerifier.getVerificationKeyHash()).to.not.equal("0x0");
    //------------------
    const ToadnadoL1 = await hre.ethers.deployContract("ToadnadoL1", [UltraVerifier.target, denomination, merkleTreeHeight], {
      value: 0n,
    });
    const ToadnadoL2 = await hre.ethers.deployContract("ToadnadoL2", [ToadnadoL1.target,UltraVerifier.target, denomination, merkleTreeHeight], {
      value: 0n,
    });
    //console.log("l1mocksetattoadnado", await ToadnadoL2.L1_SLOAD_ADDRESS())
    console.log("ToadnadoL1", ToadnadoL1.target)

    //TODO do this with a bridge transanction
    await deployer.sendTransaction({
      to: ToadnadoL2.target,
      value:denomination*5n,
    });


    // await L1SLOADmock.setMockedSlot("0x0000000000000000000000000000000000000001", 1n, "0x0123" )
    // const value = await L1SLOADmock.readMockedSlot("0x0000000000000000000000000000000000000001", 1n)
    // expect( value).to.equal("0x0123")
    const chainId = (await hre.ethers.provider.getNetwork()).chainId
    const  {secret, nullifierPreimage, commitmentHash} = await deposit(ToadnadoL1,L1SLOADmock,chainId, ToadnadoL2)

    const depositEventFilter = ToadnadoL1.filters.Deposit()
    const L1events = await ToadnadoL1.queryFilter(depositEventFilter, 0, "latest")
    const commitmentsL1 = L1events.map((event) => event.topics[1])
    const L2events = await ToadnadoL2.queryFilter(depositEventFilter, 0, "latest")
    const commitmentsL2 = L2events.map((event) => event.topics[1])

    const commitmentIndex = commitmentsL1.findIndex((leaf)=>leaf===commitmentHash)

    const {
      l1Root,
      l2Root, 
      nullifierHash, 
      recipient, 
      snarkProof,
      publicInputs
    } = await getWithdrawCalldata(alicePrivate.address,secret,nullifierPreimage,chainId,commitmentIndex,commitmentsL1,commitmentsL2,true)
    const verifiedOnchain = await UltraVerifier.verify(snarkProof, publicInputs)
    console.log({verifiedOnchain})
    const L1Root = await ToadnadoL2.getL1Root(1n);
    console.log({L1Root})
    await ToadnadoL2.withdraw(l1Root,l2Root,nullifierHash,recipient,snarkProof)
 

  });


});