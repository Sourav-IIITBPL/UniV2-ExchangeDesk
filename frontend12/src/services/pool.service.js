// READ-ONLY service
// Swap RPC reads for backend endpoints later without touching UI

export async function fetchAllPools({ chainId }) {
  // Placeholder shape expected by UI
  // Later: GET /api/pools?chainId=...
  return [
    {
      id: "eth-usdc",
      tokenA: "ETH",
      tokenB: "USDC",
      chain: chainId,
      tvlUsd: 12345678,
    },
  ];
}

export async function fetchUndeployedPools({ chainId }) {
  // Pools where factory.getPair == 0
  return [
    {
      id: "new-token-usdc",
      tokenA: "NEW",
      tokenB: "USDC",
      chain: chainId,
    },
  ];
}
