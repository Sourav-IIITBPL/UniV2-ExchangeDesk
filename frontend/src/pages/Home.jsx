import React, { useEffect, useState, useRef, useCallback, useMemo, memo, forwardRef } from "react";
import { TrendingUp, TrendingDown, Activity, Globe, Zap, ListFilter } from "lucide-react";
import { fetchAllPools } from "../services/pool.service";
import { PROTOCOLS_CONFIG, CHAINS } from "../services/api.js";

// 1. FIXED: Added forwardRef to allow IntersectionObserver to attach to the DOM node
const PoolRow = memo(forwardRef(({ pool, index, getTokenIcon }, ref) => (
  <tr 
    ref={ref} 
    className="hover:bg-white/[0.04] transition-all duration-300 group border-b border-white/5"
  >
    <td className="p-4 md:p-6">
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-zinc-600 hidden md:block">{index + 1}</span>
        <div className="flex -space-x-3">
          <img 
            src={getTokenIcon(pool.tokenA, pool.tokenAAddress)} 
            className="w-8 h-8 rounded-full border-2 border-[#141417] bg-zinc-800"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${pool.tokenA}&background=random&color=fff`; }}
            alt="" 
          />
          <img 
            src={getTokenIcon(pool.tokenB, pool.tokenBAddress)} 
            className="w-8 h-8 rounded-full border-2 border-[#141417] bg-zinc-800"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${pool.tokenB}&background=random&color=fff`; }}
            alt="" 
          />
        </div>
        <div>
          <div className="font-bold flex items-center gap-2 text-sm md:text-base">
            {pool.tokenA}<span className="text-zinc-600">/</span>{pool.tokenB}
            <Zap size={12} className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{pool.protocol || 'V2 AMM'}</div>
        </div>
      </div>
    </td>
    <td className="p-4 md:p-6 text-right font-mono text-sm">{pool.tvl}</td>
    <td className="p-4 md:p-6 text-right font-mono text-zinc-400 text-sm">{pool.vol1D}</td>
    <td className="p-4 md:p-6 text-right">
      <span className="text-green-400 font-bold font-mono text-sm">{pool.apr}</span>
    </td>
  </tr>
)));

export default function Home() {
  const [protocolStats, setProtocolStats] = useState([]);
  const [pools, setPools] = useState([]);
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [selectedProtocol, setSelectedProtocol] = useState("uniswap"); // Default to uniswap
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const getTokenIcon = (symbol, address) => 
    `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);

  // --- 1. DATA FETCHING (Upper Boxes) ---
  useEffect(() => {
    const fetchStats = async () => {
      const results = await Promise.all(PROTOCOLS_CONFIG.map(async (p) => {
        try {
          const res = await fetch(`https://api.llama.fi/summary/dexs/${p.slug}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          return {
            ...p,
            tvl: data.totalLiquidity || 0,
            vol: data.total24h || 0,
            change: data.change_1d || 0 
          };
        } catch (err) {
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
      const protoParam = selectedProtocol === "all" ? null : selectedProtocol;
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
      
      {/* BACKGROUND GRAPHIC */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* TOP SECTION: Protocol Horizontal Cards */}
      <div className="relative z-10 mb-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 px-2 flex items-center gap-2">
          <Activity size={14} className="text-blue-500" /> Global Market Overview
        </h2>
        
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar px-2">
          {protocolStats.map((item) => (
            <div 
              key={item.slug} 
              className="min-w-[300px] snap-start p-6 bg-[#141417]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] 
                         transition-all duration-500 ease-out hover:-translate-y-3 hover:border-blue-500/40 
                         hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.3)] group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/40 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain" 
                      onError={(e) => e.target.src = 'https://defillama.com/favicon.ico'}/>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{item.name}</h3>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Protocol Alpha</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${item.change >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                  {item.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(item.change).toFixed(2)}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Liquidity</p>
                  <p className="text-xl font-mono font-bold">{formatCurrency(item.tvl)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1">24H Volume</p>
                  <p className="text-xl font-mono font-bold text-zinc-300">{formatCurrency(item.vol)}</p>
                </div>
              </div>
            </div>
          ))}
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
              onClick={() => setSelectedProtocol(proto.slug)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${selectedProtocol === proto.slug ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'hover:bg-white/5 text-zinc-400'}`}
            >
              <img src={proto.icon} className="w-4 h-4 rounded-full" alt="" /> {proto.name}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="bg-[#141417] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-white/5 text-zinc-500 text-[10px] uppercase font-bold">
              <tr>
                <th className="p-6">Liquidity Pair</th>
                <th className="p-6 text-right">TVL</th>
                <th className="p-6 text-right">Volume (24h)</th>
                <th className="p-6 text-right">APR</th>
              </tr>
            </thead>
            <tbody>
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
    </div>
  );
}