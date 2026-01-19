import { getGlobalStats } from '../services/stats.service.js'

export async function getStats(req, res, next) {
  try {
    const {
      fromBlock,
      toBlock,
      chain = 'ethereum'
    } = req.query

    if (!fromBlock || !toBlock) {
      return res.status(400).json({
        error: 'fromBlock and toBlock required'
      })
    }

    const stats = await getGlobalStats({
      fromBlock: Number(fromBlock),
      toBlock: Number(toBlock),
      chain,
      pairLimit: 50
    })

    res.json(stats)
  } catch (err) {
    next(err)
  }
}
