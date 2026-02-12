"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/guestbook", label: "Guestbook" },
  { href: "/cv/CV.pdf", label: "CV" },
];

const socials = [
  { href: "https://github.com/mikolajed", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/mikolajed", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:mikolajedjed@gmail.com", icon: Mail, label: "Email" },
];

export function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent pt-6 pb-2 transition-all duration-300 pointer-events-none">
      <div className="container mx-auto flex items-center justify-center px-6 pointer-events-auto">
        
        {/* Desktop Nav - Centered & Minimal */}
        <div className="hidden md:flex items-center gap-12 bg-background/50 backdrop-blur-md px-8 py-3 rounded-full border border-border shadow-sm">
        {/* Links */}
        <div className="flex items-center gap-8"> {/* Links */}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-widest uppercase transition-all hover:text-foreground relative font-medium",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-1 h-px bg-foreground"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side Group */}
        <div className="flex gap-5 items-center">
          <div className="h-4 w-px bg-border" /> {/* Moved divider */}
          <ThemeToggle />
          <div className="h-4 w-px bg-border" />
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <social.icon className="h-4 w-4" />
              <span className="sr-only">{social.label}</span>
            </a>
          ))}
        </div>
      </div>

        {/* Mobile Menu Button - Absolute Right */}
        <div className="md:hidden w-full flex justify-end">
             <button
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-200/50 dark:border-zinc-800/50"
                onClick={() => setIsOpen(!isOpen)}
                >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
        </div>
       
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-2 mx-4 rounded-2xl border border-zinc-100 dark:border-white/5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl overflow-hidden shadow-xl pointer-events-auto"
          >
            <div className="flex flex-col p-6 space-y-6 items-center text-center">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg tracking-widest uppercase font-medium transition-colors hover:text-zinc-900 dark:hover:text-white",
                    pathname === link.href
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-500 dark:text-zinc-400"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px w-16 bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex gap-8 pt-2 items-center">
                <ThemeToggle />
                <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
