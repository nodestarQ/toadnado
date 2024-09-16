import { expect } from "chai";
import hre from "hardhat";
import { time, setCode } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { getWithdrawCalldata } from "../scripts/proofFromCommitments"
import { ethers } from "ethers";

const MERKLE_TREE_HEIGHT = 5n;
const DENOMINATION = BigInt((10 ** 18) / 100); //0.01eth


//https://docs.scroll.io/en/developers/scroll-contracts/#scroll-contracts
const IS_MAINNET = true
const L1_SLOAD_ADDRESS = "0x0000000000000000000000000000000000000101"
const L1_SCROLL_MESSENGER: ethers.AddressLike = IS_MAINNET ? "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367" : "0x50c7d3e7f7c656493D1D76aaa1a836CedfCBB16A"
const L2_SCROLL_MESSENGER: ethers.AddressLike =  IS_MAINNET ? "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC" : "0xBa50f5340FB9F3Bd074bD638c9BE13eCB36E603d"

const L1_ROOT_MAPPING_SLOT = 3n
const L1_CURRENT_ROOT_INDEX_SLOT = 3n
const BENCH_MARK_GAS_PRICE = "0x12A05F200" // 5 gwei

function getRandom32Bytes() {
  return ethers.hexlify(crypto.getRandomValues(new Uint8Array(new Array(32))))
}

async function deposit(Toadnado: any, L1SLOADmock: any, chainId: any) {
  //generate secrets
  const secret = getRandom32Bytes()
  const nullifierPreimage = getRandom32Bytes()

  // hash
  const abiCoder = new ethers.AbiCoder()
  const commitmentHashPreimg = abiCoder.encode(["bytes32", "bytes32", "uint256"], [nullifierPreimage, secret, chainId])
  const commitmentHash = ethers.keccak256(commitmentHashPreimg)

  // do deposit
  await  hre.ethers.provider.send("hardhat_setNextBlockBaseFeePerGas", [BENCH_MARK_GAS_PRICE]) 
  const tx = await (await Toadnado.deposit(commitmentHash, { value: DENOMINATION })).wait(1)

  // "bridge" currentRootIndex to L1SLOADmock
  // note this also happens when using ToadnadoL2 and that should not happen. But doest matter for now since we never ask L1SLOAD for that contract anyway
  const currentL1RootIndex = await Toadnado.currentRootIndex()
  await L1SLOADmock.setMockedSlot(Toadnado.target, L1_CURRENT_ROOT_INDEX_SLOT, ethers.zeroPadValue(ethers.toBeHex(currentL1RootIndex), 32))


  // "bridge" new root to L1SLOADmock
  const latestRoot = await Toadnado.getLastRoot()
  const L1RootMappingSlotMapping = ethers.keccak256(ethers.solidityPacked(["uint256", "uint256"], [currentL1RootIndex, L1_ROOT_MAPPING_SLOT]))
  await L1SLOADmock.setMockedSlot(Toadnado.target, L1RootMappingSlotMapping, latestRoot)
  await  hre.ethers.provider.send("hardhat_setNextBlockBaseFeePerGas", [BENCH_MARK_GAS_PRICE]) 

  return { secret, nullifierPreimage, commitmentHash, tx }
}

async function setBalance(wallet: ethers.AddressLike | string, balance: string) {
  await hre.ethers.provider.send("hardhat_setBalance", [
    wallet,
    "0x"+ethers.parseEther(balance).toString(16)//ethers.parseEther(balance).toString(),
  ]);
}

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
    
    //reset balances
    await Promise.all([deployer, alicePublic, alicePrivate].map(async (wallet:any)=> setBalance(wallet.address, "1000")));
    await Promise.all([L1_SCROLL_MESSENGER, L2_SCROLL_MESSENGER].map(async (wallet:any)=> setBalance(wallet, "0")));

    //deploy bridge contract mocks ---------------------------
    const L1SLOADmock = await deployToAddress("L1SLOADmock", L1_SLOAD_ADDRESS)
    
    const L1ScrollMessengerMock = await deployToAddress("scrollMessengerMock",L1_SCROLL_MESSENGER)
    const L2ScrollMessengerMock = await deployToAddress("scrollMessengerMock",L2_SCROLL_MESSENGER)
    await L2ScrollMessengerMock.setOtherMessenger(L1_SCROLL_MESSENGER) // need to set it here because state doesnt copy over
    await L1ScrollMessengerMock.setOtherMessenger(L2_SCROLL_MESSENGER) // need to set it here because state doesnt copy over

    // deploy verifier
    const UltraVerifier = await hre.ethers.deployContract("UltraVerifier", [], { value: 0n });
    console.log("UltraVerifier deployed at", UltraVerifier.target)

    // check that it/s deployed with *a* key
    expect(await UltraVerifier.getVerificationKeyHash()).to.not.equal("0x0");

    // deploy the toads
    const ToadnadoL1 = await hre.ethers.deployContract("ToadnadoL1", [UltraVerifier.target, DENOMINATION, MERKLE_TREE_HEIGHT, L1_SCROLL_MESSENGER], { value: 0n });
    const ToadnadoL2 = await hre.ethers.deployContract("ToadnadoL2", [UltraVerifier.target, DENOMINATION, MERKLE_TREE_HEIGHT, L2_SCROLL_MESSENGER, ToadnadoL1.target], { value: 0n });
    await ToadnadoL1.setL2ScrollToadnadoAddress(ToadnadoL1.target);
    console.log("ToadnadoL1 deployed at:", ToadnadoL1.target)
    console.log("ToadnadoL2 deployed at:", ToadnadoL2.target)

    // connect alices public wallet
    const ToadnadoL1AlicePublic = ToadnadoL1.connect(alicePublic)

    // deposit
    const chainId = (await hre.ethers.provider.getNetwork()).chainId
    const balanceBeforeDeposit = await hre.ethers.provider.getBalance(alicePublic.address)
    const { secret, nullifierPreimage, commitmentHash, tx:depositTx } = await deposit(ToadnadoL1AlicePublic, L1SLOADmock, chainId)
    const balanceAfterDeposit = await hre.ethers.provider.getBalance(alicePublic.address)
    console.log({depositTxFee: ethers.formatEther(depositTx?.fee), depositTxGas: depositTx?.gasUsed,  gasPriceGwei: Number(depositTx?.gasPrice) / 1000000000})
    expect(balanceAfterDeposit).to.eq(balanceBeforeDeposit - DENOMINATION - depositTx.fee)

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
    
    // verify of chain (sanity check)
    const verifiedOnchain = await UltraVerifier.verify(snarkProof, publicInputs)
    console.log({ verifiedOnchain })

    // finally withdraw
    const balanceBeforeWithdraw = await hre.ethers.provider.getBalance(alicePrivate.address)
    await  hre.ethers.provider.send("hardhat_setNextBlockBaseFeePerGas", [BENCH_MARK_GAS_PRICE]) 

    const withdrawTx = await (await ToadnadoL2AlicePrivate.withdraw(l1Root, l2Root, nullifierHash, recipient, snarkProof)).wait(1);
    console.log({withdrawTxFee: ethers.formatEther(withdrawTx?.fee), withdrawTxGas: withdrawTx?.gasUsed,  gasPriceGwei: Number(withdrawTx?.gasPrice) / 1000000000})


    // bridge eth over from L1
    // dev said 1000000n was enough for gas limit  https://docs.scroll.io/en/developers/guides/scroll-messenger-cross-chain-interaction/#calling-a-cross-chain-function
    const nullifiers = [nullifierHash]
    const bridgeAmount = DENOMINATION*BigInt(nullifiers.length)
    await ToadnadoL1.bridgeEth(bridgeAmount, 1000000n, nullifiers)
    const L2ScrollMessengerMockBalance = await hre.ethers.provider.getBalance(L2ScrollMessengerMock.target)
    expect(L2ScrollMessengerMockBalance).to.eq(DENOMINATION, "ToadnadoL1.bridgeEth didnt bridge over DENOMINATION to the L2 messenger")
    
    // relay message on L2
    const [,,message,] = await L1ScrollMessengerMock.getLastMessage() // ignore this, this normally would be the api call the proof and shit https://docs.scroll.io/en/developers/guides/scroll-messenger-cross-chain-interaction/#relay-the-message-when-sending-from-l2-to-l1
    await L2ScrollMessengerMock.relayMessageWithProof(ToadnadoL1.target,ToadnadoL2.target, DENOMINATION, 0n, message, [0n,"0x00"]) // also ignore red squiggles idk typescript :/
    const balanceAfterWithdraw = await hre.ethers.provider.getBalance(alicePrivate.address)


    expect(balanceAfterWithdraw).to.eq(balanceBeforeWithdraw + DENOMINATION - withdrawTx?.fee)
  });


});