// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import UltraVerifierModule from "./UltraVerifier"



const ToadnadoL2Module = buildModule("ToadnadoL2Module", (m) => {
    //https://ethereum.stackexchange.com/a/163209/126731
    const ultraVerifier = m.contract("UltraVerifier", [], {
        value: 0n,
    });

    const denomination = m.getParameter("denomination")
    const merkleTreeHeight = m.getParameter("merkleTreeHeight")
    const l2ScrollMessenger = m.getParameter("l2ScrollMessenger")
    const l1ToadnadoAddress = m.getParameter("l1ToadnadoAddress")

    const toadnadoL2 = m.contract("ToadnadoL2", [ultraVerifier, denomination, merkleTreeHeight, l2ScrollMessenger, l1ToadnadoAddress], {
        value: 0n,
    });

    return { toadnadoL2, ultraVerifier };
});

export default ToadnadoL2Module
