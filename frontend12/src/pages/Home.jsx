import { useEffect, useState } from "react";
import { useChain } from "../context/ChainContext";
import { fetchAllPools } from "../services/pool.service";

export default function Home() {
  const { chainId } = useChain();
  const [pools, setPools] = useState([]);

  useEffect(() => {
    if (!chainId) return;
    fetchAllPools({ chainId }).then(setPools);
  }, [chainId]);

  const totalTVL = pools.reduce((sum, p) => sum + p.tvlUsd, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded border border-border">
          <div className="text-sm text-gray-400">Total TVL</div>
          <div className="text-xl">${totalTVL.toLocaleString()}</div>
        </div>
        <div className="bg-card p-4 rounded border border-border">
          <div className="text-sm text-gray-400">Pools</div>
          <div className="text-xl">{pools.length}</div>
        </div>
        <div className="bg-card p-4 rounded border border-border">
          <div className="text-sm text-gray-400">Chain</div>
          <div className="text-xl">{chainId ?? "—"}</div>
        </div>
      </div>

      {/* Pools Table */}
      <div className="bg-card border border-border rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 text-left">Pool</th>
              <th className="text-right">TVL</th>
            </tr>
          </thead>
          <tbody>
            {pools.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="p-3">
                  {p.tokenA} / {p.tokenB}
                </td>
                <td className="text-right p-3">
                  ${p.tvlUsd.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
