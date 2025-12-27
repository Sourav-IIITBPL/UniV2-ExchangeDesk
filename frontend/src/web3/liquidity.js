import { ethers } from "ethers";

import * as constants from "./uniswap.js";

const {
  UNISWAP_V2_ROUTER,
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V2_FACTORY,
  UNISWAP_V2_FACTORY_ABI,
  UNISWAP_V2_PAIR_ABI,
  erc20Abi
} = constants;


// ADD LIQUIDITY FUNCTIONALITY 

export async function getPairAndReserves(provider, tokenA, tokenB) {
  const factory = new ethers.Contract(
    UNISWAP_V2_FACTORY,
    UNISWAP_V2_FACTORY_ABI,
    provider
  );

  const pairAddress = await factory.getPair(tokenA, tokenB);
  if (pairAddress === ethers.ZeroAddress) {
    return { reserveA: 0n, reserveB: 0n, exists: false };
  }

  const pair = new ethers.Contract(pairAddress, UNISWAP_V2_PAIR_ABI, provider);
  const [r0, r1] = await pair.getReserves();
  const token0 = await pair.token0();

  return tokenA.toLowerCase() === token0.toLowerCase()
    ? { reserveA: r0, reserveB: r1, exists: true }
    : { reserveA: r1, reserveB: r0, exists: true };
}

export async function addLiquidity(
  signer,
  tokenA,
  tokenB,
  amountA,
  amountB,
  slippageBps,
  recipient
) {
  const router = new ethers.Contract(
    UNISWAP_V2_ROUTER,
    UNISWAP_V2_ROUTER_ABI,
    signer
  );

  const amountAMin = amountA * BigInt(10_000 - slippageBps) / 10_000n;
  const amountBMin = amountB * BigInt(10_000 - slippageBps) / 10_000n;

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  return router.addLiquidity(
    tokenA,
    tokenB,
    amountA,
    amountB,
    amountAMin,
    amountBMin,
    recipient,
    deadline
  );
}

export async function addLiquidityETH(
  signer,
  token,
  tokenAmount,
  ethAmount,
  slippageBps,
  recipient
) {
  const router = new ethers.Contract(
    UNISWAP_V2_ROUTER,
    UNISWAP_V2_ROUTER_ABI,
    signer
  );

  const tokenMin = tokenAmount * BigInt(10_000 - slippageBps) / 10_000n;
  const ethMin = ethAmount * BigInt(10_000 - slippageBps) / 10_000n;

  const deadline = Math.floor(Date.now() / 1000) + 600;

  return router.addLiquidityETH(
    token,
    tokenAmount,
    tokenMin,
    ethMin,
    recipient,
    deadline,
    { value: ethAmount }
  );
}


export async function ensureApproval(signer, token, amount) {
  const erc20 = new ethers.Contract(token, erc20Abi, signer);
  const owner = await signer.getAddress();
  const allowance = await erc20.allowance(owner, UNISWAP_V2_ROUTER);

  if (allowance < amount) {
    const tx = await erc20.approve(
      UNISWAP_V2_ROUTER,
      amount
    );
    await tx.wait();
  }
}

export async function removeLiquidity(
  signer,
  tokenA,
  tokenB,
  liquidity,
  slippageBps,
  recipient
) {
  const router = new ethers.Contract(
    UNISWAP_V2_ROUTER,
    UNISWAP_V2_ROUTER_ABI,
    signer
  );

  const provider = signer.provider;

  // 1. Get pair
  const factory = new ethers.Contract(
    UNISWAP_V2_FACTORY,
    UNISWAP_V2_FACTORY_ABI,
    provider
  );

  const pairAddress = await factory.getPair(tokenA, tokenB);
  if (pairAddress === ethers.ZeroAddress) {
    throw new Error("Pair does not exist");
  }

  // 2. Approve LP tokens
  const lpToken = new ethers.Contract(pairAddress, erc20Abi, signer);
  const owner = await signer.getAddress();

  const balance = await lpToken.balanceOf(owner);
  if (balance < liquidity) {
   alert("Insufficient LP token balance");
    throw new Error("Insufficient LP token balance");
  }
  const allowance = await lpToken.allowance(owner, UNISWAP_V2_ROUTER);
  if (allowance < liquidity) {
    const tx = await lpToken.approve(
      UNISWAP_V2_ROUTER,
      liquidity
    );
    await tx.wait();
  }

  // 3. Read reserves
  const pair = new ethers.Contract(pairAddress, UNISWAP_V2_PAIR_ABI, provider);
  const [r0, r1] = await pair.getReserves();
  const totalSupply = await pair.totalSupply();
  const token0 = await pair.token0();

  const [reserveA, reserveB] =
    tokenA.toLowerCase() === token0.toLowerCase()
      ? [r0, r1]
      : [r1, r0];

  // 4. Expected outputs
  const amountA = (liquidity * reserveA) / totalSupply;
  const amountB = (liquidity * reserveB) / totalSupply;

  const amountAMin = amountA * BigInt(10_000 - slippageBps) / 10_000n;
  const amountBMin = amountB * BigInt(10_000 - slippageBps) / 10_000n;

  const deadline = Math.floor(Date.now() / 1000) + 600;

  // 5. Remove liquidity
  return router.removeLiquidity(
    tokenA,
    tokenB,
    liquidity,
    amountAMin,
    amountBMin,
    recipient,
    deadline
  );
}


export async function removeLiquidityETH(
  signer,
  token,
  liquidity,
  slippageBps,
  recipient
) {
  const router = new ethers.Contract(
    UNISWAP_V2_ROUTER,
    UNISWAP_V2_ROUTER_ABI,
    signer
  );

  const provider = signer.provider;

  // 1. Get pair
  const factory = new ethers.Contract(
    UNISWAP_V2_FACTORY,
    UNISWAP_V2_FACTORY_ABI,
    provider
  );

  const pairAddress = await factory.getPair(
    token,
    await router.WETH()
  );

  if (pairAddress === ethers.ZeroAddress) {
    throw new Error("Pair does not exist");
  }

  // 2. Approve LP token
  const lpToken = new ethers.Contract(pairAddress, erc20Abi, signer);
  const owner = await signer.getAddress();

  const balance = await lpToken.balanceOf(owner);
  if (balance < liquidity) {
    alert("Insufficient LP token balance");
    throw new Error("Insufficient LP token balance");
  }

  const allowance = await lpToken.allowance(owner, UNISWAP_V2_ROUTER);
  if (allowance < liquidity) {
    const tx = await lpToken.approve(
      UNISWAP_V2_ROUTER,
      liquidity
    );
    await tx.wait();
  }

  // 3. Read reserves
  const pair = new ethers.Contract(pairAddress, UNISWAP_V2_PAIR_ABI, provider);
  const [r0, r1] = await pair.getReserves();
  const totalSupply = await pair.totalSupply();
  const token0 = await pair.token0();

  const [reserveToken, reserveETH] =
    token.toLowerCase() === token0.toLowerCase()
      ? [r0, r1]
      : [r1, r0];

  const amountToken = (liquidity * reserveToken) / totalSupply;
  const amountETH = (liquidity * reserveETH) / totalSupply;

  const amountTokenMin =
    amountToken * BigInt(10_000 - slippageBps) / 10_000n;
  const amountETHMin =
    amountETH * BigInt(10_000 - slippageBps) / 10_000n;

  const deadline = Math.floor(Date.now() / 1000) + 1200;

  return router.removeLiquidityETH(
    token,
    liquidity,
    amountTokenMin,
    amountETHMin,
    recipient,
    deadline
  );
}
