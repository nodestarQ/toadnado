// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
//import UltraVerifierModule from "./UltraVerifier"

const ToadnadoL1Module = buildModule("ToadnadoL1Module", (m) => {
    //https://ethereum.stackexchange.com/a/163209/126731
    const ultraVerifier = m.contract("UltraVerifier", [], {
        value: 0n,
    });

    const denomination = m.getParameter("denomination")
    const merkleTreeHeight = m.getParameter("merkleTreeHeight")
    const l1ScrollMessenger = m.getParameter("l1ScrollMessenger")

    const toadnadoL1 = m.contract("ToadnadoL1", [ultraVerifier, denomination, merkleTreeHeight, l1ScrollMessenger], {
        value: 0n,
    });

    return { toadnadoL1, ultraVerifier};
});

export default ToadnadoL1Module