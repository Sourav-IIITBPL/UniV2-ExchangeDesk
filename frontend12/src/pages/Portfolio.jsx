import { useEffect, useState } from "react";
import { useChain } from "../hooks/useChain";
import { useWallet } from "../hooks/useWallet";
import { fetchPortfolio } from "../services/portfolio.service";

export default function Portfolio() {
  const { chainId } = useChain();
  const { account } = useWallet();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!chainId || !account) return;
    fetchPortfolio({ chainId, user: account }).then(setData);
  }, [chainId, account]);

  if (!account) {
    return (
      <div className="bg-card p-4 rounded border border-border">
        Connect wallet to view portfolio.
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Token balances */}
      <div className="bg-card p-4 rounded border border-border">
        <h3 className="mb-3">Token Balances</h3>
        {data.tokens.map((t) => (
          <div key={t.symbol} className="flex justify-between text-sm">
            <span>{t.symbol}</span>
            <span>{t.balance}</span>
          </div>
        ))}
      </div>

      {/* LP positions */}
      <div className="bg-card p-4 rounded border border-border">
        <h3 className="mb-3">Liquidity Positions</h3>
        {data.liquidity.map((l, i) => (
          <div key={i} className="text-sm">
            <div>{l.pool}</div>
            <div className="text-gray-400">
              Share: {l.share} • Fees: ${l.feesEarnedUsd}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
