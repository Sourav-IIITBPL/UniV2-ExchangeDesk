import { CHAINS } from "../config/chains";
import { useChain } from "../context/ChainContext";

export default function ChainSelector() {
  const { chainId, selectChain } = useChain();

  return (
    <select
      className="w-full mb-3 p-2 bg-bg border border-border rounded"
      value={chainId || ""}
      onChange={(e) => selectChain(Number(e.target.value))}
    >
      <option value="" disabled>
        Select Chain
      </option>
      {Object.values(CHAINS).map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
