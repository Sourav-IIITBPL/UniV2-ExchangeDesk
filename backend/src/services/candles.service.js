import { getPairEvents } from './events.service.js'
import { getBlockTimestamp } from './block.service.js'

export async function getCandles({
  pair,
  fromBlock,
  toBlock,
  interval, // seconds
  chain
}) {
  const swaps = await getPairEvents({
    pairAddress: pair,
    eventName: 'Swap',
    fromBlock,
    toBlock,
    chain
  })

  const candles = new Map()

  for (const swap of swaps) {
    const ts = await getBlockTimestamp(swap.blockNumber, chain)
    const bucket = Math.floor(ts / interval) * interval                                  //e.g - interval=300 and timestamp = 1760000 then buckets will be 1760000,1760300,1760600 etc 

    const {
      amount0In,
      amount1In,
      amount0Out,
      amount1Out
    } = swap.args

    // infer price: which side was traded
    let price = 0
    let volume = 0

    if (amount0In !== '0' && amount1Out !== '0') {
      price = Number(amount1Out) / Number(amount0In)
      volume = Number(amount0In)
    } else if (amount1In !== '0' && amount0Out !== '0') {
      price = Number(amount0Out) / Number(amount1In)
      volume = Number(amount1In)
    } else {
      continue
    }

    if (!candles.has(bucket)) {
      candles.set(bucket, {
        time: bucket,
        open: price,
        high: price,
        low: price,
        close: price,
        volume
      })
    } else {
      const c = candles.get(bucket)
      c.high = Math.max(c.high, price)
      c.low = Math.min(c.low, price)
      c.close = price
      c.volume += volume
    }
  }

  return Array.from(candles.values()).sort(
    (a, b) => a.time - b.time
  )
}
