import { Contract, formatUnits, parseUnits } from "ethers";
import { getProvider } from "./rpc.service.js";
import addresses from "../config/addresses.js";
import chains from "../config/chains.js";
import { checkPairExists } from "./uniswap.service.js";
// Use exchange_router ABI
import ExchangeRouterAbi from "../contracts/ExchangeDeskRouter.json" with { type: "json" };
// best path
import { getBestPath, getExactOutPath } from "../swapPathSDK/multihop.js";

// preview functions .

export async function getExactTokenInSwapQuote(
  chain,
  protocol,
  tokenIn,
  tokenOut,
  amountIn,
  TokenList,
) {
  const provider = getProvider(chain);
  const routerAddr = addresses[protocol]?.[chain]?.exchange_router;
  if (!routerAddr) throw new Error("Router not configured");
  const exchange_router = new Contract(routerAddr, ExchangeRouterAbi, provider);

  // building the best path for swap

  const getSDK = await getBestPath({
    BASES: TokenList, // this can be easily got as this function is aclled after chain an dprotocl selection , thus already populating top pools
    protocol: protocol,
    chainId: chains[chain].chainId,
    tokenInAddr: tokenIn,
    tokenOutAddr: tokenOut,
    amountIn: amountIn,
    provider: provider,
  });

  const path = getSDK?.path;

  if (!path) throw new Error("No valid Path found");

  try {
    // Fee calculation (0.01% = 1/10,000)
    const amountInBN = BigInt(amountIn);
    const fee = amountInBN / 10000n;
    const netAmountIn = amountInBN - fee;

    const amountsOut = await exchange_router.getAmountsOut(netAmountIn, path);

    return {
      amountIn: amountIn,
      amountOut: amountsOut[amountsOut.length - 1].toString(),
      fee: fee.toString(),
      path,
    };
  } catch (err) {
    throw new Error("Insufficient liquidity for this trade");
  }
}

export async function getExactTokenOutSwapQuote(
  chain,
  protocol,
  tokenIn,
  tokenOut,
  amountOut,
  TokenList,
) {
  const provider = getProvider(chain);
  const routerAddr = addresses[protocol]?.[chain]?.exchange_router;
  if (!routerAddr) throw new Error("Router not configured");
  const exchange_router = new Contract(routerAddr, ExchangeRouterAbi, provider);

  // building the best path for swap

  const getSDK = await getExactOutPath({
    BASES: TokenList,
    protocol: protocol,
    chainId: chains[chain].chainId,
    tokenInAddr: tokenIn,
    tokenOutAddr: tokenOut,
    amountOut: amountOut,
    provider: provider,
  });

  const path = getSDK?.path;

  if (!path) throw new Error("No valid Path found");

  try {
    // 1. Get how much Uniswap needs to produce that amountOut
    const amountsIn = await exchange_router.getAmountsIn(
      BigInt(amountOut),
      path,
    );
    const uniswapNeeds = BigInt(amountsIn[0]);

    // 2. Add  0.01% fee on top
    // If Uniswap needs 10,000, user must send 10,001 (so 1 goes to you, 10,000 to Uni)
    const fee = uniswapNeeds / 10000n;
    const totalUserMustSend = uniswapNeeds + fee;

    return {
      amountIn: totalUserMustSend.toString(),
      amountOut: amountOut,
      fee: fee.toString(),
      path,
    };
  } catch (err) {
    throw new Error("Insufficient liquidity for this trade");
  }
}
