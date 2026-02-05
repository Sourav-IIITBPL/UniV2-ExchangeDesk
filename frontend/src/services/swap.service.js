import { apiGet } from "./api";
import { getExchangeDeskRouter } from "../lib/contracts";
import { Contract, MaxUint256 } from "ethers";


// Simple ERC20 ABI for allowance/approval
const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

/** * Checks if the router is allowed to spend tokens, and requests approval if not.
 * Skipping this causes the "Actual Swap" to fail immediately.
 */
async function ensureAllowance(signer, tokenAddress, spenderAddress, amount) {
  const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);
  const userAddress = await signer.getAddress();

  const allowance = await tokenContract.allowance(userAddress, spenderAddress);

  if (allowance < BigInt(amount)) {
    console.log("Requesting approval...");
    const tx = await tokenContract.approve(spenderAddress, MaxUint256); // Approve max for better UX
    await tx.wait();
    console.log("Approval confirmed.");
  }
}

// get previews from the backend and the actual swap is provided by the frontend . thus backend - READ ONLY , frontend - EXECUTION AND WRITE

// --- PREVIEW FUNCTIONS (READ ONLY) ---

export async function previewExactIn({
  chain,
  protocol,
  tokenIn,
  tokenOut,
  amountIn,
  TokenList,
}) {
  const path = `/swap/previewExactIn?chain=${chain}&protocol=${protocol}&tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${amountIn}&TokenList=${JSON.stringify(TokenList)}`;
  return await apiGet(path);
}

export async function previewExactOut({
  chain,
  protocol,
  tokenIn,
  tokenOut,
  amountOut,
  TokenList,
}) {
  const path = `/swap/previewExactOut?chain=${chain}&protocol=${protocol}&tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountOut=${amountOut}&TokenList=${JSON.stringify(TokenList)}`;
  return await apiGet(path);
}

// exact swaps after preview i.e also after finnest path selction from preview functions . implementaion of total 6 swap functions ,supported by exchnageRouter

// weth is shown up in frontend in ui when user selects the native eth on ethereum chain and any protocls .. as internally the path should be with weth errc-20 tokens ..

// --- EXECUTION FUNCTIONS (WRITE) ---

export async function getExactTokensForTokens(
  signer,
  chain,
  protocol,
  amountIn,
  slippage,
  path,
) {
  const exchange_router = await getExchangeDeskRouter(protocol, chain, signer);
  const routerAddress = await exchange_router.getAddress();
  const recipient = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 15;
  const slippageBPS = Math.floor(slippage * 100);

  // 1. Approval Check
  await ensureAllowance(signer, path[0], routerAddress, amountIn);

  // 2. Execute Swap
  try {
    const tx = await exchange_router.swapExactTokensForTokens(
      amountIn,
      slippageBPS,
      path,
      recipient,
      deadline,
    );
    const receipt = await tx.wait();
    return receipt;
  } catch (err) {
    throw new Error(`Swap failed: ${err.reason || err.message}`);
  }
}

export async function getExactETHForTokens(
  signer,
  chain,
  protocol,
  amountIn,
  slippage,
  path,
) {
  const exchange_router = await getExchangeDeskRouter(protocol, chain, signer);
  const recipient = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 15;
  const slippageBPS = Math.floor(slippage * 100);

  // No approval needed for native ETH
  try {
    const tx = await exchange_router.swapExactETHForTokens(
      slippageBPS,
      path,
      recipient,
      deadline,
      { value: amountIn }, // Send the ETH in the transaction
    );
    return await tx.wait();
  } catch (err) {
    throw new Error(`Swap failed: ${err.reason || err.message}`);
  }
}

export async function getExactTokensForETH(
  signer,
  chain,
  protocol,
  amountIn,
  slippage,
  path,
) {
  const exchange_router = await getExchangeDeskRouter(protocol, chain, signer);
  const routerAddress = await exchange_router.getAddress();
  const recipient = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 15;
  const slippageBPS = Math.floor(slippage * 100);

  await ensureAllowance(signer, path[0], routerAddress, amountIn);

  try {
    const tx = await exchange_router.swapExactTokensForETH(
      amountIn,
      slippageBPS,
      path,
      recipient,
      deadline,
    );
    return await tx.wait();
  } catch (err) {
    throw new Error(`Swap failed: ${err.reason || err.message}`);
  }
}

//  { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
//       { "internalType": "uint256", "name": "slippageBPS", "type": "uint256" },
//       { "internalType": "address[]", "name": "path", "type": "address[]" },
//       { "internalType": "address", "name": "to", "type": "address" },
//       { "internalType": "uint256", "name": "deadline", "type": "uint256" }

/** 4. Buy Exact Tokens with Tokens (Input is "amountInMax") */
export async function getTokensForExactTokens(
  signer,
  chain,
  protocol,
  amountOut,
  amountInMax,
  slippage,
  path,
) {
  const exchange_router = await getExchangeDeskRouter(protocol, chain, signer);
  const routerAddress = await exchange_router.getAddress();
  const recipient = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 15;
  const slippageBPS = Math.floor(slippage * 100);

  // We must approve the MAXIMUM we are willing to spend
  await ensureAllowance(signer, path[0], routerAddress, amountInMax);

  const tx = await exchange_router.swapTokensForExactTokens(
    amountOut,
    slippageBPS,
    path,
    recipient,
    deadline,
  );
  return await tx.wait();
}

/** 5. Buy Exact ETH with Tokens */
export async function swapTokensForExactETH(
  signer,
  chain,
  protocol,
  amountOut,
  amountInMax,
  slippage,
  path,
) {
  const exchange_router = await getExchangeDeskRouter(protocol, chain, signer);
  const routerAddress = await exchange_router.getAddress();
  const recipient = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 15;
  const slippageBPS = Math.floor(slippage * 100);

  // We must approve the MAXIMUM we are willing to spend
  await ensureAllowance(signer, path[0], routerAddress, amountInMax);

  const tx = await exchange_router.swapTokensForExactETH(
    amountOut,
    slippageBPS,
    path,
    recipient,
    deadline,
  );
  return await tx.wait();
}

/** 6. Buy Exact Tokens with ETH */
export async function getETHForExactTokens(
  signer,
  chain,
  protocol,
  amountOut,
  amountInMax,
  slippage,
  path,
) {
  const exchange_router = await getExchangeDeskRouter(protocol, chain, signer);
  const recipient = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 15;
  const slippageBPS = Math.floor(slippage * 100);

  const tx = await exchange_router.swapETHForExactTokens(
    amountOut,
    slippageBPS,
    path,
    recipient,
    deadline,
    { value: amountInMax }, // User provides max ETH, unused portion is usually refunded by Router
  );
  return await tx.wait();
}
