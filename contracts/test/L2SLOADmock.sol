// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract L2SLOADmock {
    mapping (address => mapping (uint256 => bytes)) public mockedSlots;

    constructor () {
    }

    function setMockedSlot(address l1ContactAddr, uint256 slot, bytes calldata value) public {
        mockedSlots[l1ContactAddr][slot] = value;
    }

    function readMockedSlot(address l1ContactAddr, uint256 slot) public view returns (bytes memory) {
        bytes memory value = mockedSlots[l1ContactAddr][slot];
        return value;
    }
    function hi() public view returns (uint256) {
        return 420;
    }
    // mimics L1_SLOAD_ADDRESS.staticcall(input) at ToadnadoL2
    fallback(bytes calldata data) external returns (bytes memory) {
        address l1ContactAddr;
        uint256 slot;
        (l1ContactAddr, slot) = abi.decode(data, (address, uint256));
        return readMockedSlot(l1ContactAddr, slot);
    }

}