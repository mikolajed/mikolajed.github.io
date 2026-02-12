"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SelfDrawingPortrait({ className }: { className?: string }) {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    fetch("/assets/portrait.svg")
      .then((res) => res.text())
      .then((text) => {
        setSvgContent(text);
      })
      .catch((err) => console.error("Failed to load SVG", err));
  }, []);

  if (!svgContent) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center", className)}>
        <div className="animate-pulse bg-muted rounded-lg w-full h-full" />
      </div>
    );
  }

  return (
    <div 
      className={cn("w-full h-full [&>svg]:w-full [&>svg]:h-full", className)}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
