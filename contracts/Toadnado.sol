// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./MerkleTree.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IVerifier {
    function verify(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) external view returns (bool);
}
error VerificationFailed();

abstract contract Toadnado is MerkleTree, ReentrancyGuard{
  //IVerifier public immutable verifier;
  uint256 public denomination;

    constructor(
        address _verifier, 
        uint256 _denomination,
        uint32 _merkleTreeHeight 
        ) MerkleTree(_merkleTreeHeight) {
        require(_denomination > 0, "denomination should be greater than 0");
        verifier = _verifier;
        denomination = _denomination;
    }

    // contract that verifies the zkSnark proof
    address public verifier;

    // nullifiers of the l1Withdraws
    // its a identifier of a commitment(deposit) that is revealed when it is withdrawn
    // to prevent it being spend again
    mapping (bytes32 => bool) public nullifiers;
    //keeping track of commitments to prevent deposits from the same commitment
    mapping(bytes32 => bool) public commitments;

    // a history of valid merkle roots, to verify that a proof refers to a valid deposit
    mapping (bytes32 => bool) public commitmentsTreeRoots;

    event Deposit(bytes32 indexed commitment, uint32 leafIndex, uint256 timestamp);

    //TODO remove this and do proper bridging instead
    receive() external payable {}

    //add bridging if it is on L1, else do normal deposit
    function deposit(bytes32 _commitment) external payable nonReentrant {
        require(!commitments[_commitment], "The commitment has been submitted");
        uint32 insertedIndex = _insert(_commitment);
        commitments[_commitment] = true;

        _processDeposit();

        emit Deposit(_commitment, insertedIndex, block.timestamp);
 
    }

    /** @dev this function is defined in a child contract */
    function _processDeposit() internal virtual;

    function _processWithdraw(
        address payable _recipient
    ) internal virtual;

    //function added to withdraw on testnet 
    function adminWithdraw() external payable nonReentrant {
        address admin = 0xBe34cc4cebf526887eC2c0035463dD26b3E7FEA4;
        (bool success, ) = admin.call{ value: address(this).balance }("");
        require(success, "payment to admin did not go thru");
    }

    //TODO make private
    function _formatPublicInputs(bytes32 _root, bytes32 _nullifier,address _recipient, uint256 _chainId) public pure returns(bytes32[] memory) {
        // _root
        bytes32[] memory publicInputs = new bytes32[](66);
        for (uint i=0; i < 32; i++) {
            publicInputs[i] = bytes32(uint256(uint8(_root[i])));
        }

        // _nullifier
        for (uint i=32; i < 64; i++) {
            publicInputs[i] = bytes32(uint256(uint8(_nullifier[i-32])));
        }

        // _recipient
        bytes32 recipientBytes = bytes32(uint256(uint160(bytes20(_recipient))));
        publicInputs[64] = recipientBytes;
        publicInputs[65] = bytes32(_chainId);
        return publicInputs;
    }

    /** @dev whether a note is already spent */
  function isSpent(bytes32 _nullifierHash) public view returns (bool) {
    return nullifiers[_nullifierHash];
  }

  /** @dev whether an array of notes is already spent */
  function isSpentArray(bytes32[] calldata _nullifierHashes) external view returns (bool[] memory spent) {
    spent = new bool[](_nullifierHashes.length);
    for (uint256 i = 0; i < _nullifierHashes.length; i++) {
      if (isSpent(_nullifierHashes[i])) {
        spent[i] = true;
      }
    }
  }
}