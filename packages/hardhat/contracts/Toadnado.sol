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


    //TODO find out depth and set array lenght to that as 2^depth
    // contains the entire current merkle tree from the commitements (leafs) to the root
    // ex at depth 1 (2 commitements)
    // [commitment1,commitment2, hash1atLevel1, hash2atLevel1, root]
    bytes32[] public commitmentsTree;

    event Deposit(bytes32 indexed commitment, uint32 leafIndex, uint256 timestamp);
    event Withdrawal(address recipient, bytes32 nullifier);


    function deposit(bytes32 _commitment) external payable nonReentrant {
        require(!commitments[_commitment], "The commitment has been submitted");
        uint32 insertedIndex = _insert(_commitment);
        commitments[_commitment] = true;
        _processDeposit();

        emit Deposit(_commitment, insertedIndex, block.timestamp);
 
    }

    /** @dev this function is defined in a child contract */
    function _processDeposit() internal virtual;

    function withdraw(
        bytes32 _root,
        bytes32 _nullifier,
        address payable _recipient, 
        bytes calldata snarkProof
        ) external payable nonReentrant  {

        bytes32[] memory publicInputs = _formatPublicInputs(_root, _nullifier, _recipient);
        if (!IVerifier(verifier).verify(snarkProof, publicInputs)) {
            revert VerificationFailed();
        }
    
        _processWithdraw(_recipient);
        emit Withdrawal(_recipient, _nullifier);
    }
    
    function _processWithdraw(
    address payable _recipient
    ) internal virtual;


    //TODO make private
    function _formatPublicInputs(bytes32 _root, bytes32 _nullifier,address _recipient) public returns(bytes32[] memory) {
        // _root
        bytes32[] memory publicInputs = new bytes32[](65);
        for (uint i=0; i < 33; i++) {
            publicInputs[i] = bytes32(uint256(uint8(_root[i-1])));
        }

        // _nullifier
        for (uint i=32; i < 64; i++) {
            publicInputs[i] = bytes32(uint256(uint8(_nullifier[i-33])));
        }

        // _recipient
        bytes32 recipientBytes = bytes32(uint256(uint160(bytes20(_recipient))));
        publicInputs[65] = recipientBytes;
        return publicInputs;
    }


    //TODO remove this
    //debug functions
    // function setCommitmentsTree(bytes32[] calldata _commitmentsTree, bytes32 _root) public {
    //     commitmentsTree = _commitmentsTree;
    //     commitmentsTreeRoots[_root] = true;
    // }






}