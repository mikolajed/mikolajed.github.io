"use client";

import { useEffect, useRef, useId, useState } from "react";
import mermaid from "mermaid";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const id = useId().replace(/:/g, ""); 
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!chart || !mounted) return;

    const renderChart = async () => {
      try {
        setError(null);
        
        const currentTheme = theme === 'system' ? systemTheme : theme;
        const mermaidTheme = currentTheme === 'dark' ? 'dark' : 'default';

        mermaid.initialize({
            startOnLoad: false,
            theme: mermaidTheme,
            securityLevel: "loose",
            fontFamily: "var(--font-sans)",
        });

        const uniqueId = `mermaid-${id}-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, chart);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError("Failed to render diagram");
      }
    };

    renderChart();
  }, [chart, id, theme, systemTheme, mounted]);

  if (error) {
     return (
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive text-sm font-mono whitespace-pre-wrap">
            {error}
            <div className="mt-2 opacity-70 text-xs">{chart}</div>
        </div>
     )
  }

  if (!svg) {
      return (
          <div className="flex items-center justify-center p-8 border border-border/50 rounded-lg bg-secondary/20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
      )
  }

  return (
    <div 
        ref={elementRef}
        className="mermaid-chart flex justify-center my-8 p-4 bg-secondary/10 rounded-xl border border-border/30 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
