import { useState } from "react";
import { useChain } from "../hooks/useChain";
import { useRouter } from "../hooks/useRouter";
import { useWallet } from "../hooks/useWallet";
import { useDeadline } from "../hooks/useDeadline";
import ChainSelector from "./ChainSelector";
import TokenSelector from "./TokenSelector";
import { swapExactTokensForTokens } from "../services/swap.service";

export default function SwapBox() {
  const { chainId } = useChain();
  const router = useRouter(chainId);
  const { account } = useWallet();
  const deadline = useDeadline();

  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountIn, setAmountIn] = useState("");

  const handleSwap = async () => {
    if (!router || !account) return;

    await swapExactTokensForTokens({
      router,
      amountIn,
      amountOutMin: 0, // UI-calculated later
      path: [tokenIn, tokenOut],
      to: account,
      deadline,
    });
  };

  return (
    <div className="w-full max-w-md bg-card p-5 rounded-xl border border-border">
      <ChainSelector />

      <TokenSelector
        chainId={chainId}
        label="From"
        value={tokenIn}
        onChange={setTokenIn}
      />

      <input
        className="w-full p-2 mb-3 bg-bg border border-border rounded"
        placeholder="Amount"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
      />

      <TokenSelector
        chainId={chainId}
        label="To"
        value={tokenOut}
        onChange={setTokenOut}
      />

      <button
        onClick={handleSwap}
        className="w-full mt-4 py-3 bg-primary rounded"
      >
        Swap
      </button>
    </div>
  );
}
