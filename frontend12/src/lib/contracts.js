import { Contract } from "ethers";
import { getSigner } from "./signer";
import { EXCHANGE_DESK_ROUTER } from "../config/routers";
import ABI from "../abi/ExchangeDeskRouter.json";

export async function getExchangeDeskRouter(chainId) {
  const signer = await getSigner();
  const address = EXCHANGE_DESK_ROUTER[chainId];
  return new Contract(address, ABI, signer);
}
