const chains = {
  // mainnet
  ethereum: {
    chainId: 1,
    name: "Ethereum",
    rpcUrl: process.env.ETH_RPC_URL,
    nativeCurrency: "ETH",
  },
  arbitrum: {
    chainId: 42161,
    name: "Arbitrum",
    rpcUrl: process.env.ARBITRUM_RPC_URL,
    nativeCurrency: "ETH",
  },
  polygon: {
    chainId: 137,
    name: "Polygon",
    rpcUrl: process.env.POLYGON_RPC_URL,
    nativeCurrency: "POL",
  },
  optimism: {
    chainId: 10,
    name: "Optimism",
    rpcUrl: process.env.OPTIMISM_RPC_URL,
    nativeCurrency: "ETH",
  },
  base: {
    chainId: 8453,
    name: "Base",
    rpcUrl: process.env.BASE_RPC_URL,
    nativeCurrency: "ETH",
  },
  bsc: {
    chainId: 56,
    name: "BSC",
    rpcUrl: process.env.BSC_RPC_URL,
    nativeCurrency: "BNB",
  },
  avalanche: {
    chainId: 43114,
    name: "Avalanche",
    rpcUrl: process.env.AVALANCHE_RPC_URL,
    nativeCurrency: "AVAX",
  },
  unichain: {
    chainId: 130,
    name: "Unichain",
    rpcUrl: process.env.UNICHAIN_RPC_URL,
    nativeCurrency: "ETH",
  },

  // testnets
};

export default chains;
