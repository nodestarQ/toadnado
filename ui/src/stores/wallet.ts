import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import { layer1, layer2 } from '../utils/chainConfig';

type Wallet = {
  provider: ethers.BrowserProvider | null;
  account: string | null;
  chainId: bigint | null;
};

const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const newProvider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = await newProvider.getSigner();
    const address = await signer.getAddress();
	const { chainId } = await newProvider.getNetwork()
    const returnWallet: Wallet = { account: address, provider: newProvider, chainId };

    return returnWallet;
  } else {
    alert('MetaMask is not installed');
    return { account: null, provider: null, chainId: null};
  }
};

const createWallet = async () => {
  const { subscribe, set } = writable<Wallet>({
    provider: null,
    account: null,
	chainId: null,
  });

  // Handle account and network changes
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User has disconnected
      set({ provider: null, account: null, chainId: null });
    } else {
      // Update the account with the new one
      const newWallet = await connectWallet();
      set(newWallet);
    }
  };

  const handleChainChanged = async () => {
		const newWallet = await connectWallet();
      	set(newWallet);
  };

  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
  }

	const handleNetworkChange = async (target: number) => {
		let targetId = null;
		if(target == 0){
			targetId = layer1
		}
		if(target == 1){
			targetId = layer2
		}
		if(targetId == null){
			return 
		}
		window.ethereum.request({
			method:"wallet_addEthereumChain",
			params: targetId
		})
	};

  return {
    subscribe,
    connect: async () => set(await connectWallet()),
    disconnect: () => set({ provider: null, account: null, chainId: null }),
	switch: (t:number) => handleNetworkChange(t),
  };
};

export const wallet = await createWallet();
