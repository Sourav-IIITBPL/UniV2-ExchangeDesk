export default function PoolTable({ pools, actionLabel, onAction }) {
  return (
    <div className="bg-card border border-border rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="p-3 text-left">Pool</th>
            <th>Chain</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {pools.map((p) => (
            <tr key={p.id} className="border-b border-border">
              <td className="p-3">
                {p.tokenA}/{p.tokenB}
              </td>
              <td>{p.chain}</td>
              <td>
                <button
                  onClick={() => onAction(p)}
                  className="px-3 py-1 bg-primary rounded"
                >
                  {actionLabel}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
