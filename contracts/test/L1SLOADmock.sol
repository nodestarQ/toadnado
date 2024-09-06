// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "hardhat/console.sol";
contract L1SLOADmock {
    mapping (address => mapping (uint256 => bytes)) public mockedSlots;

    constructor () {
    }

    function decodeInput(bytes calldata data) public pure returns (address, uint256) {
        return (address(bytes20(data[:20])), uint256(bytes32(data[20:52])));

    }

    function setMockedSlot(address l1ContactAddr, uint256 slot, bytes calldata value) public {
        mockedSlots[l1ContactAddr][slot] = value;
    }

    function readMockedSlot(address _l1ContactAddr, uint256 _slot) public view returns ( bytes memory) {
        bytes memory value = mockedSlots[_l1ContactAddr][_slot];
        return value;
    }

    // mimics L1_SLOAD_ADDRESS.staticcall(input) at ToadnadoL2
    fallback(bytes calldata data) external returns (bytes memory) {
        address l1ContactAddr;
        uint256 slot;
        (l1ContactAddr, slot) = decodeInput(data);
        return  bytes(mockedSlots[l1ContactAddr][slot]);
    }
}