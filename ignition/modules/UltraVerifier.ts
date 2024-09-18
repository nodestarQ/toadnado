// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UltraVerifierModule = buildModule("UltraVerifier", (m) => {
    const ultraVerifier = m.contract("UltraVerifier", [], {
        value: 0n,
    });

    return { ultraVerifier };
});

export default UltraVerifierModule
