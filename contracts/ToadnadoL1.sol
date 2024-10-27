// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {Toadnado} from "./Toadnado.sol";
import {IScrollMessenger} from "@scroll-tech/contracts/libraries/IScrollMessenger.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


import "hardhat/console.sol";

    // l1 messenger address:
    //https://docs.scroll.io/en/developers/scroll-contracts/#advanced-bridge-contracts

contract ToadnadoL1 is Toadnado, Ownable {
    address public l2ScrollToadnadoAddress; 
    address public immutable l1ScrollMessenger;

    mapping(uint256 => uint256) public l2RootsCache;
    uint32 public currentL2RootsCacheIndex;

    uint32 public constant L2_ROOT_HISTORY_SIZE = 30;

    constructor(
        address _verifier,
        uint32 _merkleTreeHeight,
        address _l1ScrollMessenger
    ) Toadnado(_verifier, _merkleTreeHeight) Ownable(msg.sender) {
        l1ScrollMessenger = _l1ScrollMessenger;

        l2RootsCache[0] = zeros(levels);
    }


    function setL2ScrollToadnadoAddress(address _l2ScrollToadnadoAddress)  public onlyOwner() {
      require(l2ScrollToadnadoAddress == address(0), "l2ScrollToadnadoAddress is already set");
      l2ScrollToadnadoAddress = _l2ScrollToadnadoAddress;
    }

    //TODO do the array style history like in roots mapping in merkleTree.sol
    function addL2Root(uint256 _root) public {
        require(msg.sender == l1ScrollMessenger,"function not called by l1ScrollMessenger");
        require(IScrollMessenger(l1ScrollMessenger).xDomainMessageSender() == l2ScrollToadnadoAddress,"contract messaging from L2 is not the l2ToadnadoScrollAddress");
        
        uint32 newRootIndex = (currentL2RootsCacheIndex + 1) % L2_ROOT_HISTORY_SIZE;
        currentL2RootsCacheIndex = newRootIndex;
        roots[newRootIndex] = _root;
    }

    // overides
    function isKnownL1Root(uint256 _root) public view override returns (bool) {
        return isKnownRoot(_root);
    }

    function isKnownL2Root(uint256 _root) public view override returns (bool) {
        if (_root == 0) {
            return false;
        }
        uint32 _currentRootIndex = currentL2RootsCacheIndex;
        uint32 i = _currentRootIndex;
        do {
            if (_root == l2RootsCache[i]) {
                return true;
            }
            if (i == 0) {
                i = ROOT_HISTORY_SIZE;
            }
            i--;
        } while (i != _currentRootIndex);
        return false;
    }

    function getLastKnowL1Root() public view override returns (uint256) {
        return roots[currentRootIndex];
    }


    function getLastKnowL2Root() public view override returns (uint256) {
        return l2RootsCache[currentL2RootsCacheIndex];
    }

    function recieveBridgedEth() public payable override {
        //TODO put this into a seperate overide function
        require(msg.sender == l1ScrollMessenger,"function not called by l1ScrollMessenger");
        require(IScrollMessenger(l1ScrollMessenger).xDomainMessageSender() == l2ScrollToadnadoAddress,"contract messaging from L2 is not the l2ToadnadoScrollAddress");
        //---------------------

        ethPendingWithdrawals += msg.value;
    }

    function bridgeEth(uint256 _amount, uint256 gasLimit) public override {
        require(_amount <= address(this).balance - ethPendingWithdrawals, "not enough eth in contract (considering ethPendingWithdrawals)");

        //TODO put this into a seperate overide function
        require(msg.sender == l1ScrollMessenger,"function not called by l1ScrollMessenger");
        console.logAddress(l2ScrollToadnadoAddress);
        console.logAddress(IScrollMessenger(l1ScrollMessenger).xDomainMessageSender());
        require(IScrollMessenger(l1ScrollMessenger).xDomainMessageSender() == l2ScrollToadnadoAddress,"contract messaging from L2 is not the l2ToadnadoScrollAddress");

        IScrollMessenger scrollMessenger = IScrollMessenger(l1ScrollMessenger);
        // sendMessage is able to execute any function by encoding the abi using the encodeWithSignature function
        scrollMessenger.sendMessage{value:_amount}(
            l2ScrollToadnadoAddress,
            _amount,
            abi.encodeWithSignature("recieveBridgedEth()"),
            gasLimit,
            msg.sender
        );
        //---------------------
    }

    function requestEthBridge(uint256 gasLimit) public override {
        uint256 _amount = bridgeDebt;
        
        //TODO put this into a seperate overide function
        IScrollMessenger scrollMessenger = IScrollMessenger(l1ScrollMessenger);
        // sendMessage is able to execute any function by encoding the abi using the encodeWithSignature function
        scrollMessenger.sendMessage{value:0}(
            l2ScrollToadnadoAddress,
            0,
            abi.encodeWithSignature("bridgeEth(uint256,uint256)", _amount, gasLimit), // reusing gasLimit should be fine technac
            gasLimit,
            msg.sender
        );
        //---------------------

        bridgeDebt = 0; // assumes no bridge tx can fail
    }
}
