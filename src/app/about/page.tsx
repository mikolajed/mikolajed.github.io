"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-20 pt-28 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-bold tracking-widest text-foreground font-display uppercase">About</h1>
        <p className="text-lg text-muted-foreground leading-relaxed font-light">
          I'm a computer science student with a strong passion for distributed systems, blockchain technology, and high-performance computing. 
          Currently finishing my degree at Warsaw University of Technology after an inspiring year at the National University of Singapore.
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-8"
      >
        <h2 className="text-sm font-semibold tracking-widest text-zinc-400 uppercase">Education</h2>
        
        <div className="space-y-10 relative border-l border-zinc-200 dark:border-zinc-800 ml-3">
          <div className="pl-8 relative">
             <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 ring-4 ring-white dark:ring-black" />
            <h3 className="font-semibold text-foreground text-lg">Warsaw University of Technology</h3>
            <p className="text-sm text-muted-foreground mt-1">B.S. in Computer Science • Oct 2022 – Jun 2026</p>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              GPA: 4.31 / 5.0 <br />
              <span className="text-zinc-500">Operating Systems, Algorithms, Numerical Methods, AI, Databases.</span>
            </p>
          </div>

          <div className="pl-8 relative">
            <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 ring-4 ring-white dark:ring-black" />
            <h3 className="font-semibold text-foreground text-lg">National University of Singapore (NUS)</h3>
            <p className="text-sm text-muted-foreground mt-1">Exchange Student • Aug 2024 – May 2025</p>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              <span className="text-zinc-500">Cryptography, Blockchain & DLT, Parallel Programming, Theory of Computation.</span>
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-8"
      >
        <h2 className="text-sm font-semibold tracking-widest text-zinc-400 uppercase">Technical Skills</h2>
        <div className="grid gap-6 sm:grid-cols-3">
            <div className="p-6 rounded-2xl bg-card border border-border backdrop-blur-sm shadow-sm">
                <h3 className="font-medium text-foreground mb-4">Languages</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    C, C++ <span className="text-zinc-400 italic">(Advanced)</span><br/>
                    Python, Java, C#, Go, TypeScript, SQL, Circom <span className="text-zinc-400 italic">(Intermediate)</span><br/>
                    Rust <span className="text-zinc-400 italic">(Familiar)</span>
                </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border backdrop-blur-sm shadow-sm">
                <h3 className="font-medium text-foreground mb-4">Tools &amp; DevOps</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Git <span className="text-zinc-400 italic">(Advanced)</span><br/>
                    Hardhat, Foundry, Make, LaTeX <span className="text-zinc-400 italic">(Intermediate)</span><br/>
                    Docker, Kubernetes, CMake <span className="text-zinc-400 italic">(Familiar)</span>
                </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border backdrop-blur-sm shadow-sm">
                <h3 className="font-medium text-foreground mb-4">Frameworks</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Spring Boot, Next.js, React, Django
                </p>
            </div>
        </div>
      </motion.section>
      
       <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-8"
      >
        <h2 className="text-sm font-semibold tracking-widest text-zinc-400 uppercase">Extracurricular &amp; Awards</h2>
        <ul className="space-y-4 text-muted-foreground text-sm">
            <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                <span>
                 <strong>Optiver READY TRADER GO Challenge</strong> — Top 32 Teams Global (2023)
                </span>
            </li>
            <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                <span>
                <strong>Polish Olympiad in Informatics</strong> — 2nd Stage (2019, 2020)
                </span>
            </li>
            <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                <span>
                <strong>PW Data Science Club</strong> — Collaborative EDA and model optimization (2022–2023).
                </span>
            </li>
        </ul>
      </motion.section>
    </div>
  );
}
