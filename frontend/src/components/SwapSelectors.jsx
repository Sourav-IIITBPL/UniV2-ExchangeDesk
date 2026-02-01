import { useState } from "react";

// Generic Custom Dropdown for Chains and Protocols
function CustomSelector({ options, value, onChange, placeholder, type }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.id === value);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 bg-secondary border border-border rounded-xl hover:bg-border transition-all"
      >
        <div className="flex items-center gap-2">
          {selected ? (
            <>
              <img src={selected.logo || selected.icon} alt={selected.name} className="w-5 h-5 rounded-full" />
              <span className="font-medium text-sm">{selected.name}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </div>
        <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => {
                onChange(opt.id);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 p-3 hover:bg-secondary cursor-pointer transition-colors"
            >
              <img src={opt.logo || opt.icon} alt={opt.name} className="w-6 h-6 rounded-full" />
              <span className="text-sm font-medium">{opt.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const ChainSelector = ({ value, onChange, allchains }) => (
  <CustomSelector options={allchains} value={value} onChange={onChange} placeholder="Select Chain" />
);

export const ProtocolSelector = ({ value, onChange, allprotocols }) => (
  <CustomSelector options={allprotocols} value={value} onChange={onChange} placeholder="Select Protocol" />
);




export function TokenSelector({ tokens, selectedToken, onSelect, label, balance, amount, setAmount, disabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4 bg-secondary rounded-3xl border border-border mb-2 hover:border-primary/50 transition-colors">
      <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
        <span>{label}</span>
        <span>Balance: {balance || "0.00"}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="0.0"
          className="bg-transparent text-3xl outline-none w-full font-bold placeholder:text-gray-600"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={disabled}
        />
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-card hover:bg-border px-4 py-2 rounded-2xl shadow-sm transition-all border border-border min-w-[120px]"
        >
          {selectedToken ? (
            <>
              <img src={selectedToken.logo || `https://avatar.vercel.sh/${selectedToken.symbol}`} className="w-6 h-6 rounded-full" />
              <span className="font-bold">{selectedToken.symbol}</span>
            </>
          ) : (
            <span className="font-bold text-primary">Select</span>
          )}
          <span className="text-[10px] ml-auto">▼</span>
        </button>
      </div>

      {/* Token Search Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-card w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">Select a token</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="p-4">
              <input 
                type="text" 
                placeholder="Search by name or paste address" 
                className="w-full p-3 bg-secondary rounded-xl border border-border outline-none focus:border-primary"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {tokens.map((token) => (
                <div 
                  key={token.id || token.address}
                  onClick={() => {
                    onSelect(token);
                    setIsModalOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-secondary rounded-2xl cursor-pointer"
                >
                  <img src={token.logo || `https://avatar.vercel.sh/${token.symbol}`} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="font-bold">{token.symbol}</div>
                    <div className="text-xs text-gray-500">{token.name || "Token"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}