// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./Toadnado.sol";

contract ToadnadoL1 is Toadnado {
  constructor(
    address _verifier,
    uint256 _denomination,
    uint32 _merkleTreeHeight
  ) Toadnado(_verifier, _denomination, _merkleTreeHeight) {}
   
  // TODO ADD FUNCTION for automated badge bridging

  function _processDeposit() internal override {
    require(msg.value == denomination, "Please send `mixDenomination` ETH along with transaction");
    // if(block.chainid!=11155111){
    //   //do some bridging
    //   address payable me = payable(0xBe34cc4cebf526887eC2c0035463dD26b3E7FEA4);
    //  (bool success, ) = me.call{value: msg.value}("");
    //     require(success, "Transfer failed.");
    // }
  }

  function _processWithdraw(
    address payable _recipient
  ) internal override{
    require(msg.value == 0, "Message value is supposed to be zero for ETH instance");
    (bool success, ) = _recipient.call{ value: denomination }("");
    require(success, "payment to _recipient did not go thru");
  }

}