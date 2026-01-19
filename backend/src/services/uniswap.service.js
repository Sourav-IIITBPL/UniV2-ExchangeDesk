import { Contract } from "ethers";
import { getProvider } from "./rpc.service.js";
import addresses from "../config/addresses.js";
import factoryAbi from "../contracts/UniswapV2Factory.json" with { type: "json" };

function getFactory(chain) {
  const provider = getProvider(chain);
  const factoryAddress = addresses[chain]?.uniswapV2Factory;

  if (!factoryAddress) {
    throw new Error(`Uniswap factory not configured for chain: ${chain}`);
  }

  return new Contract(factoryAddress, factoryAbi, provider);
}

export async function getAllPairs(chain, limit, offset) {
  const factory = getFactory(chain);

  const total = await factory.allPairsLength();
  const start = offset;
  const end = Math.min(offset + limit, Number(total));

  const pairs = [];

  for (let i = start; i < end; i++) {
    const pair = await factory.allPairs(i);
    pairs.push(pair);
  }

  return {
    total: total.toString(),
    count: pairs.length,
    pairs,
  };
}

export async function checkPairExists(tokenA, tokenB, chain) {
  const factory = getFactory(chain);
  const pair = await factory.getPair(tokenA, tokenB);

  return pair !== "0x0000000000000000000000000000000000000000";
}
