"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { WalletConnect } from "./wallet-connect";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/guestbook", label: "Guestbook" },
  { href: "/cv/CV.pdf", label: "CV" },
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
          <div className="h-4 w-px bg-border" />
          <ThemeToggle />
          <div className="h-4 w-px bg-border" />
          <WalletConnect />
        </div>
      </div>

        {/* Mobile Nav Top Bar */}
        <div className="md:hidden w-full flex items-center justify-end gap-3">
             <ThemeToggle />
             <WalletConnect />
             <button
                className="p-2 text-foreground/80 hover:text-foreground bg-background/50 backdrop-blur-md rounded-full border border-border"
                onClick={() => setIsOpen(!isOpen)}
                >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
        </div>
       
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-2 mx-4 rounded-2xl border border-border bg-background/95 backdrop-blur-xl overflow-hidden shadow-xl pointer-events-auto"
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
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
