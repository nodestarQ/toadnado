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
        uint32 _merkleTreeHeight,
        address _l2ScrollMessenger,
        address _l1ToadnadoAddress
    ) Toadnado(_verifier, _merkleTreeHeight) {
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

    function getL1Root(uint256 key) public view returns (uint256) {
        return
            abi.decode(
                readSingleSlot(
                    l1ToadnadoAddress,
                    uint(
                        keccak256(abi.encodePacked(key, L1_ROOTS_MAPPING_SLOT))
                    )
                ),
                (uint256)
            );
    }

    function isKnownL1Root(uint256 _root) public view override returns (bool) {
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

    function isKnownL2Root(uint256 _root) public view override returns (bool) {
        return isKnownRoot(_root);
    }

    function getLastKnowL1Root() public view override returns (uint256) {
        uint32 _currentRootIndex = abi.decode(
            readSingleSlot(l1ToadnadoAddress, L1_CURRENT_ROOT_INDEX_SLOT),
            (uint32)
        ); 
        return getL1Root(_currentRootIndex);
    }

    function getLastKnowL2Root() public view override returns (uint256) {
        return roots[currentRootIndex];
    }

    function sendLatestRootToL1(uint32 gasLimit) public payable {
        IScrollMessenger scrollMessenger = IScrollMessenger(l2ScrollMessenger);
        // sendMessage is able to execute any function by encoding the abi using the encodeWithSignature function
        scrollMessenger.sendMessage{value:msg.value}(
            l1ToadnadoAddress,
            0,
            abi.encodeWithSignature("addL2Root(uint256)", getLastKnowL1Root()),
            gasLimit,
            msg.sender
        );
    }

    function recieveBridgedEth() public payable override {
        //TODO put this into a seperate overide function
        require(msg.sender == l2ScrollMessenger,"function not called by l1ScrollMessenger");
        require(IScrollMessenger(l2ScrollMessenger).xDomainMessageSender() == l1ToadnadoAddress,"contract messaging from L2 is not the l2ToadnadoScrollAddress");
        //------

        ethPendingWithdrawals += msg.value;
    }

    function bridgeEth(uint256 _amount, uint256 gasLimit) public override {
        require(_amount <= address(this).balance - ethPendingWithdrawals, "not enough eth in contract (considering ethPendingWithdrawals)");

        //TODO put this into a seperate overide function
        require(msg.sender == l2ScrollMessenger,"function not called by l1ScrollMessenger");
        require(IScrollMessenger(l2ScrollMessenger).xDomainMessageSender() == l1ToadnadoAddress,"contract messaging from L2 is not the l2ToadnadoScrollAddress");

        IScrollMessenger scrollMessenger = IScrollMessenger(l2ScrollMessenger);
        // sendMessage is able to execute any function by encoding the abi using the encodeWithSignature function
        scrollMessenger.sendMessage{value:_amount}(
            l1ToadnadoAddress,
            _amount,
            abi.encodeWithSignature("recieveBridgedEth()"),
            gasLimit,
            msg.sender
        );
    }

    function requestEthBridge(uint256 gasLimit) public override {
        uint256 _amount = bridgeDebt;
        
        //TODO put this into a seperate overide function
        IScrollMessenger scrollMessenger = IScrollMessenger(l2ScrollMessenger);
        // sendMessage is able to execute any function by encoding the abi using the encodeWithSignature function
        scrollMessenger.sendMessage{value:0}(
            l1ToadnadoAddress,
            0,
            abi.encodeWithSignature("bridgeEth(uint256,uint256)", _amount, gasLimit), // reusing gasLimit should be fine technac
            gasLimit,
            msg.sender
        );
        //---------------------

        bridgeDebt = 0;
    }

}
