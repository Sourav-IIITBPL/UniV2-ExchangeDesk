import { TOKENS } from "../config/tokens";

export default function TokenSelector({ chainId, value, onChange, label }) {
  if (!chainId) {
    return (
      <div className="p-3 bg-border rounded text-sm">Select chain first</div>
    );
  }

  return (
    <div className="mb-3">
      <label className="text-xs text-gray-400">{label}</label>
      <select
        className="w-full p-2 bg-bg border border-border rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Select token
        </option>
        {TOKENS[chainId]?.map((t) => (
          <option key={t.address} value={t.address}>
            {t.symbol}
          </option>
        ))}
      </select>
    </div>
  );
}
