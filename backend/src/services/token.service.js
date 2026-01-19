import { Contract } from "ethers";
import { getProvider } from "./rpc.service.js";
import erc20Abi from "../contracts/ERC20.json" with { type: "json" };

const tokenCache = new Map();

function bytes32ToString(bytes32) {
  return (
    bytes32
      .replace(/00+$/, "")
      .match(/.{1,2}/g)
      ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
      .join("") || ""
  );
}

export async function getTokenMetadata(tokenAddress, chain) {
  const key = `${chain}:${tokenAddress}`;
  if (tokenCache.has(key)) return tokenCache.get(key);

  const provider = getProvider(chain);
  const token = new Contract(tokenAddress, erc20Abi, provider);

  let symbol;
  let decimals;

  try {
    // Standard ERC20
    symbol = await token.symbol();
  } catch {
    // bytes32 fallback
    const raw = await provider.call({
      to: tokenAddress,
      data: token.interface.encodeFunctionData("symbol"),
    });
    symbol = bytes32ToString(raw.slice(2));
  }

  decimals = Number(await token.decimals());

  const data = {
    address: tokenAddress.toLowerCase(),
    symbol,
    decimals,
  };

  tokenCache.set(key, data);
  return data;
}
