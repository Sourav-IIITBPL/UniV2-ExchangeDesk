
import React, { useEffect, useState, useRef, useCallback, useMemo, memo, forwardRef } from "react";
import { TrendingUp, TrendingDown, Activity, Globe, Zap, ListFilter } from "lucide-react";


 export const getTokenIcon = (symbol, address) => 
    `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;


// 1. FIXED: Added forwardRef to allow IntersectionObserver to attach to the DOM node
export const PoolRow = memo(forwardRef(({ pool, index, getTokenIcon }, ref) => (
  <tr 
    ref={ref} 
    className="hover:bg-blue-500/[0.03] transition-all duration-300 group border-b border-white/5 cursor-pointer"
  >
    {/* 1. POOLS (Assets) */}
    <td className="p-6">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-mono text-zinc-700 w-4">{index + 1}</span>
        <div className="flex -space-x-3 group-hover:-space-x-1 transition-all duration-500">
          <img 
            src={getTokenIcon(pool.tokenA, pool.tokenAAddress)} 
            className="w-9 h-9 rounded-full border-2 border-[#141417] bg-zinc-800 shadow-xl"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${pool.tokenA}&background=random&color=fff`; }}
            alt="" 
          />
          <img 
            src={getTokenIcon(pool.tokenB, pool.tokenBAddress)} 
            className="w-9 h-9 rounded-full border-2 border-[#141417] bg-zinc-800 shadow-xl"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${pool.tokenB}&background=random&color=fff`; }}
            alt="" 
          />
        </div>
        <div>
          <div className="font-bold flex items-center gap-2 text-sm text-white group-hover:text-blue-400 transition-colors">
            {pool.tokenA}<span className="text-zinc-600">/</span>{pool.tokenB}
            <Zap size={12} className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100" />
          </div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest opacity-60">
            {pool.protocol || 'V2 AMM'}
          </div>
        </div>
      </div>
    </td>

    {/* 2. TVL */}
    <td className="p-6 text-right font-mono text-sm text-white font-medium">
      {pool.tvl}
    </td>

    {/* 3. APR */}
    <td className="p-6 text-right">
      <span className="text-green-400 font-black font-mono text-sm bg-green-400/5 px-2 py-1 rounded-md border border-green-400/10">
        {pool.apr}
      </span>
    </td>

    {/* 4. FEE */}
    <td className="p-6 text-right font-mono text-zinc-400 text-xs">
      {pool.fee}
    </td>

    {/* 5. VOLUME (24H) */}
    <td className="p-6 text-right font-mono text-zinc-300 text-sm">
      {pool.vol1D}
    </td>

    {/* 6. VOLUME (30D) */}
    <td className="p-6 text-right font-mono text-zinc-500 text-xs">
      {pool.vol30D}
    </td>

    {/* 7. VOL/TVL RATIO */}
    <td className="p-6 text-right">
      <span className="font-mono text-blue-400/80 text-xs bg-blue-400/5 px-2 py-1 rounded border border-blue-400/10">
        {pool.volTvlRatio}
      </span>
    </td>

    {/* 8. TX (24H) */}
    <td className="p-6 text-right font-mono text-zinc-400 text-sm pr-8">
      {pool.tx24h}
    </td>
  </tr>
)));