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

contract ToadnadoL1 is MerkleTree, ReentrancyGuard{

    constructor(address _verifier) MerkleTree(20) {
        verifier = _verifier;
        MerkleTree.levels = levels;
    }

    // contract that verifies the zkSnark proof
    address public verifier;

    // nullifiers of the l1Withdraws
    // its a identiefier of a commitment(deposit) that is revealed when it is withdrawn
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


    function deposit(bytes32 _commitment) external payable nonReentrant {
        require(!commitments[_commitment], "The commitment has been submitted");

        //DONE update merkle tree
        uint32 insertedIndex = _insert(_commitment);
        commitments[_commitment] = true;
        _insert(_commitment);

        //TODO get the eth (0.01 eth)
        //_processDeposit();

        emit Deposit(_commitment, insertedIndex, block.timestamp);
 
    }

    function withdraw(address to, bytes32 nullifier,uint256 chainId, bytes calldata snarkProof) public {
        bytes32[] memory publicInputs = _formatPublicInputs(to, nullifier, chainId);
        if (!IVerifier(verifier).verify(snarkProof, publicInputs)) {
            revert VerificationFailed();
        }
        //TODO send the money to "to"
        //TODO add nullifier
        //TODO checkChainID
    }

    function _formatPublicInputs(address to, bytes32 nullifier,uint256 chainId) private returns(bytes32[] memory) {

    }


    //TODO remove this
    //debug functions
    function setCommitmentsTree(bytes32[] calldata _commitmentsTree, bytes32 _root) public {
        commitmentsTree = _commitmentsTree;
        commitmentsTreeRoots[_root] = true;
    }






}