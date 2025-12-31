# UniV2-ExchangeDesk

UniV2-ExchangeDesk is a full-stack decentralized application that provides a unified
interface for interacting with existing Uniswap V2 liquidity pools. The project focuses
on correct protocol integration, on-chain data interpretation, and end-to-end Web3
application design.

This project is built as a learning-focused but production-aligned implementation,
emphasizing protocol mechanics, safety considerations, and clean architecture rather
than protocol forking or modification.

---

## Core Functionality

The application enables users to:

- Swap tokens using existing Uniswap V2 pools
- Add and remove liquidity to become liquidity providers (LPs)
- Create a new Uniswap V2 pool when a token pair does not yet exist
- View on-chain token prices derived from pool reserves
- Inspect pool reserves, LP token balances, and pool share
- Interact securely via MetaMask wallet integration
- Optionally apply a platform-level protocol fee through an external wrapper contract

> Note: This project integrates with already-deployed Uniswap V2 contracts and does not
fork, redeploy, or modify Uniswap core or periphery logic.

---

## Technical Scope and Design Principles

- Integration-first design (no AMM reimplementation)
- Direct interaction with Uniswap V2 Factory, Router, and Pair contracts
- On-chain price discovery using reserve-based calculations
- Strict separation between smart contracts, frontend, and backend layers
- Minimal Solidity surface area to reduce attack surface
- Backend services are read-only and never custody private keys

---

## Technology Stack

### Smart Contracts
- Solidity ^0.8.x
- Foundry (forge, anvil, cast)
- Uniswap V2 interfaces (Factory, Router02, Pair)

### Frontend
- React
- Vite
- ethers.js
- MetaMask (EIP-1193 provider)

### Backend (Optional / Read-Only)
- Node.js
- Express
- ethers.js (RPC-based reads only)

---

## Project Structure

```js
UniV2-ExchangeDesk/
├── contracts/  # Foundry-based Solidity contracts and interfaces
├── frontend/ # React frontend (wallet, swaps, liquidity UI)
├── backend/ # Optional backend for simulations and indexing
└── README.md
```

---

## Learning Objectives

This project is designed to demonstrate practical understanding of:

- Uniswap V2 architecture (Factory / Router / Pair)
- ERC-20 approvals, decimals, and balance handling
- AMM pricing mechanics and reserve-based price calculation
- Liquidity provider mechanics and LP token accounting
- MetaMask wallet integration and transaction lifecycle handling
- Full-stack Web3 application architecture
- Safe integration patterns for external DeFi protocols

---

## Current Status

Project is under working state .

---

## Disclaimer

This project is built for educational and portfolio purposes. It is not audited and
should not be used in production environments involving real user funds.




What UniV2-ExchangeDesk Actually Does (Final)

UniV2-ExchangeDesk is a multi-chain Uniswap V2 integration dashboard that provides a simplified, opinionated interface for interacting with existing Uniswap V2 pools, while enforcing a small platform fee and offering portfolio + analytics views.

It does not re-implement Uniswap, and it does not abstract away chains at execution time.

1. High-Level Architecture (Final)
User
  ↓
Frontend (React + ethers.js)
  ↓  (wallet network must match selected chain)
ExchangeDeskRouter (deployed per chain)
  ↓
Uniswap V2 (Factory / Router / Pair)


Backend (optional, read-only) runs in parallel for data.

2. What the Frontend Does (Very Important)

The frontend is chain-aware and UX-driven, but not execution-powerful.

Frontend responsibilities
A. Wallet & Chain Control

Connect wallet (MetaMask)

Provide chain selector inside Swap / Liquidity UI

When user selects a chain:

Prompt MetaMask to switch network

Block actions until wallet network matches UI chain

B. Feature Scope (your stated goal)

Frontend exposes only:

Swap (Uniswap V2 only)

Add / Remove Liquidity

Pool Creation (V2 pairs)

Portfolio view (tokens + LPs)

Wallet connect

No limit orders, no advanced trading, no V3, no extra complexity.

C. UX Logic (off-chain)

Slippage calculation

Decimal normalization

Token selection

Input validation

Chain availability checks

3. What the ExchangeDeskRouter Does (On-Chain)

This is the single enforced integration point per chain.

One router per chain (mandatory)

Sepolia → Router deployed on Sepolia

Polygon → Router deployed on Polygon

Arbitrum → Router deployed on Arbitrum

Same code. Same ABI. Different deployments.

Router responsibilities (strictly limited)

The router is NOT a Uniswap replacement.
It is a thin toll-booth + event recorder.

A. Enforce platform fee (0.005%)

Fee is taken on-chain

Cannot be bypassed by frontend

Only applied to V2 pools

B. Forward execution to Uniswap V2

Router functions:

swapExact*

addLiquidity*

removeLiquidity*

createPairIfNotExists

Internally:

Pull tokens from user

Deduct 0.005% fee

Approve Uniswap Router

Forward the call

Return results

No AMM math.
No reserve logic.
No pricing logic.

C. Emit clean, unified events

Your router emits:

Swap events

Liquidity add/remove events

Pool creation events

These are easier to index than raw Uniswap events.

4. What the Backend Does (Optional but Powerful)

Backend is read-only and chain-agnostic.

Backend responsibilities

Index all Uniswap V2 pools (per chain)

Calculate TVL from reserves

Index ExchangeDeskRouter events

Build:

Pool explorer

Live trades feed

Portfolio aggregation

Serve fast APIs so UI loads data before wallet connect

Backend NEVER:

Signs transactions

Holds keys

Executes swaps

Custodies funds

UniV2-ExchangeDesk is a multi-chain Uniswap V2 integration platform that provides a simplified interface for swaps, liquidity management, pool creation, and portfolio tracking. It uses a thin, chain-local ExchangeDeskRouter deployed per network to enforce a minimal platform fee and emit unified events, while delegating all AMM logic to existing Uniswap V2 contracts. The frontend manages chain selection and wallet network switching, and the backend provides read-only analytics and indexing. The system is integration-first, chain-correct, and avoids protocol re-implementation.

```
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
│  ├─ useWallet.js
│  ├─ useChain.js
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
└─ index.jsx

```