// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./Toadnado.sol";

contract ToadnadoL1 is Toadnado {
  address public l2Address;
  constructor(
    address _verifier,
    uint256 _denomination,
    uint32 _merkleTreeHeight
  ) Toadnado(_verifier, _denomination, _merkleTreeHeight) {}
   
    function isKnownL1Root(bytes32 _root) public override view returns (bool) {
      return isKnownRoot(_root);
    }

    function isKnownL2Root(bytes32 _root) public override view returns (bool) {
      // isKnownRoot is from merkleTree.sol
      require(false, "not implemented yet");
      return false;
    }

}