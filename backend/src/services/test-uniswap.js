import { getAllPairs, checkPairExists } from "./uniswap.service.js";

const pairs_Eth = await getAllPairs("ethereum", 10, 0);
console.log("ethereum pairs:", pairs_Eth);

const pairs_Arb = await getAllPairs("arbitrum", 10, 0);
console.log("arbitrum pairs:", pairs_Arb);

const pairs_Poly = await getAllPairs("polygon", 10, 0);
console.log("polygon pairs:", pairs_Poly);

const weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

const exists = await checkPairExists(weth, usdc, "ethereum");
console.log("WETH/USDC exists on ETH:", exists);
