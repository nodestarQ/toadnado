import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { time, setCode } from "@nomicfoundation/hardhat-toolbox/network-helpers";

const merkleTreeHeight = 5;
const denomination = BigInt((10**18)/100); //0.01eth
const L2SLOADAddress = "0x0000000000000000000000000000000000000101"

describe("UltraVerifier", function () {
  it("Should deploy", async function () {
    const UltraVerifier = await hre.ethers.deployContract("UltraVerifier", [], {
      value: 0n,
    });

    // check that it/s deployed with *a* key
    console.log(await UltraVerifier.getVerificationKeyHash())
    expect(await UltraVerifier.getVerificationKeyHash()).to.not.equal("0x0");
    //------------------
    const ToadnadoL1 = await hre.ethers.deployContract("ToadnadoL1", [UltraVerifier.target, denomination, merkleTreeHeight], {
      value: 0n,
    });

    //deploy L2SLOADmock ---------------------------
    const L2SLOADmockFactory = (await hre.ethers.getContractFactory("L2SLOADmock"));
    // cant use factory for byte code have to get bytecode from deployec contract
    const L2SLOADmockDeployedNormal = await hre.ethers.deployContract("L2SLOADmock",) 
    await setCode(L2SLOADAddress,await hre.ethers.provider.getCode(L2SLOADmockDeployedNormal.target))
    const L2SLOADmock = L2SLOADmockFactory.attach(L2SLOADAddress)


    await L2SLOADmock.setMockedSlot("0x0000000000000000000000000000000000000001", 1n, "0x0123" )
    const value = await L2SLOADmock.readMockedSlot("0x0000000000000000000000000000000000000001", 1n)
    expect( value).to.equal("0x0123")


  });


});