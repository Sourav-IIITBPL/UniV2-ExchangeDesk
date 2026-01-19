import { getAllPairs, checkPairExists } from "../services/uniswap.service.js";
import { getPairDetails } from "../services/pair.service.js";

export async function listPairs(req, res, next) {
  try {
    const { limit = 10, offset = 0, chain = "ethereum" } = req.query;

    const data = await getAllPairs(chain, Number(limit), Number(offset));

    res.json(data);
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
