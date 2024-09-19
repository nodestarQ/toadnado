# 🐸🌪️ Toadnado 🐸🌪️

Toadnado is a mixer that allows you to deposit from both L2 (scroll) and L1. You can then anonymously withdraw on L2 to a new address. This doesn't reveal from which address you deposited, or even which chain. The anonymity set spans across both L1 and L2 :D

Today's bridges do not preserve privacy. We build Toadnado to prove that they can, and it's cool! We hope it will inspire future bridge protocols to add better privacy.

We used scrolls new L1SLOAD opcode to read the L1 commitment-root atomically from L1. ☝️🤓

"Let my people go, so that they may worship me. If you refuse to let them go, I will plague your whole country with frogs." — Exodus 8:1–4

## Quickstart

To get started with toadnado, follow the steps below:

1. `git clone` and install dependencies with `yarn install` in the root directory:

```shell
##go to the deployment script 00_deploy_your_contract and uncomment the l1 export and comment out the l2 export
yarn deploy --network sepolia --tags L1
##after that verify
yarn verify --network sepolia
## after this has been finished grab the l1 sc address and replace it with the l1scaddress constant in the deploy script, also uncomment l2 export and commment out l1 export
yarn deploy --network l1sload
## verification does not work as of yet on scroll devnet  
```
## How to Use
1. Run `yarn start` from the root directory and if needed check the `scaffold.config.json`
2. Deposit some ETH on either L1 (ethereum sepolia testnet) or L2 (scroll devnet) `Deposits`.
![Deposit interface](/media/1.png)
3. Download the `note.json` that will be generated upon successfull transaction, simply press on the button and the file will be saved in your download folder.
![Deposit interface with successfull tx and download button](/media/2.png)
4. On L2 Withdraw you can specify a recipient and the note to successfully transfer funds from the mixer to a new address.
![Withdraw interface](/media/3.png)

## test
```shell
yarn test
```

## genrate zeros for merkle-tree.sol  
(you need to copy paste output into merkle-tree.sol)
```
yarn generate-zeros
```

## deploy 
```shell
yarn hardhat run ./scripts/deploy.ts --network sepolia
```