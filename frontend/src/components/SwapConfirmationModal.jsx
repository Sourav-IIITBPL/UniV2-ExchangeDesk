// components/SwapConfirmationModal.jsx
export default function SwapConfirmationModal({
  isOpen, onClose, onConfirm,
  tokenIn, tokenOut, amountIn, amountOut,
  priceImpact, path, slippage
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-sm rounded-3xl p-6 border border-border shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold mb-6 text-center">Confirm Swap</h3>

        {/* Token Summary */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center bg-secondary p-3 rounded-2xl">
            <span className="text-2xl font-semibold">{amountIn}</span>
            <span className="font-bold">{tokenIn?.symbol}</span>
          </div>
          <div className="flex justify-center text-gray-500">↓</div>
          <div className="flex justify-between items-center bg-secondary p-3 rounded-2xl">
            <span className="text-2xl font-semibold text-primary">{amountOut}</span>
            <span className="font-bold">{tokenOut?.symbol}</span>
          </div>
        </div>

        {/* Trade Details */}
        <div className="space-y-2 text-sm text-gray-400 border-t border-border pt-4">
          <div className="flex justify-between">
            <span>Price Impact</span>
            <span className={parseFloat(priceImpact) > 2 ? 'text-red-500' : 'text-green-500'}>
              {priceImpact}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Max Slippage</span>
            <span>{slippage}%</span>
          </div>
          <div className="flex justify-between">
            <span>Route</span>
            <span className="text-xs truncate ml-4">
              {path.map(addr => tokenList.find(t => t.address === addr)?.symbol || "Unknown").join(' → ')}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:brightness-110 active:scale-95 transition-all"
          >
            Confirm Swap
          </button>
          <button onClick={onClose} className="w-full py-2 text-gray-500 hover:text-white transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
