/**
 * MASTER DEX CONFIGURATION
 * All addresses are checksum-verified and lowercase.
 * Subgraph IDs are for The Graph's Decentralized Network.
 */

export const addresses = {
  uniswap: {
    ethereum: {
      factory: "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f",
      subgraphId: "A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum",
      fee: 0.003,
    },
    bsc: {
      factory: "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
      router: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24",
      subgraphId: "DhdyQtEq6pMRj7E6r3CfVD4N1dXsck6FK8CLLnWLGLfs",
      fee: 0.003,
    },
    polygon: {
      factory: "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C",
      router: "0xedf6066a2b290C185783862C7F4776A2C8077AD1",
      subgraphId: "EXBcAqmvQi6VAnE9X4MNK83LPeA6c1PsGskffbmThoeK",
      fee: 0.003,
    },
    base: {
      factory: "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
      router: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
      subgraphId: "5kQUuZHhFmFqMJ6pcQsUQcEjMh4dJNDhwcP1Fpd572ZW",
      fee: 0.003,
    },
    avalanche: {
      factory: "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C",
      router: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
      subgraphId: "77G9tW8Y2kY2f2hLdF8oR8vXU3kG6D8vH5jN8kQ7rM3",
      fee: 0.003,
    },
    arbitrum: {
      factory: "0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9",
      router: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
      subgraphId: "GZ7sSj7pWkS89Lq9X6P8R9N5M4K3L2J1I0H9G8F7E6D",
      fee: 0.003,
    },

    optimism: {
      factory: "0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf",
      router: "0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2",
      subgraphId: "9kQ7rM3N8kPVuKGmE4YBzDFjAj9TDh9SPcn7cz4DXW26",
      fee: 0.003,
    },
    unichain: {
      factory: "0x1f98400000000000000000000000000000000002",
      router: "0x284f11109359a7e1306c3e447ef14d38400063ff",
      subgraphId: "A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum",
      fee: 0.003,
    },

    // testnet

    sepolia: {
      factory: "0xF62c03E08ada871A0bEb309762E260a7a6a880E6",
      exchange_router: "0xa4AA9d05f142dbd5893992B70A1E8157b4801a50",
      router: "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3",
      subgraphId: "H7m6p6Yst8m69R8hEBCm2zF8L3X9Ld6uA6zJ1Ym6p6Yst",
      fee: 0.003,
    },
  },
  //sushi
  sushi: {
    ethereum: {
      factory: "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac",
      router: "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
      subgraphId: "QmaR2nAMF6dCHBL1eFNQ4F5nGpJQs7V11PZobJB2FgQtbt",
      fee: 0.003,
    },
    bsc: {
      factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
      router: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
      subgraphId: "QmQ3b4S6PSgvRkd5PhxtDPDQRybfmaRYxGVZCLbYJopoKJ", // Sushi multi-chain ID
      fee: 0.003,
    },
    polygon: {
      factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
      router: "	0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
      subgraphId: "QmcFVSFXGgodMVUGLAdYdYPfohyMwWat8pfi5pHSDXgskU",
      fee: 0.003,
    },
    base: {
      factory: "0x71524b4f93c58fcbf659783284e38825f0622859",
      router: "	0x6bded42c6da8fbf0d2ba55b2fa120c5e0c8d7891",
      subgraphId: "QmQfYe5Ygg9A3mAiuBZYj5a64bDKLF4gF6sezfhgxKvb9y",
      fee: 0.003,
    },
    avalanche: {
      factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
      router: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
      subgraphId: "QmadNP3fXrcba189BuSrT88Tw7YHhTtHWsdBTQhNpyaF6c",
      fee: 0.003,
    },

    arbitrum: {
      factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
      router: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
      subgraphId: "QmfN96hDXYtgeLsBv5WjQY8FAwqBfBFoiq8gzsn9oApcoU",
      fee: 0.003,
    },
    optimism: {
      factory: "0xfbc12984689e5f15626bad03ad60160fe98b303c",
      router: "0x2abf469074dc0b54d793850807e6eb5faf2625b1",
      subgraphId: "QmZWaFzzzs7CEzpVeLrNqW6e7oNxG8AnkJt9kUEV5rFzxn",
      fee: 0.003,
    },

    // test nets
    sepolia: {
      factory: "0x734583f62bb6ace3c9ba9bd5a53143ca2ce8c55a",
      router: "0xeabce3e74ef41fb40024a21cc2ee2f5ddc615791",
      subgraphId: "",
      fee: 0.003,
    },
  },
  //pancake
  pancake: {
    ethereum: {
      factory: "0x1097053Fd2ea711dad45caCcc45EfF7548fCB362",
      router: "0xEfF92A263d31888d860bD50809A8D171709b7b1c",
      subgraphId: "6p6Yst8m69R8hEBCm2zF8L3X9Ld6uA6zJ1Ym6p6Yst8m", // PCV2 Ethereum
      fee: 0.0025,
    },
    bsc: {
      factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
      router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
      subgraphId: "Aj9TDh9SPcn7cz4DXW26ga22VnBzHhPVuKGmE4YBzDFj",
      fee: 0.0025,
    },
    base: {
      factory: "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
      router: "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb",
      subgraphId: "5FwLx8rRp9VeW2NfwSFWucLtf613247EgiMb6YRuyT4F",
      fee: 0.0025,
    },

    arbitrum: {
      factory: "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
      router: "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb",
      subgraphId: "EsL7geTRcA3LaLLM9EcMFzYbUgnvf8RixoEEGErrodB3",
      fee: 0.0025,
    },

    // testnet

    BSCtestnet: {
      factory: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",
      router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
      subgraphId: "",
      fee: 0.0025,
    },
  },
  //shibaswap
  shibaswap: {
    ethereum: {
      factory: "0x115934131916C8b277DD010Ee02de363c09d037c",
      router: "0x03f7724180AA6b939894B5Ca4314783B0b36b329",
      subgraphId: "5g5jLdsqRSMuMqbCYoLkoFiEJtYpw3YqC1TXwohLRSHE",
      fee: 0.003,
    },
    shibarium: {
      factory: "0xc2b4218F137e3A5A9B98ab3AE804108F0D312CBC",
      router: "0xEF83bbB63E8A7442E3a4a5d28d9bBf32D7c813c8",
      subgraphId: "78J4vLp9VeW2NfwSFWucLtf613247EgiMb6YRuyT4F",
      fee: 0.003,
    },
  },
};

// polygon: {

//   quickswap: {
//     factory: "0x5757371414417b8c6caad45baef941abc7d3ab32",
//       subgraphId: "EXBcAqmvQi6VAnE9X4MNK83LPeA6c1PsGskffbmThoeK",
//         fee: 0.003,
//     },

//   avalanche: {

//     pangolin: {
//       factory: "0xefa94de7a4656d787667c749f7e1223d71e9580a",
//         subgraphId: "GzGBUh1X4Cq9RBdyKoCrPLhYW1saBYHwFBgcTsARPYUG",
//           fee: 0.003,
//     },
//     traderjoe: {
//       factory: "0x9ad6c38be97d6397c0f6c67ee2c353b115533170", // Legacy V2 Factory
//         subgraphId: "7Tbc4o9M99Si1x7yenGXmsbHyMgUTPKJU1GjDdaXzXK3", // Often shared via Sushi indexers or native
//           fee: 0.003,
//     },
//   },
//   arbitrum: {

//   },

// },

//   };

export default addresses;
