// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import UltraVerifierModule from "./UltraVerifier"



const ToadnadoL2Module = buildModule("ToadnadoL2Module", (m) => {
    //https://ethereum.stackexchange.com/a/163209/126731
    const ultraVerifier = m.contract("UltraVerifier", [], {
        value: 0n,
    });

    const merkleTreeHeight = m.getParameter("merkleTreeHeight")
    const l2ScrollMessenger = m.getParameter("l2ScrollMessenger")
    const l1ToadnadoAddress = m.getParameter("l1ToadnadoAddress")
    const poseidonT3Address = m.getParameter("poseidonT3Address");
    const _poseidonT3 = m.contractAt("PoseidonT3",poseidonT3Address)

    const toadnadoL2 = m.contract("ToadnadoL2", [ultraVerifier, merkleTreeHeight, l2ScrollMessenger, l1ToadnadoAddress], {
        value: 0n,
        libraries: {
            PoseidonT3: _poseidonT3,
          }
    });

    return { toadnadoL2, ultraVerifier };
});

export default ToadnadoL2Module
