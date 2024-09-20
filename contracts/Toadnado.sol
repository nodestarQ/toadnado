// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

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
        uint256 _denomination,
        uint32 _merkleTreeHeight
    ) MerkleTree(_merkleTreeHeight) {
        require(_denomination > 0, "denomination should be greater than 0");
        verifier = _verifier;
        denomination = _denomination;
    }

    event Deposit(bytes32 indexed commitment,uint32 leafIndex,uint256 timestamp);

    event Withdrawal(address recipient, bytes32 nullifier);
    event PendingWithdrawal(address recipient, bytes32 nullifier);

    //IVerifier public immutable verifier;
    uint256 public immutable denomination;

    // contract that verifies the zkSnark proof
    address public immutable verifier;

    // nullifiers of the withdraws
    // its a identifier of a commitment(deposit) that is revealed when it is withdrawn
    // to prevent it being spend again
    mapping(bytes32 => bool) public nullifiers;
    //keeping track of commitments to prevent deposits from the same commitment
    mapping(bytes32 => bool) public commitments;

    // a history of valid merkle roots, to verify that a proof refers to a valid deposit
    mapping(bytes32 => bool) public commitmentsTreeRoots;

    struct PendingWithdrawalData {
        address recipient;
        uint256 amount;
        bool isPending;
    }

    // _nullifier => UnclaimedWithdrawal
    mapping(bytes32 => PendingWithdrawalData) pendingWithdrawals;

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
    function isSpent(bytes32 _nullifierHash) public view returns (bool) {
        return nullifiers[_nullifierHash];
    }

    /** @dev whether an array of notes is already spent */
    function isSpentArray(
        bytes32[] calldata _nullifierHashes
    ) external view returns (bool[] memory spent) {
        spent = new bool[](_nullifierHashes.length);
        for (uint256 i = 0; i < _nullifierHashes.length; i++) {
            if (isSpent(_nullifierHashes[i])) {
                spent[i] = true;
            }
        }
    }

    function _formatPublicInputs(
        bytes32 _root,
        bytes32 _nullifier,
        address _recipient,
        uint256 _chainId
    ) internal pure returns (bytes32[] memory) {
        // _root
        bytes32[] memory publicInputs = new bytes32[](66);
        for (uint i = 0; i < 32; i++) {
            publicInputs[i] = bytes32(uint256(uint8(_root[i])));
        }

        // _nullifier
        for (uint i = 32; i < 64; i++) {
            publicInputs[i] = bytes32(uint256(uint8(_nullifier[i - 32])));
        }

        // _recipient
        bytes32 recipientBytes = bytes32(uint256(uint160(bytes20(_recipient))));
        publicInputs[64] = recipientBytes;
        publicInputs[65] = bytes32(_chainId);
        return publicInputs;
    }

    function _processDeposit() internal {
        require(msg.value == denomination,"Please send `mixDenomination` ETH along with transaction");
    }

    // function _processWithdraw(address payable _recipient , bytes32 _nullifier) internal {
    //     require(msg.value == 0,"Message value is supposed to be zero for ETH instance");
    //     emit Withdrawal(_recipient, _nullifier);
    //     _recipient.transfer(denomination);
    // }


    function _processWithdraw(address payable _recipient, bytes32 _nullifier) internal {
        require(msg.value == 0,"Message value is supposed to be zero for ETH instance");
        uint256 _amount = denomination; // this should be a input when toadnado is able to handle any size deposits 
        if ((address(this).balance - ethPendingWithdrawals) >= _amount) {
            emit Withdrawal(_recipient, _nullifier);
            _recipient.transfer(_amount);
        } else {
            emit PendingWithdrawal(_recipient, _nullifier);
            pendingWithdrawals[_nullifier] = PendingWithdrawalData(_recipient, _amount, true);
            bridgeDebt += _amount;
        }
    }

    function withdrawPending(bytes32 _nullifier) public {
        PendingWithdrawalData memory withdrawal = pendingWithdrawals[_nullifier];
        require(withdrawal.isPending == true, "This withdraw is already claimed");
        
        pendingWithdrawals[_nullifier].isPending = false;
        ethPendingWithdrawals -= withdrawal.amount;

        payable(withdrawal.recipient).transfer(withdrawal.amount);
        emit Withdrawal(withdrawal.recipient, _nullifier);
    }

    function deposit(bytes32 _commitment) external payable nonReentrant {
        require(
            !commitments[_commitment],
            "The commitment has already been submitted"
        );
        uint32 insertedIndex = _insert(_commitment);
        commitments[_commitment] = true;

        _processDeposit();

        emit Deposit(_commitment, insertedIndex, block.timestamp);
    }

    // bridging functions
    function isKnownL2Root(bytes32 _root) public virtual returns(bool);
    function isKnownL1Root(bytes32 _root) public virtual returns(bool);

    //TODO WARNING needs account logic in place to prevent griefers from constantly bridging back and forth and making USER FUND UNAVAILABLE
    function recieveBridgedEth() public payable virtual;
    function requestEthBridge(uint256 gasLimit)  public virtual;
    function bridgeEth(uint256 _amount, uint256 gasLimit) public virtual; // TODO doc said uint32 gasLimit instead of 256??

    function withdraw(
        bytes32 _l1root,
        bytes32 _l2root,
        bytes32 _nullifier,
        address payable _recipient,
        bytes calldata snarkProof
    ) external payable nonReentrant {
        require(!nullifiers[_nullifier], "The note has been already spent");
        require(isKnownL2Root(_l2root), "Cannot find your l2 merkle root"); // Make sure to use a recent one + also pick the L2 Root
        require(isKnownL1Root(_l1root), "Cannot find your l1 merkle root"); // Make sure to use a recent one + also pick the L2 Root

        // onchain public inputs
        bytes32 metaRoot = keccak256(abi.encodePacked(_l1root, _l2root));
        uint256 chainid = block.chainid;
        bytes32[] memory publicInputs = _formatPublicInputs(
            metaRoot,
            _nullifier,
            _recipient,
            chainid
        );

        if (!IVerifier(verifier).verify(snarkProof, publicInputs)) {
            revert VerificationFailed();
        }

        nullifiers[_nullifier] = true;
        _processWithdraw(_recipient, _nullifier);
    }
}
