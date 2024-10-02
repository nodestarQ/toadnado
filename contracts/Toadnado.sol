// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "poseidon-solidity/PoseidonT3.sol";

import {MerkleTree} from "./MerkleTree.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IVerifier {
    function verify(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) external view returns (bool);
}
error VerificationFailed();

abstract contract Toadnado is MerkleTree, ReentrancyGuard {
    constructor(
        address _verifier,
        uint32 _merkleTreeHeight
    ) MerkleTree(_merkleTreeHeight) {
        verifier = _verifier;
    }

    event Deposit(uint256 indexed commitment, uint32 leafIndex, uint256 timestamp);

    event Withdrawal(address recipient, uint256 nullifier);
    event PendingWithdrawal(address recipient, uint256 nullifier);

    // contract that verifies the zkSnark proof
    address public immutable verifier;

    // nullifiers of the withdraws
    // its a identifier of a commitment(deposit) that is revealed when it is withdrawn
    // to prevent it being spend again
    mapping(uint256 => bool) public nullifiers;
    //keeping track of commitments to prevent deposits from the same commitment
    mapping(uint256 => bool) public commitments;

    // a history of valid merkle roots, to verify that a proof refers to a valid deposit
    mapping(uint256 => bool) public commitmentsTreeRoots;

    struct PendingWithdrawalData {
        address recipient;
        uint256 amount;
        bool isPending;
    }

    // _nullifier => UnclaimedWithdrawal
    mapping(uint256 => PendingWithdrawalData) pendingWithdrawals;

    uint256 public bridgeDebt = 0;
    uint256 public ethPendingWithdrawals = 0;




    //-----DANGEROUS DEBUG STUFF---------------
    //TODO remove this and do proper bridging eth/ accounting logic instead
    // receive() external payable {}

    // //function added to withdraw on testnet
    // function adminWithdraw() external payable nonReentrant {
    //     address admin = 0xBe34cc4cebf526887eC2c0035463dD26b3E7FEA4;
    //     (bool success, ) = admin.call{value: address(this).balance}("");
    //     require(success, "payment to admin did not go thru");
    // }

    //---------------------------------------

    /** @dev whether a note is already spent */
    function isSpent(uint256 _nullifierHash) public view returns (bool) {
        return nullifiers[_nullifierHash];
    }

    /** @dev whether an array of notes is already spent */
    function isSpentArray(
        uint256[] calldata _nullifierHashes
    ) external view returns (bool[] memory spent) {
        spent = new bool[](_nullifierHashes.length);
        for (uint256 i = 0; i < _nullifierHashes.length; i++) {
            if (isSpent(_nullifierHashes[i])) {
                spent[i] = true;
            }
        }
    }

    function _formatPublicInputs(
        uint256 _root,
        uint256 _nullifier,
        address _recipient,
        uint256 _chainId,
        uint256 _amount
    ) internal pure returns (bytes32[] memory) {

        bytes32[] memory publicInputs = new bytes32[](5);
        publicInputs[0] = bytes32(_root);
        publicInputs[1] = bytes32(_nullifier);
        publicInputs[2] = bytes32(uint256(uint160(bytes20(_recipient))));
        publicInputs[3] = bytes32(_chainId);
        publicInputs[4] = bytes32(_amount);
        return publicInputs;
    }

    function _processWithdraw(address payable _recipient, uint256 _nullifier, uint256 _amount) internal {
        require(msg.value == 0,"Message value is supposed to be zero for ETH instance");
        if ((address(this).balance - ethPendingWithdrawals) >= _amount) {
            emit Withdrawal(_recipient, _nullifier);
            _recipient.transfer(_amount);
        } else {
            emit PendingWithdrawal(_recipient, _nullifier);
            pendingWithdrawals[_nullifier] = PendingWithdrawalData(_recipient, _amount, true);
            bridgeDebt += _amount;
        }
    }

    function withdrawPending(uint256 _nullifier) public {
        PendingWithdrawalData memory withdrawal = pendingWithdrawals[_nullifier];
        require(withdrawal.isPending == true, "This withdraw is already claimed");
        
        pendingWithdrawals[_nullifier].isPending = false;
        ethPendingWithdrawals -= withdrawal.amount;

        payable(withdrawal.recipient).transfer(withdrawal.amount);
        emit Withdrawal(withdrawal.recipient, _nullifier);
    }

    function deposit(uint256 _preCommitment) external payable nonReentrant {
        uint256 amount = msg.value;
        uint256 commitment = PoseidonT3.hash([_preCommitment, amount]);
        require(
            !commitments[commitment],
            "The commitment has already been submitted"
        );
        uint32 insertedIndex = _insert(commitment);
        commitments[commitment] = true;

        emit Deposit(commitment, insertedIndex, block.timestamp);
    }

    // bridging functions
    function isKnownL2Root(uint256 _root) public virtual returns(bool);
    function isKnownL1Root(uint256 _root) public virtual returns(bool);

    //TODO WARNING needs account logic in place to prevent griefers from constantly bridging back and forth and making USER FUND UNAVAILABLE
    function recieveBridgedEth() public payable virtual;
    function requestEthBridge(uint256 gasLimit)  public virtual;
    function bridgeEth(uint256 _amount, uint256 gasLimit) public virtual; // TODO doc said uint32 gasLimit instead of 256??

    function withdraw(
        uint256 _l1root,
        uint256 _l2root,
        uint256 _nullifier,
        address payable _recipient,
        uint256 _amount,
        bytes calldata snarkProof
    ) external payable nonReentrant {
        require(!nullifiers[_nullifier], "The note has been already spent");
        require(isKnownL2Root(_l2root), "Cannot find your l2 merkle root"); // Make sure to use a recent one + also pick the L2 Root
        require(isKnownL1Root(_l1root), "Cannot find your l1 merkle root"); // Make sure to use a recent one + also pick the L2 Root

        // onchain public inputs
        uint256 metaRoot =  PoseidonT3.hash([_l1root, _l2root]); //keccak256(abi.encodePacked(_l1root, _l2root));
        uint256 chainid = block.chainid;
        bytes32[] memory publicInputs = _formatPublicInputs(
            metaRoot,
            _nullifier,
            _recipient,
            chainid,
            _amount
        );

        if (!IVerifier(verifier).verify(snarkProof, publicInputs)) {
            revert VerificationFailed();
        }

        nullifiers[_nullifier] = true;
        _processWithdraw(_recipient, _nullifier,_amount);
    }
}
