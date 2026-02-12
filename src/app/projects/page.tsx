"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";

const projects = [
  {
    title: "Decentralized Voting System (zkVote)",
    href: "https://zk-vote-six.vercel.app/",
    stack: ["Solidity", "Circom", "TypeScript", "Next.js", "Foundry"],
    date: "May 2025 – Feb 2026",
    description: (
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>Universally verifiable voting dApp using <strong>ZK-SNARKs (Groth16)</strong> and <strong>exponential ElGamal encryption</strong>.</li>
        <li>Implemented <strong>ERC-4337 Account Abstraction</strong> for gasless transactions.</li>
        <li>Designed modular circuits in <strong>Circom</strong> for efficient client-side proving (WASM).</li>
        <li>Deployed to <strong>Sepolia</strong> and <strong>Base Sepolia (L2)</strong> (99% gas reduction).</li>
      </ul>
    ),
  },
  {
    title: "Concurrent Programming Portfolio",
    href: "https://github.com/mikolajed", 
    stack: ["C", "C++", "Go", "Rust"],
    date: "Jan 2025 – May 2025",
    description: (
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>High-throughput trading system in <strong>Go</strong> using fan-out pattern.</li>
        <li>Order Matching Engine in <strong>C++</strong> with Trie-based order book.</li>
        <li>Reliable transport protocol in <strong>C</strong> over UDP (Sliding Window).</li>
        <li>Asynchronous TCP server in <strong>Rust</strong> using Tokio.</li>
      </ul>
    ),
  },
  {
    title: "Web Frontend for SQLancer",
    href: "https://github.com/mikolajed",
    stack: ["Spring Boot", "Next.js", "PostgreSQL"],
    date: "Jan 2025 – May 2025",
    description: (
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>Full-stack Bug Tracking System for SQLancer.</li>
        <li><strong>Spring Boot</strong> backend for orchestrating SQLancer instances.</li>
        <li><strong>Next.js</strong> dashboard for issue lifecycle management.</li>
      </ul>
    ),
  },
  {
    title: "Carbon Credit DEX",
    href: "https://github.com/mikolajed",
    stack: ["Solidity", "Hardhat", "TypeScript"],
    date: "Jan 2025 – May 2025",
    description: (
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li><strong>ERC-20</strong> carbon credits and <strong>ERC-721</strong> project NFTs.</li>
        <li>Fixed-rate Liquidity Provider contract for automated trading.</li>
        <li>Comprehensive tests using <strong>Hardhat</strong> and <strong>ethers.js</strong>.</li>
      </ul>
    ),
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-widest text-foreground font-display uppercase">Projects</h1>
        <p className="mt-4 text-muted-foreground font-light tracking-wide">
          A selection of work in blockchain, systems, and web.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProjectCard {...project}>
              {project.description}
            </ProjectCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
