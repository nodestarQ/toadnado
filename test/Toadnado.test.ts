import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { time, setCode } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { getWithdrawCalldata } from "../scripts/proofFromCommitments"

const MERKLE_TREE_HEIGHT = 5n;
const DENOMINATION = BigInt((10 ** 18) / 100); //0.01eth
const L1SLOAD_ADDRESS = "0x0000000000000000000000000000000000000101"
const L1_ROOT_MAPPING_SLOT = 3n
const L1_CURRENT_ROOT_INDEX_SLOT = 3n
const BENCH_MARK_GAS_PRICE = "0x12A05F200" // 5 gwei

function getRandom32Bytes() {
  return ethers.hexlify(crypto.getRandomValues(new Uint8Array(new Array(32))))
}
ethers
async function depositL1(ToadnadoL1: any, L1SLOADmock: any, chainId: any) {
  //generate secrets
  const secret = getRandom32Bytes()
  const nullifierPreimage = getRandom32Bytes()

  // hash
  const abiCoder = new ethers.AbiCoder()
  const commitmentHashPreimg = abiCoder.encode(["bytes32", "bytes32", "uint256"], [nullifierPreimage, secret, chainId])
  const commitmentHash = ethers.keccak256(commitmentHashPreimg)

  // do deposit
  await  hre.ethers.provider.send("hardhat_setNextBlockBaseFeePerGas", [BENCH_MARK_GAS_PRICE]) 
  const tx = await ToadnadoL1.deposit(commitmentHash, { value: DENOMINATION })

  // "bridge" currentRootIndex to L1SLOADmock
  const currentL1RootIndex = await ToadnadoL1.currentRootIndex()
  await L1SLOADmock.setMockedSlot(ToadnadoL1.target, L1_CURRENT_ROOT_INDEX_SLOT, ethers.zeroPadValue(ethers.toBeHex(currentL1RootIndex), 32))


  // "bridge" new root to L1SLOADmock
  const latestRoot = await ToadnadoL1.getLastRoot()
  const L1RootMappingSlotMapping = ethers.keccak256(ethers.solidityPacked(["uint256", "uint256"], [currentL1RootIndex, L1_ROOT_MAPPING_SLOT]))
  await L1SLOADmock.setMockedSlot(ToadnadoL1.target, L1RootMappingSlotMapping, latestRoot)
  await  hre.ethers.provider.send("hardhat_setNextBlockBaseFeePerGas", [BENCH_MARK_GAS_PRICE]) 

  return { secret, nullifierPreimage, commitmentHash, tx }
}

describe("Toadnado", function () {
  it("deposit L1 withdraw L2", async function () {
    const [deployer, alicePublic, alicePrivate] = await ethers.getSigners()

    //deploy L1SLOADmock ---------------------------
    const L1SLOADmockFactory = (await hre.ethers.getContractFactory("L1SLOADmock"));
    const L1SLOADmockDeployedNormal = await hre.ethers.deployContract("L1SLOADmock") // cant use factory for byte code have to get bytecode from deployed contract
    await setCode(L1SLOAD_ADDRESS, await hre.ethers.provider.getCode(L1SLOADmockDeployedNormal.target))
    const L1SLOADmock = L1SLOADmockFactory.attach(L1SLOAD_ADDRESS)
    console.log("L1SLOADmock deployed at", L1SLOADmock.target)

    // deploy verifier
    const UltraVerifier = await hre.ethers.deployContract("UltraVerifier", [], { value: 0n });
    console.log("UltraVerifier deployed at", UltraVerifier.target)

    // check that it/s deployed with *a* key
    //console.log(await UltraVerifier.getVerificationKeyHash())
    expect(await UltraVerifier.getVerificationKeyHash()).to.not.equal("0x0");

    // deploy the toads
    const ToadnadoL1 = await hre.ethers.deployContract("ToadnadoL1", [UltraVerifier.target, DENOMINATION, MERKLE_TREE_HEIGHT], { value: 0n });
    console.log("ToadnadoL1 deployed at:", ToadnadoL1.target)
    let ToadnadoL2 = await hre.ethers.deployContract("ToadnadoL2", [ToadnadoL1.target, UltraVerifier.target, DENOMINATION, MERKLE_TREE_HEIGHT], { value: 0n });
    console.log("ToadnadoL2 deployed at:", ToadnadoL2.target)

    // connect alices public wallet
    const ToadnadoL1AlicePublic = ToadnadoL1.connect(alicePublic)

    // deposit
    const chainId = (await hre.ethers.provider.getNetwork()).chainId
    const balanceBeforeDeposit = await hre.ethers.provider.getBalance(alicePublic.address)
    const { secret, nullifierPreimage, commitmentHash, tx:depositTx } = await depositL1(ToadnadoL1AlicePublic, L1SLOADmock, chainId)
    const balanceAfterDeposit = await hre.ethers.provider.getBalance(alicePublic.address)
    const depositTxConfirmed = (await depositTx.wait(1))
    console.log({depositTxFee: ethers.formatEther(depositTxConfirmed?.fee), depositTxGas: depositTxConfirmed?.gasUsed,  gasPriceGwei: Number(depositTxConfirmed?.gasPrice) / 1000000000})
    expect(balanceAfterDeposit).to.eq(balanceBeforeDeposit - DENOMINATION - depositTxConfirmed.fee)

    // pretend we just bridged eth from L1->L2
    //TODO do this with a bridge transanction
    await deployer.sendTransaction({
      to: ToadnadoL2.target,
      value: DENOMINATION,
    });

    // event scanning to get the leaves of the merkle trees
    const depositEventFilter = ToadnadoL1.filters.Deposit()
    const L1events = await ToadnadoL1.queryFilter(depositEventFilter, 0, "latest")
    const L2events = await ToadnadoL2.queryFilter(depositEventFilter, 0, "latest")
    const commitmentsL1 = L1events.map((event) => event.topics[1])
    const commitmentsL2 = L2events.map((event) => event.topics[1])

    // get the index of our commitment
    const commitmentIndex = commitmentsL1.findIndex((leaf) => leaf === commitmentHash)

    // alice now switches to her private wallet
    const ToadnadoL2AlicePrivate = ToadnadoL2.connect(alicePrivate)

    // calculate the snarkproof and process the data
    const {
      l1Root,
      l2Root,
      nullifierHash,
      recipient,
      snarkProof,
      publicInputs
    } = await getWithdrawCalldata(alicePrivate.address, secret, nullifierPreimage, chainId, commitmentIndex, commitmentsL1, commitmentsL2, true)
    const verifiedOnchain = await UltraVerifier.verify(snarkProof, publicInputs)
    console.log({ verifiedOnchain })

    // finally withdraw
    const balanceBeforeWithdraw = await hre.ethers.provider.getBalance(alicePrivate.address)
    await  hre.ethers.provider.send("hardhat_setNextBlockBaseFeePerGas", [BENCH_MARK_GAS_PRICE]) 
    const withdrawTx = await ToadnadoL2AlicePrivate.withdraw(l1Root, l2Root, nullifierHash, recipient, snarkProof);
    const withdrawTxConfirmed = (await withdrawTx.wait(1))
    const balanceAfterWithdraw = await hre.ethers.provider.getBalance(alicePrivate.address)
    console.log({withdrawTxFee: ethers.formatEther(withdrawTxConfirmed?.fee), withdrawTxGas: withdrawTxConfirmed?.gasUsed,  gasPriceGwei: Number(withdrawTxConfirmed?.gasPrice) / 1000000000})
    expect(balanceAfterWithdraw).to.eq(balanceBeforeWithdraw + DENOMINATION - withdrawTxConfirmed?.fee)
  });


});