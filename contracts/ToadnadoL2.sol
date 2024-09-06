// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./Toadnado.sol";
//import "hardhat/console.sol";

contract ToadnadoL2 is Toadnado {
    address public l1Address;

    address private constant L1_SLOAD_ADDRESS = 0x0000000000000000000000000000000000000101;
    uint256 private constant L1_ROOTS_MAPPING_SLOT = 3;
    uint256 private constant L1_CURRENT_ROOT_INDEX_SLOT = 3;

    constructor(
        address _l1Address,
        address _verifier,
        uint256 _denomination,
        uint32 _merkleTreeHeight
    ) Toadnado(_verifier, _denomination, _merkleTreeHeight) {
        l1Address = _l1Address;
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
                    l1Address,
                    uint(keccak256(abi.encodePacked(key, L1_ROOTS_MAPPING_SLOT)))
                ),
                (bytes32)
            );
    }

    function isKnownL1Root(bytes32 _root) public override view returns (bool) {
        if (_root == 0) {
            return false;
        }
        uint32 _currentRootIndex = abi.decode(
            readSingleSlot(l1Address, L1_CURRENT_ROOT_INDEX_SLOT),
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

    function isKnownL2Root(bytes32 _root) public override view returns (bool) {
      // isKnownRoot is from merkleTree.sol
      return isKnownRoot(_root);
    }
}
