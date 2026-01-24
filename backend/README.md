Read-Only Capabilities (Final)

✅ ERC20 token metadata

✅ All existing UniV2 pairs

✅ Pair details (reserves, price, TVL)

✅ Swap events

✅ Liquidity events (Mint / Burn)

✅ Candles (OHLC)

✅ Global stats (TVL, volume)

✅ RPC abstraction + caching

✅ Multi-chain ready (Ethereum first)

✅ Available pairs to create (tokenA–tokenB not yet created)

No transactions. No signing. No private keys.

This is effectively a custom UniV2 indexer + API.

Step 2 — Backend Architecture (JS-First, Upgrade-Safe)

Because you are using plain JS, we will enforce structure via folders, not types.

Technology Stack (Locked)

Node.js (LTS)

Express

ethers.js

node-cache (memory cache)

dotenv

cors

helmet

No database initially.

```js
backend/
├── src/
│ ├── server.js
│ ├── app.js
│ │
│ ├── routes/
│ │ ├── health.js # liveness / readiness
│ │ ├── tokens.js # ERC20 metadata
│ │ ├── pairs.js # pairs list, details, existence
│ │ ├── events.js # swaps, mint, burn
│ │ ├── candles.js # OHLC data
│ │ └── stats.js # global protocol stats
│ │
│ ├── controllers/
│ │ ├── tokens.controller.js
│ │ ├── pairs.controller.js
│ │ ├── events.controller.js
│ │ ├── candles.controller.js
│ │ └── stats.controller.js
│ │
│ ├── services/
│ │ ├── rpc.service.js # provider abstraction
│ │ ├── uniswap.service.js # factory / pair logic
│ │ ├── token.service.js # ERC20 reads
│ │ ├── events.service.js # logs & decoding
│ │ ├── stats.service.js # aggregation logic
│ │ └── cache.service.js # in-memory cache
│ │
│ ├── contracts/
│ │ ├── UniswapV2Factory.json
│ │ ├── UniswapV2Pair.json
│ │ └── ERC20.json
│ │
│ ├── config/
│ │ ├── chains.js # chain configs (ETH first)
│ │ ├── addresses.js # factory/router addresses
│ │ └── env.js # env validation
│ │
│ ├── utils/
│ │ ├── bigint.js # bigint → string helpers
│ │ ├── math.js # price, TVL math
│ │ ├── formatting.js # API formatting
│ │ └── blocks.js # block range helpers
│ │
│ └── constants/
│ ├── cacheKeys.js
│ └── time.js
│
├── .env
├── package.json
└── package-lock.json
```
You are now tracking the most important V2 liquidity in the world:

- Uniswap V2 (The Original)✓

- SushiSwap (The Multi-chain Standard)✓

- PancakeSwap (The BSC King, Ethereum , base , arbitrum) ✓

- ShibaSwapV1 (Essential for Ethereum "meme" coins)✓

BaseSwap (The primary V2 choice for Base)

QuickSwap (The Polygon Standard)

- pangolin   (only on avalacnhe)

traderjoe





// Velodrome	Optimism

Camelot (V2)	Arbitrum

