//import * as dotenv from "dotenv";
//dotenv.config();
import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-switch-network"; 
// import "@nomicfoundation/hardhat-ethers";
// import "@nomicfoundation/hardhat-chai-matchers";
// import "@typechain/hardhat";
// import "hardhat-gas-reporter";
// import "solidity-coverage";
// import "@nomicfoundation/hardhat-verify";
// import "hardhat-deploy";
// import "hardhat-deploy-ethers";

// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const alchemyProviderApiKey = vars.get("ALCHEMY_API_KEY")
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey = vars.get("DEPLOYER_PRIVATE_KEY")
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = vars.get("ETHERSCAN_KEY");
const scrollscanApiKey = vars.get("SCROLLSCAN_KEY")

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.23",
    settings: {
      evmVersion: "shanghai",
      optimizer: {
        enabled: true,
        // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
        runs: 200,
      },
    },
  },
  defaultNetwork: "localhost",
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyProviderApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyProviderApiKey}`,
      accounts: [deployerPrivateKey],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${alchemyProviderApiKey}`,
      accounts: [deployerPrivateKey],
    },
    l1sload: {
      url: `https://l1sload-rpc.scroll.io`,
      accounts: [deployerPrivateKey],
      chainId: 2227728,
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [deployerPrivateKey],
      chainId: 534351
    },
    scroll: {
      url: "https://rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
  },
  // configuration for harhdat-verify plugin
  etherscan: {
    apiKey: {
      l1sload: "abc",
      sepolia: etherscanApiKey,
      scrollSepolia: scrollscanApiKey,
      
    },
    customChains: [
      {
        network: "l1sload",
        chainId: 2227728,
        urls: {
          apiURL: "https://l1sload-blockscout.scroll.io/api",
          browserURL: "https://l1sload-blockscout.scroll.io",
        }
      },
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io/",
        }
      },
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://api-sepolia.scrollscan.com/api',
          browserURL: 'https://sepolia.scrollscan.com/',
        },
      }
    ]
  },
  // configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
    },
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
