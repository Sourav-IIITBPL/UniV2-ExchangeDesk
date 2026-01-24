```js
src/
├─ app/
│  ├─ App.jsx
│  ├─ Router.jsx
│  └─ Layout.jsx
│
├─ config/
│  ├─ chains.js
│  ├─ tokens.js
│  ├─ routers.js
│  └─ constants.js
│
├─ lib/
│  ├─ provider.js
│  ├─ signer.js
│  ├─ contracts.js
│  └─ switchNetwork.js
│
├─ hooks/
│  ├─ useRouter.js
│  ├─ useSlippage.js
│  └─ useDeadline.js
│
├─ services/
│  ├─ swap.service.js
│  ├─ liquidity.service.js
│  ├─ pool.service.js
│  └─ portfolio.service.js
│
├─ components/
│  ├─ Navbar.jsx
│  ├─ WalletButton.jsx
│  ├─ ChainSelector.jsx
│  ├─ TokenSelector.jsx
│  ├─ SwapBox.jsx
│  ├─ PoolTable.jsx
│  └─ LiquidityModal.jsx
│
├─ pages/
│  ├─ Home.jsx
│  ├─ Swap.jsx
│  ├─ Liquidity.jsx
│  ├─ Portfolio.jsx
│  └─ CreatePool.jsx
│
└─ main.jsx

```

UI (React components)
   ↓
Hooks (deadline+router+slippage)
   ↓
Services (protocol actions)
   ↓
ExchangeDeskRouter (on-chain)
And in parallel:
Backend / RPC (read-only)
   ↓
Services
   ↓
Pages (Home, Portfolio, Liquidity lists)
Your frontend is intentionally layered.




- Would you like me to help you create a "Global Search" bar that filters the table by token name across all your 7 protocols?

//Would you like me to help you set up a Context Provider so this protocol data 
// is available across all pages of your app without re-fetching?
