// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./Toadnado.sol";
import "hardhat/console.sol";

contract ToadnadoL2 is Toadnado {
  event Withdrawal(address recipient, bytes32 nullifier);

  constructor(
    address _l1Address,
    address _verifier,
    uint256 _denomination,
    uint32 _merkleTreeHeight
  ) Toadnado(_verifier, _denomination, _merkleTreeHeight){
    l1Address = _l1Address;
  }

  function _processDeposit() internal override {
    require(msg.value == denomination, "Please send `mixDenomination` ETH along with transaction");
  }

  function _processWithdraw(
    address payable _recipient
  ) internal override{
    require(msg.value == 0, "Message value is supposed to be zero for ETH instance");
    _recipient.transfer(denomination);
    //require(success, "payment to _recipient did not go thru");
  }

  function withdraw(
      bytes32 _l1root,
      bytes32 _l2root,
      bytes32 _nullifier,
      address payable _recipient, 
      bytes calldata snarkProof
      ) external payable nonReentrant  {

      //disable withdraw on "L1"
      uint256 chainid =block.chainid;
      console.logBytes32(bytes32(chainid));
      console.logString("1");
      require(chainid!=11155111, "withdrawal only allowed on L2");
      require(!nullifiers[_nullifier], "The note has been already spent");
      console.logString("12");
      require(isKnownRoot(_l2root), "Cannot find your l2 merkle root"); // Make sure to use a recent one + also pick the L2 Root
      console.logString("13");
      require(isKnownL1Root(_l1root), "Cannot find your l1 merkle root"); // Make sure to use a recent one + also pick the L2 Root
      console.logString("14");
      bytes32 metaRoot = keccak256(abi.encodePacked(_l1root,_l2root));
        console.logString("2");
      bytes32[] memory publicInputs = _formatPublicInputs(metaRoot, _nullifier, _recipient, chainid);
        console.logString("3");
      console.logString("chainId in formatted public inputs:");
      console.logBytes32(publicInputs[65]);
      if (!IVerifier(verifier).verify(snarkProof, publicInputs)) {
          revert VerificationFailed();
      }
      console.logString("chainId in formatted public inputs:");
      nullifiers[_nullifier] = true;
      console.logString("chainId in formatted public inputs:");
      _processWithdraw(_recipient);
      console.logString("chainId in formatted public inputs:");
      emit Withdrawal(_recipient, _nullifier);
      console.logString("chainId in formatted public inputs:");
  }
  
//get all roots from L1
//get all roots from L2 
//return 2d array in return value 

mapping (uint256=>bytes32) l1Roots;
uint32 public l1_currentRootIndex = 0;

address public l1Address;

//get current root of L1


address public L1_SLOAD_ADDRESS = 0x0000000000000000000000000000000000000101;

    function readSingleSlot(address l1_contract, uint256 slot) public view returns (bytes memory) {
      console.logString("readSingleSlot slot:");
      console.logUint(slot);

        bytes memory input = abi.encodePacked(l1_contract, slot);

        bool success;
        bytes memory result;

        (success, result) = L1_SLOAD_ADDRESS.staticcall(input);
        //result = IL1SLOADmock(L1_SLOAD_ADDRESS).fallback(input);
        if (!success) {
            revert("L1SLOAD failed");
        }

        return result;

    }

    // 
    function getL1Root(uint256 key) public view returns(bytes32) {
      console.logString("getL1Root 1");
        uint slotNumber = 3; //slot for L1 Root mapping
        return abi.decode(readSingleSlot(
            l1Address,
            uint(keccak256(
                abi.encodePacked(key,slotNumber)
                )
            )
            ), (bytes32));
    }

    function getL1LeafCommitments(uint256 key) public view returns(bytes32){
        uint slotNumber = 1; //slot for L1 commitmentLeafs
        return abi.decode(readSingleSlot(
            l1Address,
            uint(keccak256(
                abi.encodePacked(key,slotNumber)
                )
            )
            ), (bytes32));
      
    }

    function isKnownL1Root(bytes32 _root) public view returns (bool) {
    uint slotNumber = 3; //slot for currentRootIndex
    if (_root == 0) {
      return false;
    }
    console.logString("isKnownL1Root 1");
    uint32 _currentRootIndex = abi.decode(readSingleSlot(l1Address,slotNumber),(uint32));
    console.logUint(_currentRootIndex);
    console.logString("isKnownL1Root 2");
    uint32 i = _currentRootIndex;
    do {
      console.logString("isKnownL1Root 3");
      if (_root == getL1Root(i)) {
        return true;
      }
      if (i == 0) {
        i = ROOT_HISTORY_SIZE;
      }
      i--;
    } while (i != _currentRootIndex);
    console.logString("isKnownL1Root 5");
    return false;
  }

  function getAllCommitments() public view returns(bytes32[] memory,bytes32[] memory){

    uint32 l1NextId = 32;
    bytes32[] memory layer1 = new bytes32[](l1NextId);
    bytes32[] memory layer2 = new bytes32[](nextIndex);

    for (uint32 i = 0; i < nextIndex; i++) {
      layer2[i] = commitmentLeafs[i];
    }

    //workaround for out of index array
    for (uint32 i = 0; i < l1NextId; i++) {
      if(getL1LeafCommitments(i) == 0x0000000000000000000000000000000000000000000000000000000000000000){
        break;
      }
      layer1[i] = getL1LeafCommitments(i);
    }
  
    return (layer1,layer2);
  }

    
}