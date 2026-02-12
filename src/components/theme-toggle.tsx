"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="w-20 h-[38px] rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="relative flex items-center w-20 h-[38px] p-1 rounded-full bg-background/50 backdrop-blur-md border border-border">
      <button
        className="flex-1 flex items-center justify-center z-10 outline-none"
        onClick={() => setTheme("light")}
        aria-label="Switch to light mode"
      >
        <Sun className={cn("h-4 w-4 transition-colors", !isDark ? "text-amber-500" : "text-muted-foreground/50")} />
      </button>

      <button
        className="flex-1 flex items-center justify-center z-10 outline-none"
        onClick={() => setTheme("dark")}
        aria-label="Switch to dark mode"
      >
        <Moon className={cn("h-4 w-4 transition-colors", isDark ? "text-violet-500" : "text-muted-foreground/50")} />
      </button>
    </div>
  )
}
