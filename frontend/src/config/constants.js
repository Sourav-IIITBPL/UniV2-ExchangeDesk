// config/constants.js

export const CHAIN_METADATA = {
  1: {
    name: "Ethereum",
    symbol: "ETH",
    wrapper: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  11155111: {
    name: "Sepolia",
    symbol: "ETH",
    wrapper: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  },
  137: {
    name: "Polygon",
    symbol: "POL",
    wrapper: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  },
  8453: {
    name: "Base",
    symbol: "ETH",
    wrapper: "0x4200000000000000000000000000000000000006",
  },
  42161: {
    name: "Arbitrum",
    symbol: "ETH",
    wrapper: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  },
  56: {
    name: "BSC",
    symbol: "BNB",
    wrapper: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  },
  43114: {
    name: "Avalanche",
    symbol: "AVAX",
    wrapper: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  },
  109: {
    name: "Shibarium",
    symbol: "BONE",
    // Wrapped BONE (WBONE) address on Mainnet
    wrapper: "0x8E5246797B9C7A17533036814E69d10e057E244F",
  },
  157: {
    name: "Shibarium Puppynet",
    symbol: "BONE",
    // Wrapped BONE (WBONE) address on Testnet
    wrapper: "0x367f3B437c35e8250005d93375836262453e00C0",
  },
  130: {
    name: "Unichain",
    symbol: "ETH",
    wrapper: "0x4200000000000000000000000000000000000006",
  },
  1301: {
    name: "Unichain Sepolia",
    symbol: "ETH",
    wrapper: "0x4200000000000000000000000000000000000006",
  },
};

export const CHAINS_ID_TO_NAME = {
  1: "ethereum",
  11155111: "sepolia",
  137: "polygon",
  8453: "base",
  42161: "arbitrum",
  56: "bsc",
  43114: "avalanche",
  109: "shibarium",
  130: "unichain",
};

export const CHAINS_NAME_TO_ID = {
  ethereum: 1,
  sepolia: 11155111,
  polygon: 137,
  base: 8453,
  arbitrum: 42161,
  bsc: 56,
  avalanche: 43114,
  shibarium: 109,
  unichain: 130,
};
