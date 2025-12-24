import { ethers } from "ethers";

export const UNISWAP_V2_FACTORY =
    "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"; // ETH mainnet

export const UNISWAP_V2_PAIR_ABI = [
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function token0() view returns (address)",
    "function token1() view returns (address)",
];

export const UNISWAP_V2_FACTORY_ABI = [
    "function getPair(address tokenA, address tokenB) external view returns (address pair)",
    "function allPairsLength() external view returns (uint)",

];


//@dev - function to get the pair .
export async function getUniswapV2Pair(provider, tokenA, tokenB) {
    const factory = new ethers.Contract(
        UNISWAP_V2_FACTORY,
        UNISWAP_V2_FACTORY_ABI,
        provider
    );
    console.log("Factory contract returned:", factory);

    const pairAddress = await factory.getPair(tokenA, tokenB);
    console.log("Pair address returned:", pairAddress);

    // Address zero means pool does not exist
    if (pairAddress === ethers.ZeroAddress) {
        return null;
    }

    return pairAddress;
}

//@dev- function to fetch pair's reserve .
export async function getPairReserves(provider, pairAddress) {
    const pair = new ethers.Contract(
        pairAddress,
        UNISWAP_V2_PAIR_ABI,
        provider
    );
    console.log("Pair address returned in getPairRserve function:", pair);

    const [reserve0, reserve1] = await pair.getReserves();
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    return {
        reserve0,
        reserve1,
        token0,
        token1,
    };
}
