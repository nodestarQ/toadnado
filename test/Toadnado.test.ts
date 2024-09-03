import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("UltraVerifier", function () {
  it("Should deploy", async function () {
    const UltraVerifier = await hre.ethers.deployContract("UltraVerifier", [], {
      value: 0n,
    });

    // check that it/s deployed with *a* key
    console.log(await UltraVerifier.getVerificationKeyHash())
    expect(await UltraVerifier.getVerificationKeyHash()).to.not.equal("0x0");
  });
});