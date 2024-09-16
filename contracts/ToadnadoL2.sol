// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {Toadnado} from "./Toadnado.sol";
import {IScrollMessenger} from "@scroll-tech/contracts/libraries/IScrollMessenger.sol";

contract ToadnadoL2 is Toadnado  {
    address public immutable l2ScrollMessenger;
    address public immutable l1ToadnadoAddress;

    address private constant L1_SLOAD_ADDRESS = 0x0000000000000000000000000000000000000101;
    uint256 private constant L1_ROOTS_MAPPING_SLOT = 3;
    uint256 private constant L1_CURRENT_ROOT_INDEX_SLOT = 3;

    constructor(
        address _verifier,
        uint256 _denomination,
        uint32 _merkleTreeHeight,
        address _l2ScrollMessenger,
        address _l1ToadnadoAddress
    ) Toadnado(_verifier, _denomination, _merkleTreeHeight) {
        l2ScrollMessenger = _l2ScrollMessenger;
        l1ToadnadoAddress = _l1ToadnadoAddress;
    }

    function readSingleSlot(
        address l1_contract,
        uint256 slot
    ) public view returns (bytes memory) {
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

    function getL1Root(uint256 key) public view returns (bytes32) {
        return
            abi.decode(
                readSingleSlot(
                    l1ToadnadoAddress,
                    uint(
                        keccak256(abi.encodePacked(key, L1_ROOTS_MAPPING_SLOT))
                    )
                ),
                (bytes32)
            );
    }

    function isKnownL1Root(bytes32 _root) public view override returns (bool) {
        if (_root == 0) {
            return false;
        }
        uint32 _currentRootIndex = abi.decode(
            readSingleSlot(l1ToadnadoAddress, L1_CURRENT_ROOT_INDEX_SLOT),
            (uint32)
        );
        uint32 i = _currentRootIndex;
        do {
            if (_root == getL1Root(i)) {
                return true;
            }
            if (i == 0) {
                i = ROOT_HISTORY_SIZE;
            }
            i--;
        } while (i != _currentRootIndex);
        return false;
    }

    function isKnownL2Root(bytes32 _root) public view override returns (bool) {
        // isKnownRoot is from merkleTree.sol
        return isKnownRoot(_root);
    }

    function sendLatestRootToL1(uint32 gasLimit) public payable {
        IScrollMessenger scrollMessenger = IScrollMessenger(l2ScrollMessenger);
        // sendMessage is able to execute any function by encoding the abi using the encodeWithSignature function
        scrollMessenger.sendMessage{value:msg.value}(
            l1ToadnadoAddress,
            0,
            abi.encodeWithSignature("addL2Root(bytes32)", getLastRoot()),
            gasLimit,
            msg.sender
        );
    }

    function recieveBridgedEth(bytes32[] calldata nullifiers) public payable override {
        //TODO put this into a seperate overide function
        require(msg.sender == l2ScrollMessenger,"function not called by l1ScrollMessenger");
        require(IScrollMessenger(l2ScrollMessenger).xDomainMessageSender() == l1ToadnadoAddress,"contract messaging from L2 is not the l2ToadnadoScrollAddress");

        uint256 totalEthFromNullifiers; 
        for (uint i = 0; i < nullifiers.length; i++) {
            bytes32 nullifier = nullifiers[i];
            PendingWithdrawalData memory pendingWithdrawalData = pendingWithdrawals[nullifier];
            
            emit Withdrawal(pendingWithdrawalData.recipient, nullifier);
            payable(pendingWithdrawalData.recipient).transfer(pendingWithdrawalData.amount);

            totalEthFromNullifiers += pendingWithdrawalData.amount;
            pendingWithdrawals[nullifiers[i]].isPending = true;
        }
        require(msg.value == totalEthFromNullifiers, "totalEthFromNullifiers doesnt match the eth send");
        bridgingIsPending = false;
    }

    // TODO WARNING a upper limit needs to be set for the size of the nullifiers array.
    // if too big recieveBridgedEth can run out of gas and brick bridging of the contract (bridgingIsPending is stuck on true)
    function bridgeEth(uint256 _amount, uint256 gasLimit, bytes32[] calldata nullifiers) public override {
        require(bridgingIsPending == false, "a bridging transaction is already pending"); // only one at the time!
        bridgingIsPending = true;
        
        //TODO put this into a seperate overide function
        IScrollMessenger scrollMessenger = IScrollMessenger(l2ScrollMessenger);
        // sendMessage is able to execute any function by encoding the abi using the encodeWithSignature function
        scrollMessenger.sendMessage{value:_amount}(
            l1ToadnadoAddress,
            _amount,
            abi.encodeWithSignature("recieveBridgedEth(bytes32[])", nullifiers),
            gasLimit,
            msg.sender
        );
    }
}
