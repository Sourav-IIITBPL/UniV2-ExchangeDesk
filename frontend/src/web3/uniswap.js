import { ethers } from "ethers";

export const UNISWAP_V2_FACTORY =
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"; // ETH mainnet

export const UNISWAP_V2_PAIR_ABI = [
  " function MINIMUM_LIQUIDITY() external pure returns (uint)",
  " function factory() external view returns (address)",
  " function token0() external view returns (address)",
  " function token1() external view returns (address)",
  " function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  " function price0CumulativeLast() external view returns (uint)",
  " function price1CumulativeLast() external view returns (uint)",
  " function kLast() external view returns (uint)",
  " function mint(address to) external returns (uint liquidity)",
  " function burn(address to) external returns (uint amount0, uint amount1)",
  " function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external",
  " function skim(address to) external",
  " function sync() external"
];

export const UNISWAP_V2_FACTORY_ABI = [
  "event PairCreated(address indexed token0, address indexed token1, address pair, uint)",

  "function getPair(address tokenA, address tokenB) external view returns (address pair)",
  "function allPairs(uint) external view returns (address pair)",
  "function allPairsLength() external view returns (uint)",
  "function feeTo() external view returns (address)",
  "function feeToSetter() external view returns (address)",
  "function createPair(address tokenA, address tokenB) external returns (address pair)"

];

export const UNISWAP_V2_ROUTER =
  "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // mainnet

export const UNISWAP_V2_ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts)",
  "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
  "function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) returns (uint[] memory)",
  "function swapExactETHForTokens(uint,address[],address,uint) payable returns (uint[] memory)",
  "function swapExactTokensForETH(uint,uint,address[],address,uint) returns (uint[] memory)",
  "function factory() external pure returns (address)",
  "function WETH() external pure returns (address)"
];

// ERC20 minimal ABI
export const erc20Abi = ["function decimals() view returns (uint8)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)"
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

  const [reserve0, reserve1, LastInteract] = await pair.getReserves();
  const token0 = await pair.token0();
  const token1 = await pair.token1();

  return {
    reserve0,
    reserve1,
    token0,
    token1,
    LastInteract
  }
}

// @dev - fucntion deriving the price  of the pair .
export async function derivePriceFromReserves(provider, reserves, baseToken, quoteToken) {
  const { reserve0, reserve1, token0, token1, } = reserves;

  // ERC20 minimal ABI
  const erc20Abi = ["function decimals() view returns (uint8)"];

  const token0Contract = new ethers.Contract(token0, erc20Abi, provider);
  const token1Contract = new ethers.Contract(token1, erc20Abi, provider);


  const [decimals0, decimals1] = await Promise.all([
    token0Contract.decimals(),
    token1Contract.decimals(),
  ]);

  // Normalize reserves   //@AUdit - can we do it in getpairRserves ??
  const r0 = Number(ethers.formatUnits(reserve0, decimals0));
  const r1 = Number(ethers.formatUnits(reserve1, decimals1));

  console.log("No. of token0 :", r0, "tokens");
  console.log("No. of token1 :", r1, "tokens");

  // Price logic
  if (baseToken.toLowerCase() === token0.toLowerCase()) {
    // base = token0, quote = token1
    return r1 / r0;
  } else if (baseToken.toLowerCase() === token1.toLowerCase()) {
    // base = token1, quote = token0
    return r0 / r1;
  } else {
    throw new Error("Base token not in this pair");
  }

}
export async function getSwapPreview(provider, amountIn, tokenIn, tokenOut, slippageBps // e.g. 50 = 0.5%
) {
  const MAX_Slippage_BPS = 10_000;
  const router = new ethers.Contract(
    UNISWAP_V2_ROUTER,
    UNISWAP_V2_ROUTER_ABI,
    provider
  );

  const path = [tokenIn, tokenOut];

  // 1. Get exact expected output
  const amounts = await router.getAmountsOut(amountIn, path);
  const amountOut = amounts[amounts.length - 1];

  // 2. Apply slippage
  const amountOutMin =
    (amountOut * BigInt(MAX_Slippage_BPS - slippageBps)) / BigInt(MAX_Slippage_BPS);

  // 3. formatting the amounts out as per their decimals

  // const tokenOut_Contract = new ethers.Contract(tokenOut,erc20Abi,provider);
  // const tokenOut_Decimals = await tokenOut_Contract.decimals();

  // const formatedAmoutOut = Number(ethers.formatUnits(amountOut, tokenOut_Decimals));
  // const formatedAMountOutMin = Number(ethers.formatUnits(amountOutMin, tokenOut_Decimals));

  // return {
  //     formatedAmoutOut,
  //     formatedAMountOutMin
  // };

  return {
    amountIn,
    amountOut,      // BigInt
    amountOutMin,   // BigInt
  };
}

// @Dev - swap mechanism 

export async function approveToken(signer, tokenAddress, spender, amount) {

  const token = new ethers.Contract(tokenAddress, erc20Abi, signer);
  const owner = await signer.getAddress();

  console.log("Owner approving:", owner);

  const currentAllowance = await token.allowance(owner, spender);

  if (currentAllowance >= amount) {
    return; // already approved
  }

  const tx = await token.approve(spender, amount);
  await tx.wait();
}

export async function executeSwapExactTokensForTokens(signer, amountIn, amountOutMin, tokenIn, tokenOut, recipient) {
  const router = new ethers.Contract(UNISWAP_V2_ROUTER, UNISWAP_V2_ROUTER_ABI, signer);

  const path = [tokenIn, tokenOut];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes

  const tx = await router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    recipient,
    deadline
  );

  return tx.wait();
}


// @dev ETH swaps .

export async function executeSwapExactETHForTokens(
  signer,
  amountOutMin,
  tokenOut,
  recipient,
  ethValue
) {
  const router = new ethers.Contract(
    UNISWAP_V2_ROUTER,
    UNISWAP_V2_ROUTER_ABI,
    signer
  );

  const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const path = [WETH, tokenOut];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const tx = await router.swapExactETHForTokens(
    amountOutMin,
    path,
    recipient,
    deadline,
    { value: ethValue }
  );

  return tx;
}

export async function executeSwapExactTokensForETH(
  signer,
  amountIn,
  amountOutMin,
  tokenIn,
  recipient
) {
  const router = new ethers.Contract(
    UNISWAP_V2_ROUTER,
    UNISWAP_V2_ROUTER_ABI,
    signer
  );

  const WETH = "0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2";
  const path = [tokenIn, WETH];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const tx = await router.swapExactTokensForETH(
    amountIn,
    amountOutMin,
    path,
    recipient,
    deadline
  );

  return tx.wait();
}
