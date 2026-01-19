import { getProvider } from "./rpc.service.js";

const blockCache = new Map();

export async function getBlockTimestamp(blockNumber, chain) {
  const key = `${chain}:${blockNumber}`;

  if (blockCache.has(key)) {
    return blockCache.get(key);
  }

  const provider = getProvider(chain);
  const block = await provider.getBlock(blockNumber);

  const ts = Number(block.timestamp);
  blockCache.set(key, ts);

  return ts;
}
