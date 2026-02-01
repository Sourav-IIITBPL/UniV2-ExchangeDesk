import { apiGet } from "./api";

/**
 * Fetch top 20  pools and then infiinite scroll pagination from backend
 * This is used for public dashboard (no wallet)
 */

/**
 * Fetch and map pools from the backend with detailed metrics
 */
export async function fetchAllPools({ limit = null, chain = "ethereum", protocol = "uniswap", lastTVL = null }) {
  // Pass the lastTVL as a query parameter for infinite scroll
  // A cleaner way to write your 3-param logic
const path = `/pairs?${limit ? `limit=${limit}` : ""}&chain=${chain}&protocol=${protocol}${lastTVL ? `&lastTVL=${lastTVL}` : ""}`;
  const data = await apiGet(path);

  // The backend returns { total, count, pairs: [...] }
  return {
    total: data.total || 0,
    count: data.count || 0,
    chain: chain,
    // Use optional chaining (?.) and default values (||)
    pairs: (data.pairs || []).map((pool) => ({
      id: pool.id,
      address: pool.id,
      tokenA: pool.token0?.symbol || "Unknown",
      tokenB: pool.token1?.symbol || "Unknown",
      decimalsA: pool.token0?.decimals || 18,
      decimalsB: pool.token1?.decimals || 18,
      
      // SAFE MAPPING: If metrics is null, use these defaults
      tvl: pool.metrics?.tvl || "$0.00",
      apr: pool.metrics?.apr || "0.00%",
      vol1D: pool.metrics?.vol1D || "$0.00",
      vol30D: pool.metrics?.vol30D || "$0.00",
      volTvlRatio: pool.metrics?.volTvlRatio || "0.00",
      tx24h: pool.metrics?.tx24h || 0,
      fee: pool.metrics?.feeTier || "0.30%",
      
      rawReserveUSD: pool.reserveUSD || "0", 
    })),
  };
}

/**
 * Undeployed pools are not supported yet
 * Return empty array to keep UI stable
 */
export async function fetchUndeployedPools({ chainId }) {
  return [];
}
