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

        //DONE update merkle tree
        uint32 insertedIndex = _insert(_commitment);
        commitments[_commitment] = true;

        //DONE get denomination going
        _processDeposit();

        emit Deposit(_commitment, insertedIndex, block.timestamp);
 
    }

    /** @dev this function is defined in a child contract */
    function _processDeposit() internal virtual;

    function withdraw(
        address payable _recipient, 
        bytes32 _nullifier,
        uint256 chainId, 
        bytes calldata snarkProof
        ) external payable nonReentrant  {
        bytes32[] memory publicInputs = _formatPublicInputs(_recipient, _nullifier, chainId);
        if (!IVerifier(verifier).verify(snarkProof, publicInputs)) {
            revert VerificationFailed();
        }
        //TODO send the money to "to"
        //TODO add nullifier
        //TODO checkChainID
        
        _processWithdraw(_recipient);
        emit Withdrawal(_recipient, _nullifier);
    }
    
    function _processWithdraw(
    address payable _recipient
    ) internal virtual;


    function _formatPublicInputs(address to, bytes32 nullifier,uint256 chainId) private returns(bytes32[] memory) {

    }


    //TODO remove this
    //debug functions
    function setCommitmentsTree(bytes32[] calldata _commitmentsTree, bytes32 _root) public {
        commitmentsTree = _commitmentsTree;
        commitmentsTreeRoots[_root] = true;
    }






}