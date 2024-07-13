// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;


contract ToadnadoL2 {

mapping (uint256=>bytes32) l1Roots;
uint32 public constant ROOT_HISTORY_SIZE = 30;
uint32 public currentRootIndex = 0;

address constant L1Address = 0x3EF9b20C061588Ea749FD007A13e10a3321c4aF4;

function isKnownL1Root(bytes32 _root) public view returns (bool) {
    if (_root == 0) {
      return false;
    }
    uint32 _currentRootIndex = currentRootIndex;
    uint32 i = _currentRootIndex;
    do {
      if (_root == l1Roots[i]) {
        return true;
      }
      if (i == 0) {
        i = ROOT_HISTORY_SIZE;
      }
      i--;
    } while (i != _currentRootIndex);
    return false;
  }

address constant L1_SLOAD_ADDRESS = 0x0000000000000000000000000000000000000101;

    function readSingleSlot(address l1_contract, uint256 slot) public view returns (bytes memory) {

        bytes memory input = abi.encodePacked(l1_contract, slot);

        bool success;
        bytes memory result;

        (success, result) = L1_SLOAD_ADDRESS.staticcall(input);

        if (!success) {
            revert("L1SLOAD failed");
        }

        return result;

    }

    // 
    function getL1Root(address l1_contract, uint256 key) public view returns(bytes32) {
        uint slotNumber = 3;
        return abi.decode(readSingleSlot(
            l1_contract,
            uint(keccak256(
                abi.encodePacked(key,slotNumber)
                )
            )
            ), (bytes32));
    }

    function isKnownRoot(bytes32 _root) public view returns (bool) {
    if (_root == 0) {
      return false;
    }
    uint32 _currentRootIndex = currentRootIndex;
    uint32 i = _currentRootIndex;
    do {
      if (_root == getL1Root(L1Address, i)) {
        return true;
      }
      if (i == 0) {
        i = ROOT_HISTORY_SIZE;
      }
      i--;
    } while (i != _currentRootIndex);
    return false;
  }

    // function readMapSlot(address l1_contract, uint256 slot) public {

    //     bytes memory input = abi.encodePacked(l1_contract, slot);

    //     //get max amount for the for loop 

    //     bool success;

    //     (success, leafResult) = L1_SLOAD_ADDRESS.staticcall(input);

    //     if (!success) {
    //         revert("L1SLOAD failed");
    //     }

    // }
    
}