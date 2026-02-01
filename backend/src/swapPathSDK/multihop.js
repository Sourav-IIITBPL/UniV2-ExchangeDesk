// Uniswap V2 SDK (CommonJS → ESM interop)
import pkg from '@uniswap/v2-sdk';

const {
  ChainId,
  Token,
  Fetcher,
  Trade,
  TokenAmount,
  TradeType
} = pkg;

// Pancake & Shiba SDKs (also V2 forks)
import { Token as PToken, Fetcher as PFetcher, Trade as PTrade } from '@pancakeswap/sdk';
import { Token as SHToken, Fetcher as SHFetcher, Trade as SHTrade } from '@shibaswap/sdk';

/**
 * Map protocols to their V2-compatible SDKs
 * SushiSwap is intentionally treated as Uniswap V2 (correct design)
 */
const sdkMap = {
  uniswap: {
    Fetcher,
    Token,
    Trade,
    TokenAmount
  },
  sushiswap: {
    Fetcher,
    Token,
    Trade,
    TokenAmount
  },
  pancakeswap: {
    Fetcher: PFetcher,
    Token: PToken,
    Trade: PTrade,
    TokenAmount
  },
  shibaswap: {
    Fetcher: SHFetcher,
    Token: SHToken,
    Trade: SHTrade,
    TokenAmount
  }
};

/**
 * Exact Input (amountIn → max amountOut)
 */
export async function getBestPath(params) {
  const {
    BASES,
    protocol,
    chainId,
    tokenInAddr,
    tokenOutAddr,
    amountIn,
    provider
  } = params;

  try {
    const sdk = sdkMap[protocol];
    if (!sdk) throw new Error(`Unsupported protocol: ${protocol}`);

    const { Fetcher, Token, Trade, TokenAmount } = sdk;

    const tokenIn = await Fetcher.fetchTokenData(chainId, tokenInAddr, provider);
    const tokenOut = await Fetcher.fetchTokenData(chainId, tokenOutAddr, provider);

    const bridgeTokens = await Promise.all(
      (BASES || []).map(addr =>
        Fetcher.fetchTokenData(chainId, addr, provider).catch(() => null)
      )
    );

    const pairs = await fetchAllPairs(
      Fetcher,
      tokenIn,
      tokenOut,
      bridgeTokens.filter(Boolean),
      provider
    );

    const trades = Trade.bestTradeExactIn(
      pairs,
      new TokenAmount(tokenIn, amountIn),
      tokenOut,
      { maxHops: 3, maxNumResults: 1 }
    );

    if (!trades.length) throw new Error('No path found');

    const bestTrade = trades[0];

    return {
      protocol,
      path: bestTrade.route.path.map(t => t.address),
      amountOut: bestTrade.outputAmount.raw.toString()
    };
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Exact Output (min amountIn → exact amountOut)
 */
export async function getExactOutPath(params) {
  const {
    BASES,
    protocol,
    chainId,
    tokenInAddr,
    tokenOutAddr,
    amountOutDesired,
    provider
  } = params;

  try {
    const sdk = sdkMap[protocol];
    if (!sdk) throw new Error(`Unsupported protocol: ${protocol}`);

    const { Fetcher, Trade, TokenAmount } = sdk;

    const tokenIn = await Fetcher.fetchTokenData(chainId, tokenInAddr, provider);
    const tokenOut = await Fetcher.fetchTokenData(chainId, tokenOutAddr, provider);

    const bridgeTokens = await Promise.all(
      (BASES || []).map(addr =>
        Fetcher.fetchTokenData(chainId, addr, provider).catch(() => null)
      )
    );

    const pairs = await fetchAllPairs(
      Fetcher,
      tokenIn,
      tokenOut,
      bridgeTokens.filter(Boolean),
      provider
    );

    const trades = Trade.bestTradeExactOut(
      pairs,
      tokenIn,
      new TokenAmount(tokenOut, amountOutDesired),
      { maxHops: 3, maxNumResults: 1 }
    );

    if (!trades.length) throw new Error('No path found');

    const bestTrade = trades[0];

    return {
      protocol,
      path: bestTrade.route.path.map(t => t.address),
      amountInRequired: bestTrade.inputAmount.raw.toString()
    };
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Fetch all direct + bridged pairs
 */
async function fetchAllPairs(fetcher, tokenIn, tokenOut, bases, provider) {
  const requests = [];

  // Direct
  requests.push(
    fetcher.fetchPairData(tokenIn, tokenOut, provider).catch(() => null)
  );

  // Bridges
  for (const base of bases) {
    requests.push(
      fetcher.fetchPairData(tokenIn, base, provider).catch(() => null)
    );
    requests.push(
      fetcher.fetchPairData(base, tokenOut, provider).catch(() => null)
    );
  }

  const pairs = await Promise.all(requests);
  return pairs.filter(Boolean);
}
