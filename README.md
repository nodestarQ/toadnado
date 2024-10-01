# 🐸🌪️ Toadnado 🐸🌪️

Toadnado is a mixer that allows you to deposit from both L2 (scroll) and L1. You can then anonymously withdraw on L2 to a new address. This doesn't reveal from which address you deposited, or even which chain. The anonymity set spans across both L1 and L2 :D

Today's bridges do not preserve privacy. We build Toadnado to prove that they can, and it's cool! We hope it will inspire future bridge protocols to add better privacy.

We used scrolls new L1SLOAD opcode to read the L1 commitment-root atomically from L1. ☝️🤓

"Let my people go, so that they may worship me. If you refuse to let them go, I will plague your whole country with frogs." — Exodus 8:1–4

## Quickstart

To get started with toadnado, follow the steps below:

1. `git clone` and install dependencies with `yarn install` in the root directory:

2. deploy the contracts
```shell
yarn hardhat run ./scripts/deploy.ts --network sepolia
```

<!-- ## UI
1. Run `yarn start` from the root directory and if needed check the `scaffold.config.json`
2. Deposit some ETH on either L1 (ethereum sepolia testnet) or L2 (scroll devnet) `Deposits`.
![Deposit interface](/media/1.png)
3. Download the `note.json` that will be generated upon successfull transaction, simply press on the button and the file will be saved in your download folder.
![Deposit interface with successfull tx and download button](/media/2.png)
4. On L2 Withdraw you can specify a recipient and the note to successfully transfer funds from the mixer to a new address.
![Withdraw interface](/media/3.png) -->

## noir
install
```shell
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup --version 0.30.0
```

compile circuits
```shell
cd circuits/prover/; nargo compile 
```

generate verifier contract
```shell
cd circuits/prover/; nargo codegen-verifier; cp contract/prover/plonk_vk.sol ../../contracts/plonk_vk.sol
```

## test
run a local test node  
```shell
yarn hardhat node
```

run test  
```shell
yarn test
```

## genrate zeros for merkle-tree.sol  
(you need to copy paste output into merkle-tree.sol)
```
yarn generate-zeros
```