// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {Toadnado} from "./Toadnado.sol";
import {IScrollMessenger} from "@scroll-tech/contracts/libraries/IScrollMessenger.sol";
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
        require(IScrollMessenger(l1ScrollMessenger).xDomainMessageSender() == l2ScrollToadnadoAddress,"contract messaging from L2 is not the l2ToadnadoScrollAddress");
        L2RootsCache[_root] = true;
    }

    // overides
    function isKnownL1Root(bytes32 _root) public view override returns (bool) {
        return isKnownRoot(_root);
    }

    function isKnownL2Root(bytes32 _root) public view override returns (bool) {
        return L2RootsCache[_root];
    }

    function recieveBridgedEth(bytes32[] calldata nullifiers) public payable override {
        //TODO put this into a seperate overide function
        require(msg.sender == l1ScrollMessenger,"function not called by l1ScrollMessenger");
        require(IScrollMessenger(l1ScrollMessenger).xDomainMessageSender() == l2ScrollToadnadoAddress,"contract messaging from L2 is not the l2ToadnadoScrollAddress");
        //---------------------

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
    function bridgeEth(uint256 _amount,uint256 gasLimit, bytes32[] calldata nullifiers) public override {
      require(bridgingIsPending == false, "a bridging transaction is already pending"); // only one at the time!
      bridgingIsPending = true;

      //TODO put this into a seperate overide function
      IScrollMessenger scrollMessenger = IScrollMessenger(l1ScrollMessenger);
      // sendMessage is able to execute any function by encoding the abi using the encodeWithSignature function
      scrollMessenger.sendMessage{value:_amount}(
          l2ScrollToadnadoAddress,
          _amount,
          abi.encodeWithSignature("recieveBridgedEth(bytes32[])", nullifiers),
          gasLimit,
          msg.sender
      );
      //---------------------
    }
}
