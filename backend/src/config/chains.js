const chains = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: process.env.ETH_RPC_URL,
    nativeCurrency: 'ETH'
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum',
    rpcUrl: process.env.ARBITRUM_RPC_URL,
    nativeCurrency: 'ETH'
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: process.env.POLYGON_RPC_URL,
    nativeCurrency: 'MATIC'
  }


}

export default chains

