// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface IVerifier {
    function verify(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) external view returns (bool);
}
error VerificationFailed();

contract ToadnadoL1 {

    constructor(address _verifier) {
        verifier = _verifier;
    }

    // contract that verifies the zkSnark proof
    address public verifier;

    // nullifiers of the l1Withdraws
    // its a identiefier of a commitment(deposit) that is revealed when it is withdrawn
    // to prevent it being spend again
    mapping (bytes32 => bool) public nullifiers;

    // a history of valid merkle roots, to verify that a proof refers to a valid deposit
    mapping (bytes32 => bool) public commitmentsTreeRoots;

    //TODO find out depth and set array lenght to that as 2^depth
    // contains the entire current merkle tree from the commitements (leafs) to the root
    // ex at depth 1 (2 commitements)
    // [commitment1,commitment2, hash1atLevel1, hash2atLevel1, root]
    bytes32[] public commitmentsTree;


    function deposit(bytes32 commitment) public {
        //TODO update merkle tree
        //TODO get the eth (0.01 eth)
 
    }

    function withdraw(bytes32 root, bytes32 nullifier, address recipient, uint256 chainId, bytes calldata snarkProof) public {
        bytes32[] memory publicInputs = _formatPublicInputs(root, nullifier, recipient, chainId);
        if (!IVerifier(verifier).verify(snarkProof, publicInputs)) {
            revert VerificationFailed();
        }
        require(nullifiers[nullifier] == false, "note already spend");
        nullifiers[nullifier] = true;
        //TODO send the money to "to"
        //TODO add nullifier
        //TODO checkChainID
    }

    function _formatPublicInputs(bytes32 root, bytes32 nullifier, address recipient, uint256 chainId) private returns(bytes32[] memory) {

    }


    //TODO remove this
    //debug functions
    function setCommitmentsTree(bytes32[] calldata _commitmentsTree, bytes32 _root) public {
        commitmentsTree = _commitmentsTree;
        commitmentsTreeRoots[_root] = true;
    }

    //TODO remove this
    //debug functions
    function setVerifier(address _verifier) public {
        verifier = _verifier;
    }
}