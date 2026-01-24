
//BACKEND API CLIENT

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Backend API error");
  }

  return res.json();
}


// top Boxes - defiLama api

export const PROTOCOLS_CONFIG = [
  { name: "Uniswap V2", slug: "uniswap-v2", icon: "https://cryptologos.cc/logos/uniswap-uni-logo.png" },
  { name: "Sushiswap", slug: "sushiswap", icon: "https://cryptologos.cc/logos/sushiswap-sushi-logo.png" },
  { name: "PancakeSwap", slug: "pancakeswap", icon: "https://tokens.pancakeswap.finance/images/symbol/cake.png" },
  { name: "Quickswap", slug: "quickswap", icon: "https://assets.coingecko.com/coins/images/13970/small/quickswap.png" },
  { name: "BaseSwap", slug: "baseswap", icon: "https://baseswap.fi/images/baseswap-logo.png" }
];

export const CHAINS = [
  { 
    id: "ethereum", 
    name: "Ethereum", 
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" 
  },
  { 
    id: "polygon", 
    name: "Polygon", 
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png" 
  },
  { 
    id: "base", 
    name: "Base", 
    logo: "https://raw.githubusercontent.com/base-org/brand-kit/main/logo/symbol/Base_Symbol_Blue.png" 
  },
  { 
    id: "arbitrum", 
    name: "Arbitrum", 
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png" 
  },
  { 
    id: "avalanche", 
    name: "Avalanche", 
    logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png" 
  },
  { 
    id: "unichain", 
    name: "Unichain", 
    logo: "https://assets.unichain.org/icon.png" // Official Unichain Brand Icon
  },
  { 
    id: "bsc", 
    name: "BNB", 
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png" 
  },
  { 
    id: "optimism", 
    name: "Optimism", 
    logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png" 
  },
  { 
    id: "shibarium", 
    name: "Shibarium", 
    logo: "https://www.shibariumscan.io/images/network_icon.png" // Official Shibarium Explorer Icon
  }
];