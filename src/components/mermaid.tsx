"use client";

import { useEffect, useRef, useId, useState } from "react";
import mermaid from "mermaid";
import { Loader2 } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  fontFamily: "var(--font-sans)",
});

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const id = useId().replace(/:/g, ""); // Create a valid ID
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chart) return;

    const renderChart = async () => {
      try {
        setError(null);
        // Unique ID for each render to avoid conflicts
        const uniqueId = `mermaid-${id}-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, chart);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError("Failed to render diagram");
        // Mermaid sometimes leaves a persistent error message in the DOM, so we can't fully clean it up easily
        // but re-rendering with valid input should work.
      }
    };

    renderChart();
  }, [chart, id]);

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
