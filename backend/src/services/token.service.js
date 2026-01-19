import { Contract } from 'ethers'
import { getProvider } from './rpc.service.js'
import erc20Abi from '../contracts/ERC20.json' with { type: 'json' }

const tokenCache = new Map()

export async function getTokenMetadata(tokenAddress, chain) {
  const key = `${chain}:${tokenAddress}`

  if (tokenCache.has(key)) {
    return tokenCache.get(key)
  }

  const provider = getProvider(chain)
  const token = new Contract(tokenAddress, erc20Abi, provider)

  const [symbol, decimals] = await Promise.all([
    token.symbol(),
    token.decimals()
  ])

  const data = {
    address: tokenAddress.toLowerCase(),
    symbol,
    decimals: Number(decimals)
  }

  tokenCache.set(key, data)
  return data
}
