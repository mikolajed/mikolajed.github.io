"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">About Me</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          I'm a computer science student with a strong passion for distributed systems, blockchain technology, and high-performance computing. 
          Currently finishing my degree at Warsaw University of Technology after an inspiring year at the National University of Singapore.
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Education</h2>
        
        <div className="space-y-6">
          <div className="border-l-2 border-zinc-200 pl-4 dark:border-zinc-800">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50">Warsaw University of Technology</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">B.S. in Computer Science and Information Systems | Oct 2022 – Jun 2026 (Expected)</p>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              GPA: 4.31 / 5.0 <br />
              <span className="text-sm text-zinc-500">Core Coursework: Operating Systems, Algorithms & Data Structures, Numerical Methods, AI, Databases.</span>
            </p>
          </div>

          <div className="border-l-2 border-zinc-200 pl-4 dark:border-zinc-800">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50">National University of Singapore (NUS)</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Exchange Student, Computer Science | Aug 2024 – May 2025</p>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              <span className="text-sm text-zinc-500">Advanced Electives: Foundations of Modern Cryptography, Blockchain & DLT, Parallel & Concurrent Programming, Theory of Computation.</span>
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Technical Skills</h2>
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">Languages</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    C, C++ (Advanced)<br/>
                    Python, Java, Go, TypeScript, SQL, Circom<br/>
                    Rust (Familiar)
                </p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">Frameworks & Tools</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Spring Boot, Next.js, React, Django<br/>
                    Git, Hardhat, Foundry, Docker, Kubernetes
                </p>
            </div>
        </div>
      </motion.section>
      
       <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Extracurricular & Awards</h2>
        <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-300">
            <li><strong>Optiver READY TRADER GO Challenge</strong> - Top 32 Teams Global (2023)</li>
            <li><strong>Polish Olympiad in Informatics</strong> - 2nd Stage (2019, 2020)</li>
            <li><strong>PW Data Science Club</strong> (2022–2023) - Collaborated on EDA and model optimization.</li>
        </ul>
      </motion.section>
    </div>
  );
}
