import { getCandles } from "../services/candles.service.js";

export async function getPairCandles(req, res, next) {
  try {
    const {
      pair,
      fromBlock,
      toBlock,
      interval,
      chain = "ethereum",
    } = req.query;

    if (!pair || !fromBlock || !toBlock || !interval) {
      return res.status(400).json({
        error: "pair, fromBlock, toBlock, interval required",
      });
    }

    const candles = await getCandles({
      pair: pair.toLowerCase(),
      fromBlock: Number(fromBlock),
      toBlock: Number(toBlock),
      interval: Number(interval),
      chain,
    });

    res.json(candles);
  } catch (err) {
    next(err);
  }
}
