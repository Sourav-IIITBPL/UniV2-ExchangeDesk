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
