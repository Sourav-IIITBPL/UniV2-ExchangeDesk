import { getProvider } from "./rpc.service.js";

const provider = getProvider();
const block = await provider.getBlockNumber();

console.log("Current block:", block);
