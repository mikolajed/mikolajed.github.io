"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MathSymbol } from "./math-symbols";

interface SuggestionBoxProps {
    suggestions: MathSymbol[];
    selectedIndex: number;
    onSelect: (symbol: MathSymbol) => void;
    position: { top: number; left: number };
    visible: boolean;
}

export function SuggestionBox({ suggestions, selectedIndex, onSelect, position, visible }: SuggestionBoxProps) {
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (visible && listRef.current) {
            const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: "nearest" });
            }
        }
    }, [selectedIndex, visible]);

    if (!visible || suggestions.length === 0) return null;

    return (
        <div 
            className="absolute z-[200] w-64 bg-popover text-popover-foreground rounded-md border shadow-md overflow-hidden animate-in fade-in zoom-in-95 duration-100"
            style={{ 
                top: position.top + 24, // Offset slightly below line
                left: position.left 
            }}
        >
            <ul ref={listRef} className="max-h-[200px] overflow-y-auto py-1">
                {suggestions.map((symbol, index) => (
                    <li
                        key={symbol.label}
                        onClick={() => onSelect(symbol)}
                        className={cn(
                            "flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors",
                            index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                        )}
                    >
                        <span className="font-mono">{symbol.label}</span>
                        {symbol.description && (
                            <span className="text-muted-foreground text-xs">{symbol.description}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
