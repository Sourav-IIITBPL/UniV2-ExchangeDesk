import { Contract } from "ethers";
import { EXCHANGE_DESK_ROUTER } from "../config/routers";
import ABI from "../abi/ExchangeDeskRouter.json";

export async function getExchangeDeskRouter(protocol, chain, signerOrProvider) {
  const address = EXCHANGE_DESK_ROUTER[protocol]?.[chain];
  if (!address) throw new Error("Router not configured");
  return new Contract(address, ABI, signerOrProvider);
}
