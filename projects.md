---
layout: default
title: Projects
permalink: /projects/
---

# Projects & Achievements

## Decentralized Voting System (Bachelor's Thesis)

[zkVote](https://zk-vote-six.vercel.app/) | Solidity, Circom, TypeScript | May 2025 – Feb 2026

- Engineered a universally verifiable voting dApp using **ZK-SNARKs (Groth16)** and **exponential ElGamal encryption** on the Baby JubJub curve to ensure ballot secrecy and anonymity.
- Implemented **ERC-4337 Account Abstraction** using **Alchemy** and a custom Paymaster to abstract gas fees, enabling a frictionless "Web2-like" user experience.
- Designed modular circuits in **Circom** and optimized constraint counts for efficient **client-side proving** (WASM), ensuring user privacy without trusted servers.
- Deployed to **Sepolia** and **Base Sepolia (L2)**, achieving a 99% reduction in gas costs vs Ethereum L1.
- Integrated an **NFT module** that mints verifiable election result certificates.

## Concurrent Programming Portfolio

C, C++, Go, Rust | Jan 2025 – May 2025

- Architected a high-throughput trading system in **Go** utilizing a **fan-out pattern**: dedicated goroutines per instrument and channel-based messaging to eliminate lock contention.
- Designed an Order Matching Engine in **C++** using a **Trie-based** order book structure and fine-grained mutex locking for thread-safe order execution.
- Engineered a custom reliable transport protocol in **C** over UDP, implementing a **Sliding Window** mechanism to ensure end-to-end reliability with low overhead.
- Developed an asynchronous TCP server in **Rust** using the **Tokio** runtime to handle 1000+ concurrent client connections via non-blocking I/O.

## Web Frontend for SQLancer

Spring Boot, Next.js, PostgreSQL | Jan 2025 – May 2025

- Extended **SQLancer** by architecting a full-stack Bug Tracking System in a 5-person agile team.
- Engineered a **Spring Boot** backend to orchestrate SQLancer instances, automatically capturing detected logic bugs and persisting them to **PostgreSQL**.
- Developed a **Next.js** dashboard featuring a "GitHub-style" issue workflow, allowing developers to label, inspect, and mark database inconsistencies as resolved.

## Carbon Credit DEX

Solidity, Hardhat, TypeScript | Jan 2025 – May 2025

- Developed contracts utilizing **OpenZeppelin** to mint **ERC-20** carbon credits and **ERC-721** project NFTs.
- Engineered a fixed-rate Liquidity Provider contract to facilitate automated trading and ensure price stability.
- Wrote comprehensive unit tests and traffic simulation scripts using **Hardhat** and **ethers.js**.
