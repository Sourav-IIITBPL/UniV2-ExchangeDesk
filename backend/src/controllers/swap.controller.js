import {
  getExactTokenInSwapQuote,
  getExactTokenOutSwapQuote,
} from "../services/swap.service.js";

export async function getpreviewExactInSwap(req, res, next) {
  try {
    const {
      chain = "ethereum",
      protocol = "uniswap",
      tokenIn = 0x00,
      tokenOut = 0x00,
      amountIn = 0,
      TokenList = [],
    } = req.query;

    const preview = await getExactTokenInSwapQuote(
      chain,
      protocol,
      tokenIn,
      tokenOut,
      amountIn,
      TokenList,
    );

    res.json(preview);
  } catch (err) {
    next(err);
  }
}

export async function getpreviewExactOutSwap(req, res, next) {
  try {
    const {
      chain = "ethereum",
      protocol = "uniswap",
      tokenIn = 0x00,
      tokenOut = 0x00,
      amountOut = 0,
      TokenList = [],
    } = req.query;

    const preview = await getExactTokenOutSwapQuote(
      chain,
      protocol,
      tokenIn,
      tokenOut,
      amountOut,
      TokenList,
    );

    res.json(preview);
  } catch (err) {
    next(err);
  }
}
