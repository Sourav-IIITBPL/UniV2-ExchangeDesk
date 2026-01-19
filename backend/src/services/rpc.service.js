import 'dotenv/config'
import { JsonRpcProvider } from 'ethers'
import chains from '../config/chains.js'

const providers = new Map()

export function getProvider(chain) {
  if (providers.has(chain)) {
    return providers.get(chain)
  }

  const config = chains[chain]
  if (!config?.rpcUrl) {
    throw new Error(`RPC not configured for chain: ${chain}`)
  }

  const provider = new JsonRpcProvider(config.rpcUrl)
  providers.set(chain, provider)

  return provider
}
