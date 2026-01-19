import { Contract } from "ethers";
import { getProvider } from "./rpc.service.js";
import { getTokenMetadata } from "./token.service.js";
import { normalizeReserve, computePrice, computeTVL } from "../utils/math.js";
import pairAbi from "../contracts/UniswapV2Pair.json" with { type: "json" };

export async function getPairDetails(pairAddress, chain) {
  const provider = getProvider(chain);
  const pair = new Contract(pairAddress, pairAbi, provider);

  const [token0, token1, reserves] = await Promise.all([
    pair.token0(),
    pair.token1(),
    pair.getReserves(),
  ]);

  const [token0Meta, token1Meta] = await Promise.all([
    getTokenMetadata(token0, chain),
    getTokenMetadata(token1, chain),
  ]);

  const reserve0 = normalizeReserve(
    reserves.reserve0.toString(),
    token0Meta.decimals,
  );

  const reserve1 = normalizeReserve(
    reserves.reserve1.toString(),
    token1Meta.decimals,
  );

  const price0 = computePrice(reserve0, reserve1);
  const price1 = computePrice(reserve1, reserve0);

  return {
    pair: pairAddress.toLowerCase(),
    token0: token0Meta,
    token1: token1Meta,
    reserve0,
    reserve1,
    price0,
    price1,
    tvl: computeTVL(reserve0, reserve1),
    blockTimestampLast: Number(reserves.blockTimestampLast),
  };
}
