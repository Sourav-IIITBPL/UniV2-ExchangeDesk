import { getAllPairs } from './uniswap.service.js'
import { getPairDetails } from './pair.service.js'
import { getPairEvents } from './events.service.js'

export async function getGlobalStats({
  fromBlock,
  toBlock,
  chain ,
  pairLimit
}) {
  // 1. Fetch pairs (bounded)
  const { pairs } = await getAllPairs(chain, pairLimit, 0)                //destructuring 

  let totalTVL = 0
  let totalSwaps = 0
  let totalVolume = 0


  // recording stats for all pairs/pools from all swap events per pair  occurred from `fromBlock to toBlock` .

  for (const pair of pairs) {
    // 2. TVL
    const details = await getPairDetails(pair, chain)
    totalTVL += details.tvl

    // 3. Swap events
    const swaps = await getPairEvents({
      pairAddress: pair,
      eventName: 'Swap',
      fromBlock,
      toBlock,
      chain
    })

    totalSwaps += swaps.length

    for (const swap of swaps) {
      const {
        amount0In,
        amount1In,
        amount0Out,
        amount1Out
      } = swap.args

      if (amount0In !== '0') {
        totalVolume += Number(amount0In)
      } else if (amount1In !== '0') {
        totalVolume += Number(amount1In)
      }
    }
  }

  return {
    pairsIndexed: pairs.length,
    totalTVL,
    totalSwaps,
    totalVolume
  }
}
