import {
  getAllPairs,
  getAllPairsLength,
  checkPairExists,
  getTopPairsByLiquidity,
} from "../services/uniswap.service.js";
import { getPairDetails } from "../services/pair.service.js";

export async function listPairs(req, res, next) {
  try {
    const {
      limit = 20,
      chain = "polygon",
      protocol = "uniswap",
      lastTVL = null,
    } = req.query;

    // before wallet connect we use THeGraph to fetch the top pools by liquidity ,on other chains the logic is same as before
    const data = await getTopPairsByLiquidity(chain, protocol, limit, lastTVL);
    const totalPairs = await getAllPairsLength(chain, protocol);
    res.json({
      total: totalPairs,
      count: data.length,
      pairs: data, // This sends the full objects
    });
  } catch (err) {
    next(err);
  }
}

export async function checkPair(req, res, next) {
  try {
    const { tokenA, tokenB, chain = "ethereum" } = req.query;

    if (!tokenA || !tokenB) {
      return res.status(400).json({
        error: "tokenA and tokenB are required",
      });
    }

    const exists = await checkPairExists(
      tokenA.toLowerCase(),
      tokenB.toLowerCase(),
      chain,
    );

    res.json({
      tokenA: tokenA.toLowerCase(),
      tokenB: tokenB.toLowerCase(),
      exists,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPairByAddress(req, res, next) {
  try {
    const { pairAddress } = req.params;
    const { chain = "ethereum" } = req.query;

    if (!pairAddress) {
      return res.status(400).json({ error: "pairAddress required" });
    }

    const data = await getPairDetails(pairAddress.toLowerCase(), chain);

    res.json(data);
  } catch (err) {
    next(err);
  }
}
