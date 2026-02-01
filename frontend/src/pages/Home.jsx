import React, { useEffect, useState, useRef, useCallback, useMemo, memo, forwardRef } from "react";
import { TrendingUp, TrendingDown, Activity, Globe, Zap, ListFilter } from "lucide-react";
import { fetchAllPools } from "../services/pool.service";
import { PROTOCOLS_CONFIG, CHAINS } from "../services/api.js";
import { PoolRow ,getTokenIcon} from "./HomeHelper.jsx";

export default function Home() {
  const [protocolStats, setProtocolStats] = useState([]);
  const [pools, setPools] = useState([]);
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [selectedProtocol, setSelectedProtocol] = useState("uniswap"); // Default to uniswap
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);

  // --- 1. DATA FETCHING (Upper Boxes) ---https://api.llama.fi/summary/dexs/sushiswap --https://api.llama.fi/tvl/pancakeswap-amm
 useEffect(() => {
  const fetchStats = async () => {
    const results = await Promise.all(PROTOCOLS_CONFIG.map(async (p) => {
      try {
        // 1. Get current TVL (This endpoint returns a raw number, not JSON)
        const tvlRes = await fetch(`https://api.llama.fi/tvl/${p.slug}`);
        const tvlText = await tvlRes.text(); // Use .text() for the simple /tvl/ endpoint
        const currentTvl = parseFloat(tvlText) || 0;

        // 2. Fetch Volume and Change (Summary API)
        const res = await fetch(`https://api.llama.fi/summary/dexs/${p.slug}`);
        const data = await res.json();

        return {
          ...p, // Copy name, slug, logo from your config
          tvl: currentTvl, 
          vol: data?.total24h || 0,
          change: data?.change_1d || 0 
        };
      } catch (err) {
        console.error(`Error fetching ${p.slug}:`, err);
        return { ...p, tvl: 0, vol: 0, change: 0 };
      }
    }));
    setProtocolStats(results);
  };
  fetchStats();
}, []);

  // --- 2. INFINITE SCROLL LOGIC ---
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setHasMore(true);
    try {
      // If protocol is 'all', you might want a specific handler or just pass null
      const protoParam = selectedProtocol;
      const data = await fetchAllPools({ 
        chain: selectedChain, 
        protocol: protoParam, 
        lastTVL: null 
      });
      setPools(data.pairs || []);
      setHasMore(data.pairs?.length >= 10);
    } catch (err) {
      console.error("Fetch Error:", err);
      setPools([]);
    } finally {
      setLoading(false);
    }
  }, [selectedChain, selectedProtocol]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || pools.length === 0) return;
    
    const lastPool = pools[pools.length - 1];
    setLoading(true);
    try {
      const protoParam = selectedProtocol === "all" ? null : selectedProtocol;
      const data = await fetchAllPools({
        chain: selectedChain,
        protocol: protoParam,
        lastTVL: lastPool.rawReserveUSD
      });

      if (!data.pairs || data.pairs.length === 0) {
        setHasMore(false);
      } else {
        setPools((prev) => [...prev, ...data.pairs]);
      }
    } catch (err) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [pools, loading, hasMore, selectedChain, selectedProtocol]);

  // Observer Setup
  const lastElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);


  return (
   <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 p-4 md:p-8 font-sans selection:bg-blue-500/30">
  
  {/* BACKGROUND GRAPHIC: High-end ambient orbs */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
    <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full" />
  </div>
     {/* TOP SECTION: Protocol Horizontal Cards */}
<div className="relative z-10 mb-10">
  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 px-4 flex items-center gap-2">
    <Activity size={14} className="text-blue-500" /> Global Market Overview
  </h2>
  
  <div className="flex gap-6 overflow-x-auto pb-10 snap-x no-scrollbar px-4">
    {protocolStats.map((item) => {
      const isPositive = item.change >= 0;
      const themeColor = isPositive ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)';
      
      return (
        <div 
          key={item.slug} 
          className="group relative min-w-[340px] snap-start p-[1.5px] rounded-[2.5rem] transition-all duration-500 hover:scale-[1.03] active:scale-95"
        >
          {/* ANIMATED BORDER: Appears only on hover */}
          <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_4s_linear_infinite] blur-sm bg-[conic-gradient(from_0deg,transparent_60%,#3b82f6_80%,#60a5fa_90%,transparent_100%)]" 
               style={{ background: `conic-gradient(from 0deg, transparent 60%, ${themeColor} 80%, white 95%, transparent 100%)` }} />

          {/* MAIN GLASS CARD */}
          <div className="relative h-full w-full bg-[#0f1115]/90 backdrop-blur-2xl rounded-[2.5rem] p-7 border border-white/5 overflow-hidden">
            
            {/* GLASSY GLOW: Inner reflection/lighting */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
            
            {/* PERFORMANCE GLOW: Subtle corner color based on +/- */}
            <div className="absolute -top-16 -right-16 w-40 h-40 opacity-20 group-hover:opacity-40 transition-opacity duration-700 blur-[60px]"
                 style={{ backgroundColor: isPositive ? '#22c55e' : '#ef4444' }} />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-2xl">
                    <img 
                      src={item.icon} 
                      alt={item.name} 
                      className="w-9 h-9 object-contain relative z-10" 
                      onError={(e) => e.target.src = 'https://defillama.com/favicon.ico'}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-tight">{item.name}</h3>
                    <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase opacity-70">AMM Liquidity</span>
                  </div>
                </div>

                {/* PULSE DOT & PERCENTAGE MOVED TO THE RIGHT */}
                <div className="flex flex-col items-end gap-2">
                   <div className={`flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full border ${
                    isPositive 
                      ? 'text-green-400 bg-green-400/10 border-green-400/20' 
                      : 'text-red-400 bg-red-400/10 border-red-400/20'
                  }`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(item.change).toFixed(2)}%
                  </div>

                  {/* DYNAMIC PULSE DOT */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Live</span>
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                  </div>
                </div>
              </div>

              {/* DATA SECTION */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-3xl group-hover:border-white/10 transition-colors">
                  <p className="text-[10px] uppercase text-zinc-500 font-black mb-1 tracking-widest">Locked</p>
                  <p className="text-xl font-bold text-white tracking-tight">{formatCurrency(item.tvl)}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-3xl group-hover:border-white/10 transition-colors">
                  <p className="text-[10px] uppercase text-zinc-500 font-black mb-1 tracking-widest">24h Vol</p>
                  <p className="text-xl font-bold text-zinc-300 tracking-tight">{formatCurrency(item.vol)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

      {/* FILTER SECTION */}
      <div className="space-y-4 relative z-10 mb-8">
        {/* Network Filter */}
        <div className="flex flex-wrap gap-2 bg-[#141417]/60 backdrop-blur-md p-2 rounded-2xl border border-white/5 items-center">
          <div className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2 border-r border-white/10 mr-2">
            <Globe size={14}/> Network
          </div>
          {CHAINS.map(chain => (
            <button 
              key={chain.id}
              onClick={() => setSelectedChain(chain.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${selectedChain === chain.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-white/5 text-zinc-400'}`}
            >
              <img src={chain.logo} className="w-4 h-4" alt="" /> {chain.name}
            </button>
          ))}
        </div>

        {/* Protocol Filter */}
        <div className="flex flex-wrap gap-2 bg-[#141417]/60 backdrop-blur-md p-2 rounded-2xl border border-white/5 items-center">
          <div className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2 border-r border-white/10 mr-2">
            <ListFilter size={14}/> Protocol
          </div>
          {PROTOCOLS_CONFIG.map(proto => (
            <button 
              key={proto.slug}
              onClick={() => setSelectedProtocol(proto.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${selectedProtocol === proto.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'hover:bg-white/5 text-zinc-400'}`}
            >
              <img src={proto.icon} className="w-4 h-4 rounded-full" alt="" /> {proto.name}
            </button>
          ))}
        </div>
      </div>

     {/* MAIN TABLE CONTAINER */}
<div className="relative bg-[#0f1115] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl transition-all duration-500 hover:border-blue-500/20">
  
  {/* TABLE HEADER/TITLE BAR */}
  <div className="p-6 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
    <div className="flex items-center gap-3">
      <ListFilter size={18} className="text-blue-500" />
      <h3 className="font-bold text-lg tracking-tight text-white">Market Liquidity Pools</h3>
    </div>
    <div className="flex gap-2">
       <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-white/5">
         Live Updates
       </span>
    </div>
  </div>

  <div className="overflow-x-auto no-scrollbar">
    <table className="w-full text-left border-collapse min-w-[1000px]">
      {/* HEADER ROW */}
      <thead className="bg-[#141417] text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
        <tr>
          <th className="p-6 text-left">#  Active Pools </th>
          <th className="p-6 text-right">TVL</th>
          <th className="p-6 text-right">APR</th>
          <th className="p-6 text-right">Fee</th>
          <th className="p-6 text-right">Vol (24H)</th>
          <th className="p-6 text-right">Vol (30D)</th>
          <th className="p-6 text-right">V/T Ratio</th>
          <th className="p-6 text-right pr-8">TX (24H)</th>
        </tr>
      </thead>
      
      <tbody className="divide-y divide-white/[0.02]">
        {pools.map((pool, idx) => (
          <PoolRow 
            key={`${pool.id}-${idx}`}
            ref={idx === pools.length - 1 ? lastElementRef : null}
            pool={pool} 
            index={idx} 
            getTokenIcon={getTokenIcon} 
          />
        ))}
      </tbody>
    </table>
  </div>
</div>

        {/* LOADING INDICATOR AT BOTTOM */}
        {loading && (
          <div className="p-12 flex flex-col items-center gap-4 bg-black/20 backdrop-blur-sm">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 animate-spin rounded-full"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-purple-500 animate-reverse-spin rounded-full opacity-40"></div>
            </div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] animate-pulse">Syncing Blockchain Data...</p>
          </div>
        )}
      </div>
     );
}