import { Contract } from "ethers";
import { getProvider } from "./rpc.service.js";
import addresses from "../config/addresses.js";
import factoryAbi from "../contracts/UniswapV2Factory.json" with { type: "json" };

import "dotenv/config";
import axios from "axios";

function getFactory(chain, protocol) {
  const provider = getProvider(chain);
  const factoryAddress = addresses[chain]?.[protocol]?.factory;

  if (!factoryAddress) {
    throw new Error(`Uniswap factory not configured for chain: ${chain}`);
  }

  return new Contract(factoryAddress, factoryAbi, provider);
}

export async function getAllPairsLength(chain, protocol) {
  const factory = getFactory(chain, protocol);
  const total = await factory.allPairsLength();
  return total.toString();
}

export async function getAllPairs(chain, limit, offset) {
  const factory = getFactory(chain);

  const total = await factory.allPairsLength();
  const start = offset;
  const end = Math.min(offset + limit, Number(total));

  const pairs = [];

  for (let i = start; i < end; i++) {
    const pair = await factory.allPairs(i);
    pairs.push(pair);
  }

  return {
    total: total.toString(),
    count: pairs.length,
    pairs,
  };
}

export async function checkPairExists(tokenA, tokenB, chain) {
  const factory = getFactory(chain);
  const pair = await factory.getPair(tokenA, tokenB);

  return pair !== "0x0000000000000000000000000000000000000000";
}

// This script handles the API call to The Graph using the config above. It is designed to be "plug and play."

// 1. Define the Metrics Query.
const POOL_QUERY = `query getPoolMetrics($pairAddress: String!) {
  pair(id: $pairAddress) {
    id
    reserveUSD
    txCount
    token0 { symbol decimals }
    token1 { symbol decimals }
  }
  pairDayDatas(
    first: 30
    orderBy: date
    orderDirection: desc
    where: { pairAddress: $pairAddress }
  ) {
    date
    dailyVolumeUSD
    dailyTxns
  }
}`;

// 1. Updated Query to support cursor based pagination via "where" filter.
const TOP_PAIRS_QUERY = `
  query GetTopPairs($limit: Int!, $lastTvl: BigDecimal!) {
    pairs(
      first: $limit, 
      orderBy: reserveUSD, 
      orderDirection: desc, 
      where: { reserveUSD_lt: $lastTvl, reserveUSD_gt: "1000" }
    ) {
      id
      token0 { id symbol decimals }
      token1 { id symbol decimals }
      reserveUSD
    }
  }
`;

// 2. The Detailed Metrics Logic
export async function getDetailedMetrics(url, pairAddress, feeOverride) {
  try {
    const query = {
      query: POOL_QUERY,
      variables: { pairAddress: pairAddress.toLowerCase() },
    };

    const response = await axios.post(url, query);
    const data = response.data.data;

    if (!data.pair || !data.pairDayDatas.length) return null;

    const { pair, pairDayDatas } = data;
    const tvl = parseFloat(pair.reserveUSD);
    const vol1D = parseFloat(pairDayDatas[0].dailyVolumeUSD);
    const vol30D = pairDayDatas.reduce(
      (sum, day) => sum + parseFloat(day.dailyVolumeUSD),
      0,
    );
    const tx24h = parseInt(pairDayDatas[0].dailyTxns);

    const dailyFees = vol1D * feeOverride;
    const apr = tvl > 0 ? ((dailyFees * 365) / tvl) * 100 : 0;

    return {
      feeTier: (feeOverride * 100).toFixed(2) + "%",
      tvl: tvl.toLocaleString("en-US", { style: "currency", currency: "USD" }),
      apr: apr.toFixed(2) + "%",
      vol1D: vol1D.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
      vol30D: vol30D.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
      tx24h: tx24h,
      volTvlRatio: tvl > 0 ? (vol1D / tvl).toFixed(4) : "0",
    };
  } catch (e) {
    return null;
  }
}

// 3. The Main Fetcher

/**
 * @param {string} lastTVL - The reserveUSD of the last pool in your list.
 * Pass "999999999999" (or very high number) for the first call.
 */

export async function getTopPairsByLiquidity(
  chain,
  protocol,
  limit,
  lastTVL = "999999999999999",
) {
  const config = addresses[chain]?.[protocol];
  if (!config) throw new Error("Invalid selection");

  const graphEndpoint = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/${config.subgraphId}`;

  const topPairsQuery = {
    query: TOP_PAIRS_QUERY,
    variables: {
      limit: limit,
      lastTvl: lastTVL, // Cursor-based pagination
    },
  };

  try {
    const response = await axios.post(graphEndpoint, topPairsQuery);
    const pairs = response.data.data.pairs;

    //  We create an array of PROMISES and then wait for all of them
    const detailedPairs = await Promise.all(
      pairs.map(async (pair) => {
        const metrics = await getDetailedMetrics(
          graphEndpoint,
          pair.id,
          config.fee,
        );
        return {
          ...pair,
          factory: config.factory,
          fee: config.fee,
          metrics: metrics, // Key added correctly here
        };
      }),
    );

    return detailedPairs;
  } catch (error) {
    console.error(
      `Error fetching more pairs of ${protocol} on ${chain}:`,
      error,
    );
    return [];
  }
}
