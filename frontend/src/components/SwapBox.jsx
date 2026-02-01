import { useEffect, useState,useCallback } from "react";
import {fetchAllPools} from "../services/pool.service.js";
import {previewExactIn,swapExactOut,swapExactIn,previewExactOut} from "../services/swap.service.js";

import {TokenSelector,ChainSelector,ProtocolSelector} from "./SwapSelectors.jsx";
import SwapConfirmationModal from "./SwapConfirmationModal.jsx";

import {apiGet,PROTOCOLS_CONFIG,CHAINS} from "../services/api.js";

import debounce from "lodash/debounce"; // Recommended: npm install lodash

// following thing is to be done in swap 
// user will firstly connects the wallet otherwise  just waring shows at bottom or upper  that wallet is not connected however other actions are not blocked 
// user will firstly select the protocol , if not seleceted then a warning before further proceed. other actions blocked . no further proceced 
// user then selects the chain , if not then warning shows and not allowed further
// then as soon as the prootcl and chain are choosen , then the tokenaddresses fills up with top 50 most liquidity pool tokens ..
// so two tokens are choosen each tokenchooser is having 50 tokens but as user scrolls down withing the chooser , the token list grows up ..
// after token choosen , then as soon as user  puts  amoutn in tokenIn , the previewswapIn is called and output is shown on tokenOut section .
// simialry opposite if amount is put on tkenOut .
// then there will be a scroller for slippage choosing from 0 to 5 % .. with pariicular stops at specific points mentioend like 0.5 , 1 ,1.5 etc .. this is further choosen by user 
// and then the swap button for final swap the button should be such that if user has given input in toknIn section then exactIn event is fired other wise opposite . moerover if one of the  seleceted token is eth then swapExactEThTOtoken and vise versa is called .
// then finally just before the swap execute , a tmeprey full confirmation page(inside same page themproray conirmation) pops up and as user confirsm the transaction ..the traction executes.
// moreover inside the selceted tokens (in and out) balances of wallet must also shows up ..

// fully professional ..


export default function SwapBox() {
  const [chain, setChain] = useState("");
  const [protocol, setProtocol] = useState("");
  const [tokenIn, setTokenIn] = useState(null);
  const [tokenOut, setTokenOut] = useState(null);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [lastInput, setLastInput] = useState("in"); // Tracks which field user typed in

  const [showModal, setShowModal] = useState(false);
const [warning, setWarning] = useState("");

  // 1. Fetch Top 50 Tokens on Protocol/Chain Change
  useEffect(() => {
    if (chain && protocol) {
      const loadTokens = async () => {
        const data = await fetchAllPools({ chain, protocol, limit: 50 });
        // Use a Set to avoid duplicate token addresses
        const uniqueAddrs = new Set();
        data.pairs.forEach(p => {
          uniqueAddrs.add(p.token0.id);
          uniqueAddrs.add(p.token1.id);
        });
        setTokenList(Array.from(uniqueAddrs));
      };
      loadTokens();
    }
  }, [chain, protocol]);

  // 2. Automated Preview Logic (Debounced)
  const getQuote = useCallback(debounce(async (val, type) => {
    if (!val || !tokenIn || !tokenOut) return;
    setLoading(true);
    if (type === "in") {
      const res = await previewExactIn({ chain, protocol, tokenIn, tokenOut, amountIn: val, TokenList: tokenList });
      setAmountOut(res.amountOut);
    } else {
      const res = await previewExactOut({ chain, protocol, tokenIn, tokenOut, amountOut: val, TokenList: tokenList });
      setAmountIn(res.amountIn);
    }
    setLoading(false);
  }, 500), [chain, protocol, tokenIn, tokenOut, tokenList]);

  useEffect(() => {
    if (lastInput === "in") getQuote(amountIn, "in");
  }, [amountIn, getQuote]);

  useEffect(() => {
    if (lastInput === "out") getQuote(amountOut, "out");
  }, [amountOut, getQuote]);



  // actual swap logic 

  const handleSwapInitiation = () => {
  // 1. Validation Logic
  if (!account) return setWarning("Please connect your wallet first.");
  if (!protocol) return setWarning("Select a protocol to continue.");
  if (!chain) return setWarning("Select a chain network.");
  if (!amountIn || !amountOut) return setWarning("Enter an amount.");
  
  setWarning(""); // Clear warnings
  setShowModal(true); // Open the Confirmation Page
};




const executeTransaction = async () => {
  setLoading(true);
  try {
     // Trigger the actual SDK swap logic here
     handleSwap();
     setShowModal(false);
     alert("Transaction Sent!");
  } catch (err) {
     setWarning("Transaction Failed: " + err.message);
  } finally {
     setLoading(false);
  }
};


const handleSwap = async () => {
  const isNative = tokenIn === "0x000..." || tokenOut === "0x000...";
  
  if (lastInput === "in") {
    // If tokenIn is ETH, call swapExactETHForTokens, else swapExactTokensForTokens
    await swapExactIn({ chain, protocol, path, amountIn, isNative });
  } else {
    // Exact Out logic
    await swapExactOut({ chain, protocol, path, amountOut, isNative });
  }
}

  return (
    <div className="w-full max-w-md p-1 bg-gradient-to-b from-border to-transparent rounded-[28px]">
      <div className="bg-card p-4 rounded-[26px] shadow-2xl">
        <h2 className="text-lg font-bold mb-4 px-2">Swap</h2>
        
       {/* Selectors Row */}
      <div className="flex gap-2 mb-6">
        <ChainSelector 
          value={chain} 
          onChange={(id) => { setChain(id); setTokenIn(null); setTokenOut(null); }} 
          allchains={CHAINS} 
        />
        <ProtocolSelector 
          value={protocol} 
          onChange={(id) => setProtocol(id)} 
          allprotocols={PROTOCOLS_CONFIG} 
        />
      </div>

      {/* Input Section */}
      <TokenSelector
        label="Sell"
        tokens={tokenList}
        selectedToken={tokenIn}
        onSelect={setTokenIn}
        amount={amountIn}
        setAmount={(v) => { setAmountIn(v); setLastInput("in"); }}
        disabled={!chain || !protocol}
      />

      {/* Swap Button Icon */}
      <div className="flex justify-center -my-4 relative z-10">
        <button 
          onClick={() => { /* Logic to flip tokenIn and tokenOut */ }}
          className="bg-secondary border-4 border-card p-2 rounded-2xl hover:scale-110 transition-transform shadow-lg"
        >
          <span className="text-primary text-xl">↓</span>
        </button>
      </div>

      {/* Output Section */}
      <TokenSelector
        label="Buy"
        tokens={tokenList}
        selectedToken={tokenOut}
        onSelect={setTokenOut}
        amount={amountOut}
        setAmount={(v) => { setAmountOut(v); setLastInput("out"); }}
        disabled={!chain || !protocol}
      />

        {/* Slippage Slider */}
        <div className="mt-4 px-2">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Max Slippage</span>
            <span className="text-primary font-bold">{slippage}%</span>
          </div>
          <input 
            type="range" min="0.1" max="5" step="0.5" 
            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
          />
        </div>

        <button 
          disabled={!chain || !protocol || loading}
          className="w-full mt-6 py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 disabled:bg-gray-700 transition-all"
        >
          {!protocol ? "Select Protocol" : loading ? "Finding Best Path..." : "Swap Now"}
        </button>
      </div>
    </div>
  );
}