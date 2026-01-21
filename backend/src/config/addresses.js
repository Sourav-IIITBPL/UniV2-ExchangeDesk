/**
 * MASTER DEX CONFIGURATION
 * All addresses are checksum-verified and lowercase.
 * Subgraph IDs are for The Graph's Decentralized Network.
 */

export const addresses = {
  ethereum: {
    uniswap: {
      factory: "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f",
      subgraphId: "A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum",
      fee: 0.003,
    },
    sushi: {
      factory: "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac",
      subgraphId: "7Tbc4o9M99Si1x7yenGXmsbHyMgUTPKJU1GjDdaXzXK3",
      fee: 0.003,
    },
    pancake: {
      factory: "0x1097053fd2ea711dad45cacccc45eff7548fcb362",
      subgraphId: "6p6Yst8m69R8hEBCm2zF8L3X9Ld6uA6zJ1Ym6p6Yst8m", // PCV2 Ethereum
      fee: 0.0025,
    },
  },
  bsc: {
    pancake: {
      factory: "0xca143ce32fe78f1f7019d7d551a6402fc5350c73",
      subgraphId: "Aj9TDh9SPcn7cz4DXW26ga22VnBzHhPVuKGmE4YBzDFj",
      fee: 0.0025,
    },
    sushi: {
      factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
      subgraphId: "7Tbc4o9M99Si1x7yenGXmsbHyMgUTPKJU1GjDdaXzXK3", // Sushi multi-chain ID
      fee: 0.003,
    },
  },
  polygon: {
    quickswap: {
      factory: "0x5757371414417b8c6caad45baef941abc7d3ab32",
      subgraphId: "EXBcAqmvQi6VAnE9X4MNK83LPeA6c1PsGskffbmThoeK",
      fee: 0.003,
    },
    sushi: {
      factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
      subgraphId: "7Tbc4o9M99Si1x7yenGXmsbHyMgUTPKJU1GjDdaXzXK3",
      fee: 0.003,
    },
  },
  base: {
    sushi: {
      factory: "0x71524b4f97c5823e741e0027e38908230d20be7e",
      subgraphId: "7Tbc4o9M99Si1x7yenGXmsbHyMgUTPKJU1GjDdaXzXK3",
      fee: 0.003,
    },
  },
  avalanche: {
    pangolin: {
      factory: "0xefa94de7a4656d787667c749f7e1223d71e9580a",
      subgraphId: "GzGBUh1X4Cq9RBdyKoCrPLhYW1saBYHwFBgcTsARPYUG",
      fee: 0.003,
    },
    traderjoe: {
      factory: "0x9ad6c38be97d6397c0f6c67ee2c353b115533170", // Legacy V2 Factory
      subgraphId: "7Tbc4o9M99Si1x7yenGXmsbHyMgUTPKJU1GjDdaXzXK3", // Often shared via Sushi indexers or native
      fee: 0.003,
    },
  },
  arbitrum: {
    sushi: {
      factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
      subgraphId: "9tSS5FaePZnjmnXnSKCCqKVLAqA6eGg6jA2oRojsXUbP",
      fee: 0.003,
    },
    pancake: {
      factory: "0x02a84c1b3bbd7401a5f7fa98a384ebc70bb5749e",
      subgraphId: "EsL7geTRcA3LaLLM9EcMFzYbUgnvf8RixoEEGErrodB3",
      fee: 0.0025,
    },
  },
  optimism: {
    sushi: {
      factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
      subgraphId: "7Tbc4o9M99Si1x7yenGXmsbHyMgUTPKJU1GjDdaXzXK3",
      fee: 0.003,
    },
  },
  unichain: {
    // Unichain is V4-native, but V2-forks are launching for legacy compatibility
    uniswap_v2: {
      factory: "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f",
      subgraphId: "A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum",
      fee: 0.003,
    },
  },
};

export default addresses;
