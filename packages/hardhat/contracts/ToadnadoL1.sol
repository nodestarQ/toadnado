// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./Toadnado.sol";

contract ToadnadoL1 is Toadnado {
  constructor(
    //IVerifier _verifier,
    address _verifier,
    uint256 _denomination,
    uint32 _merkleTreeHeight
  ) Toadnado(_verifier, _denomination, _merkleTreeHeight) {}
  

  function _processDeposit() internal override {
    require(msg.value == denomination, "Please send `mixDenomination` ETH along with transaction");
  }

  function _processWithdraw(
    address payable _recipient
  ) internal override{
    //only allow withdrawal on L2 for now 
    require(block.chainid!=11155111, "withdrawal only allowed on L2");
    // sanity checks
    require(msg.value == 0, "Message value is supposed to be zero for ETH instance");
    (bool success, ) = _recipient.call{ value: denomination }("");
    require(success, "payment to _recipient did not go thru");
  }

}