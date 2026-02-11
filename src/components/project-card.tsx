"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  href: string;
  stack: string[];
  date: string;
  children: React.ReactNode;
}

export function ProjectCard({ title, href, stack, date, children }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              {title}
            </a>
          </h3>
          <ExternalLink className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300" />
        </div>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{date}</p>
        <div className="mt-4 text-zinc-600 dark:text-zinc-300 space-y-2">
          {children}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {stack.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
