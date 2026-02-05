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
  {
    name: "UniSwap",
    id: "uniswap",
    slug: "uniswap-v2",
    icon: "https://icons.llamao.fi/icons/protocols/uniswap-v2?w=55&h=55",
  },
  {
    name: "SushiSwap",
    id: "sushi",
    slug: "sushiswap",
    icon: "https://icons.llamao.fi/icons/protocols/sushiswap?w=55&h=55",
  },
  {
    name: "PancakeSwap",
    id: "pancake",
    slug: "pancakeswap-amm",
    icon: "https://icons.llamao.fi/icons/protocols/pancakeswap-amm?w=55&h=55",
  },
  {
    name: "QuickSwap",
    id: "quickswap",
    slug: "quickswap",
    icon: "https://icons.llamao.fi/icons/protocols/quickswap?w=55&h=55",
  },
  {
    name: "ShibaSwap",
    id: "shibaswap",
    slug: "shibaswap",
    icon: "https://icons.llamao.fi/icons/protocols/shibaswap?w=55&h=55",
  },
  {
    name: "Pangolin",
    id: "pangolin",
    slug: "pangolin",
    icon: "https://icons.llamao.fi/icons/protocols/pangolin?w=55&h=55",
  },
  {
    name: "BaseSwap",
    id: "baseswap",
    slug: "baseswap-v2",
    icon: "https://icons.llamao.fi/icons/protocols/baseswap-v2?w=55&h=55",
  },
];

export const CHAINS = [
  {
    id: "ethereum",
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    id: "polygon",
    name: "Polygon",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  },
  {
    id: "base",
    name: "Base",
    logo: "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  },
  {
    id: "unichain",
    name: "Unichain",
    logo: "https://icons.llamao.fi/icons/chains/rsz_unichain.jpg",
  },
  {
    id: "bsc",
    name: "BNB",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  },
  {
    id: "optimism",
    name: "Optimism",
    logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  },
  {
    id: "shibarium",
    name: "Shibarium",
    logo: "https://icons.llamao.fi/icons/protocols/shibaswap?w=80&h=80",
  },
];
