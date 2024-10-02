import { expect } from "chai";
import hre from "hardhat";
import { time, setCode } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { getWithdrawCalldata , hashCommitment, getAllCommitments, randomWithinFieldLimit,hashPreCommitment} from "../scripts/proofFromCommitments"
import { ethers } from "ethers";

import { ToadnadoL1,ToadnadoL2,L1SLOADmock, ScrollMessengerMock  } from "../typechain-types";

const MERKLE_TREE_HEIGHT = 5n;

//https://docs.scroll.io/en/developers/scroll-contracts/#scroll-contracts
const IS_MAINNET = true
const L1_SLOAD_ADDRESS = "0x0000000000000000000000000000000000000101"
const L1_SCROLL_MESSENGER: ethers.AddressLike = IS_MAINNET ? "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367" : "0x50c7d3e7f7c656493D1D76aaa1a836CedfCBB16A"
const L2_SCROLL_MESSENGER: ethers.AddressLike =  IS_MAINNET ? "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC" : "0xBa50f5340FB9F3Bd074bD638c9BE13eCB36E603d"

const L1_ROOT_MAPPING_SLOT = 3n
const L1_CURRENT_ROOT_INDEX_SLOT = 3n
const BENCH_MARK_GAS_PRICE = "0x12A05F200" // 5 gwei

async function deployPoseidon() {

  const Poseidon = await hre.ethers.getContractFactory(`PoseidonT3`)
  const _poseidon = await Poseidon.deploy()
  return _poseidon
}
// deposits and also updates state in the L1SLOADmock
async function deposit(Toadnado: ToadnadoL1, L1SLOADmock: L1SLOADmock, chainId: bigint, bridgeAmount:bigint) {
  //generate secrets
  const secret = BigInt("0x16b328d0f5bf0e54821aa99bc48be7db5e6d2f58ea2e50f47cf4ee6403dd4a59") //randomWithinFieldLimit()
  const nullifierPreimage = BigInt("0x2946f2ea22e64f0a2e6ad55e72db98d52ab7c18657e87c42133546937fb90478")//randomWithinFieldLimit()

  // hash
  const preCommitmentHash = hashPreCommitment(nullifierPreimage, secret, chainId)
  const commitmentHash = hashCommitment(preCommitmentHash, bridgeAmount)

  // do deposit
  await  hre.ethers.provider.send("hardhat_setNextBlockBaseFeePerGas", [BENCH_MARK_GAS_PRICE]) 
  const tx = await (await Toadnado.deposit(preCommitmentHash, { value: bridgeAmount })).wait(1)

  // "bridge" currentRootIndex to L1SLOADmock
  // note this also happens when using ToadnadoL2 and that should not happen. But doest matter for now since we never ask L1SLOAD for that contract anyway
  const currentL1RootIndex = await Toadnado.currentRootIndex()
  await L1SLOADmock.setMockedSlot(Toadnado.target, L1_CURRENT_ROOT_INDEX_SLOT, ethers.zeroPadValue(ethers.toBeHex(currentL1RootIndex), 32))


  // "bridge" new root to L1SLOADmock
  const latestRoot = await Toadnado.getLastRoot()
  const L1RootMappingSlotMapping = ethers.keccak256(ethers.solidityPacked(["uint256", "uint256"], [currentL1RootIndex, L1_ROOT_MAPPING_SLOT])) as ethers.BigNumberish
  await L1SLOADmock.setMockedSlot(Toadnado.target as ethers.AddressLike, L1RootMappingSlotMapping, ethers.toBeHex(latestRoot) )
  await  hre.ethers.provider.send("hardhat_setNextBlockBaseFeePerGas", [BENCH_MARK_GAS_PRICE]) 

  return { secret, nullifierPreimage, commitmentHash,preCommitmentHash, tx }
}

// For the mock contracts to deploy to a specific address
async function deployToAddress(contractName: string, address: string ) {
  const factory = (await hre.ethers.getContractFactory(contractName));
  const normalDeployment = await hre.ethers.deployContract(contractName) // cant use factory for byte code have to get bytecode from deployed contract
  await setCode(address, await hre.ethers.provider.getCode(normalDeployment.target))
  const deploymentAtAddress = factory.attach(address)
  console.log(`${contractName} deployed at ${deploymentAtAddress.target}`)
  return deploymentAtAddress
}

describe("Toadnado", function () {
  it("deposit L1 withdraw L2", async function () {
    const [deployer, alicePublic, alicePrivate] = await hre.ethers.getSigners();
    
    // reset balances and state
    await hre.network.provider.send("hardhat_reset")

    // deploy bridge contract mocks ---------------------------
    const L1SLOADmock = await deployToAddress("L1SLOADmock", L1_SLOAD_ADDRESS) as L1SLOADmock
    
    const L1ScrollMessengerMock:any = await deployToAddress("scrollMessengerMock",L1_SCROLL_MESSENGER) as ScrollMessengerMock
    const L2ScrollMessengerMock:any = await deployToAddress("scrollMessengerMock",L2_SCROLL_MESSENGER) as ScrollMessengerMock
    await L2ScrollMessengerMock.setOtherMessenger(L1_SCROLL_MESSENGER) // need to set it here because state doesnt copy over
    await L1ScrollMessengerMock.setOtherMessenger(L2_SCROLL_MESSENGER) // need to set it here because state doesnt copy over
    // --------------------------------------------------------

    // deploy toads -------------------------------------------
    // deploy verifier
    const deployedPoseidonT3 = await deployPoseidon()

    const UltraVerifier = await hre.ethers.deployContract("UltraVerifier", [], { value: 0n });
    console.log("UltraVerifier deployed at", UltraVerifier.target)

    // check that it/s deployed with *a* key
    expect(await UltraVerifier.getVerificationKeyHash()).to.not.equal("0x0");

    // deploy the toads
    const ToadnadoL1 = await hre.ethers.deployContract("ToadnadoL1", [UltraVerifier.target, MERKLE_TREE_HEIGHT, L1_SCROLL_MESSENGER], { value: 0n, libraries: { PoseidonT3: deployedPoseidonT3.target,} });
    const ToadnadoL2 = await hre.ethers.deployContract("ToadnadoL2", [UltraVerifier.target, MERKLE_TREE_HEIGHT, L2_SCROLL_MESSENGER, ToadnadoL1.target], { value: 0n, libraries: { PoseidonT3: deployedPoseidonT3.target,} });
    
    await ToadnadoL1.setL2ScrollToadnadoAddress(ToadnadoL2.target);
    console.log("ToadnadoL1 deployed at:", ToadnadoL1.target)
    console.log("ToadnadoL2 deployed at:", ToadnadoL2.target)
    // --------------------------------------------------------


    // deposit -----------------------------------------------
    // connect alices public wallet
    const ToadnadoL1AlicePublic = ToadnadoL1.connect(alicePublic)
    const bridgeAmount = BigInt((1 / 100) * 10**18); //0.01eth

    const chainId = (await hre.ethers.provider.getNetwork()).chainId
    const balanceBeforeDeposit = await hre.ethers.provider.getBalance(alicePublic.address)
    const { secret, nullifierPreimage, preCommitmentHash,commitmentHash, tx:depositTx,  } = await deposit(ToadnadoL1AlicePublic, L1SLOADmock, chainId, bridgeAmount)
    const balanceAfterDeposit = await hre.ethers.provider.getBalance(alicePublic.address)
    expect(balanceAfterDeposit).to.eq(balanceBeforeDeposit - bridgeAmount - depositTx!.fee)

    // event scanning to get the leaves of the merkle trees
    const {commitmentsL1, commitmentsL2} = await getAllCommitments(ToadnadoL1, ToadnadoL2)
    const commitmentIndex = commitmentsL1.findIndex((leaf) => ethers.toBigInt(leaf) === commitmentHash)


    // withdraw ----------------------------------------------
    // alice now switches to her private wallet'
    const ToadnadoL2AlicePrivate = ToadnadoL2.connect(alicePrivate)

    // calculate the snarkproof and process the data
    const {
      l1Root,
      l2Root,
      nullifierHash,
      recipient,
      snarkProof,
      publicInputs
    } = await getWithdrawCalldata(alicePrivate.address, secret, nullifierPreimage, chainId, bridgeAmount, commitmentIndex, commitmentsL1, commitmentsL2, true)
    // verify of chain (sanity check)
    const verifiedOnchain = await UltraVerifier.verify(snarkProof, publicInputs)
    console.log({ verifiedOnchain })

    //try withdraw
    const withdrawTx = await (await ToadnadoL2AlicePrivate.withdraw(l1Root, l2Root, nullifierHash, recipient, bridgeAmount, snarkProof)).wait(1);

    // it went pending so we need to bridge
    // request bridgeIng tx
    // dev said 1000000n was enough for gas limit  https://docs.scroll.io/en/developers/guides/scroll-messenger-cross-chain-interaction/#calling-a-cross-chain-function
    await ToadnadoL2.requestEthBridge(1000000n)
    
    // bridge the request on L2
    let [,,message,] = await L2ScrollMessengerMock.getLastMessage() // ignore this, this normally would be the api call the proof and shit https://docs.scroll.io/en/developers/guides/scroll-messenger-cross-chain-interaction/#relay-the-message-when-sending-from-l2-to-l1
    await L1ScrollMessengerMock.relayMessageWithProof(ToadnadoL2.target,ToadnadoL1.target, 0n, 0n, message, [0n,"0x00"]); // also ignore red squiggles idk typescript :/

    // now Toadnado on L2 called `bridgeEth()` on the L1 contract and eth is now in the L2ScrollMessengerMock
    // so we check that the eth is indeed there ready to fund the L2 contract 
    const L2ScrollMessengerMockBalance = await hre.ethers.provider.getBalance(L2ScrollMessengerMock.target);
    expect(L2ScrollMessengerMockBalance).to.eq(bridgeAmount, "ToadnadoL1.bridgeEth didnt bridge over DENOMINATION to the L2 messenger");

    // now we relay the message and finally put the eth on L2
    [,,message,] = await L1ScrollMessengerMock.getLastMessage(); // ignore this, this normally would be the api call the proof and shit https://docs.scroll.io/en/developers/guides/scroll-messenger-cross-chain-interaction/#relay-the-message-when-sending-from-l2-to-l1
    await L2ScrollMessengerMock.relayMessageWithProof(ToadnadoL1.target,ToadnadoL2.target, bridgeAmount, 0n, message, [0n,"0x00"]) // also ignore red squiggles idk typescript :/
    //claim pending withdraw
    const balanceBeforeWithdraw = await hre.ethers.provider.getBalance(alicePrivate.address)
    const withdrawPendingTx = await (await ToadnadoL2AlicePrivate.withdrawPending(nullifierHash)).wait(1)

    // check balance
    const balanceAfterWithdraw = await hre.ethers.provider.getBalance(alicePrivate.address)
    expect(balanceAfterWithdraw).to.eq(balanceBeforeWithdraw + bridgeAmount - withdrawPendingTx!.fee)
    // --------------------------------------------------------
  });


});