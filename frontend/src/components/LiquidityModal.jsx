import { useState } from "react";

export default function LiquidityModal({ onConfirm }) {
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-card p-6 rounded-xl w-96">
        <input
          className="w-full p-2 mb-3 bg-bg border border-border rounded"
          placeholder="Token A amount"
          value={amountA}
          onChange={(e) => setAmountA(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 bg-bg border border-border rounded"
          placeholder="Token B amount"
          value={amountB}
          onChange={(e) => setAmountB(e.target.value)}
        />
        <button
          onClick={() => onConfirm(amountA, amountB)}
          className="w-full py-2 bg-primary rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
