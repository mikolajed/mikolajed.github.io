"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-2xl"
      >
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-500">
          Mikołaj Jędrzejewski
        </h1>
        
        <p className="text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl leading-relaxed">
          Computer Science student at <strong>Warsaw University of Technology</strong>.
          <br />
          Exchange student at <strong>National University of Singapore (NUS)</strong>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
          >
            View Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
          >
            About Me
          </Link>
          <a
             href="/cv/CV.pdf"
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
          >
            <FileText className="mr-2 h-4 w-4" />
            Resume
          </a>

        </div>
      </motion.div>
    </div>
  );
}
