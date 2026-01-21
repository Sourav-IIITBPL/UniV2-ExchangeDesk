import { apiGet } from "./api";

/**
 * Fetch all deployed pools from backend
 * This is used for public dashboard (no wallet)
 */
export async function fetchAllPools({ chainId }) {
  // backend is already fixed to Ethereum mainnet for now
  // chainId param kept to avoid breaking UI
  const data = await apiGet("/pairs");

  return data.map((pool) => ({
    id: pool.address,
    tokenA: pool.token0.symbol,
    tokenB: pool.token1.symbol,
    chain: pool.chainId,
    tvlUsd: pool.tvlUSD,
    address: pool.address,
  }));
}

/**
 * Undeployed pools are not supported yet
 * Return empty array to keep UI stable
 */
export async function fetchUndeployedPools({ chainId }) {
  return [];
}
