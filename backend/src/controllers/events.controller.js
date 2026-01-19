import { getPairEvents } from "../services/events.service.js";

export async function getSwapEvents(req, res, next) {
  try {
    const { pair, fromBlock, toBlock, chain = "ethereum" } = req.query;

    if (!pair || !fromBlock || !toBlock) {
      return res.status(400).json({
        error: "pair, fromBlock, toBlock required",
      });
    }

    const events = await getPairEvents({
      pairAddress: pair.toLowerCase(),
      eventName: "Swap",
      fromBlock: Number(fromBlock),
      toBlock: Number(toBlock),
      chain,
    });

    res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function getLiquidityEvents(req, res, next) {
  try {
    const { pair, fromBlock, toBlock, chain = "ethereum" } = req.query;

    if (!pair || !fromBlock || !toBlock) {
      return res.status(400).json({
        error: "pair, fromBlock, toBlock required",
      });
    }

    const mint = await getPairEvents({
      pairAddress: pair.toLowerCase(),
      eventName: "Mint",
      fromBlock: Number(fromBlock),
      toBlock: Number(toBlock),
      chain,
    });

    const burn = await getPairEvents({
      pairAddress: pair.toLowerCase(),
      eventName: "Burn",
      fromBlock: Number(fromBlock),
      toBlock: Number(toBlock),
      chain,
    });

    res.json({
      mint,
      burn,
    });
  } catch (err) {
    next(err);
  }
}
