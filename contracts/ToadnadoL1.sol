// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {Toadnado} from "./Toadnado.sol";
import {IL1ScrollMessenger} from "@scroll-tech/contracts/L1/IL1ScrollMessenger.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


    // l1 messenger address:
    //https://docs.scroll.io/en/developers/scroll-contracts/#advanced-bridge-contracts

contract ToadnadoL1 is Toadnado, Ownable {
    address public l2ScrollToadnadoAddress; 
    address public immutable l1ScrollMessenger;

    mapping(bytes32 => bool) L2RootsCache;

    constructor(
        address _verifier,
        uint256 _denomination,
        uint32 _merkleTreeHeight,
        address _l1ScrollMessenger
    ) Toadnado(_verifier, _denomination, _merkleTreeHeight) Ownable(msg.sender) {
        l1ScrollMessenger = _l1ScrollMessenger;
    }

    function setL2ScrollToadnadoAddress(address _l2ScrollToadnadoAddress)  public onlyOwner() {
      require(l2ScrollToadnadoAddress == address(0), "l2ScrollToadnadoAddress is already set");
      l2ScrollToadnadoAddress = _l2ScrollToadnadoAddress;
    }

    //TODO do the array style history like in roots mapping in merkleTree.sol
    function addL2Root(bytes32 _root) public {
        require(msg.sender == l1ScrollMessenger,"function not called by l1ScrollMessenger");
        require(IL1ScrollMessenger(l1ScrollMessenger).xDomainMessageSender() == l2ScrollToadnadoAddress,"contract messaging from L2 is not the l2ToadnadoScrollAddress");
        L2RootsCache[_root] = true;
    }

    // overides
    function isKnownL1Root(bytes32 _root) public view override returns (bool) {
        return isKnownRoot(_root);
    }

    function isKnownL2Root(bytes32 _root) public view override returns (bool) {
        return L2RootsCache[_root];
    }
}
