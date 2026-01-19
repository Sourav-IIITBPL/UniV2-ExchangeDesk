import { Interface } from 'ethers'
import { getProvider } from './rpc.service.js'
import { chunkBlockRange } from '../utils/blocks.js'
import pairAbi from '../contracts/UniswapV2Pair.json' with { type: 'json' }

const iface = new Interface(pairAbi)

export async function getPairEvents({
    pairAddress,
    eventName,
    fromBlock,
    toBlock,
    chain
}) {
    const provider = getProvider(chain)

    const event = iface.getEvent(eventName)
    const ranges = chunkBlockRange(fromBlock, toBlock, 10)              // later remove this as per node provider 

    const results = []

    for (const [start, end] of ranges) {
        const logs = await provider.getLogs({
            address: pairAddress,
            fromBlock: start,
            toBlock: end,
            topics: [event.topicHash]
        })

        for (const log of logs) {
            const parsed = iface.parseLog(log)
            const args = {}

            for (const input of event.inputs) {
                const value = parsed.args[input.name]
                args[input.name] = value?.toString?.() ?? value
            }

            results.push({
                event: eventName,
                txHash: log.transactionHash,
                blockNumber: log.blockNumber,
                args
            })
        }
    }

    return results
}
