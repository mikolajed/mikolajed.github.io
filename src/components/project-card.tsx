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
      className="group relative flex flex-col justify-between rounded-2xl bg-card border border-border p-8 hover:border-ring/30 hover:shadow-sm transition-all"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold tracking-tight text-foreground font-display">
            <a href={href} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              {title}
            </a>
          </h3>
          <ExternalLink className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
        </div>
        <p className="text-xs font-mono text-muted-foreground/80 mb-6">{date}</p>
        <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
          {children}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {stack.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-md bg-secondary text-secondary-foreground border border-border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
