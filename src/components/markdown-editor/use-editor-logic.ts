"use client";

import { useRef, useEffect, useState } from "react";
import { mathSymbols, MathSymbol } from "./math-symbols";

// Helper to get caret coordinates
const getCursorXY = (textarea: HTMLTextAreaElement, selectionPoint: number) => {
    const {
        offsetLeft: inputX,
        offsetTop: inputY,
        scrollLeft: inputScrollLeft,
        scrollTop: inputScrollTop,
    } = textarea;

    const div = document.createElement('div');
    const copyStyle = getComputedStyle(textarea);
    for (const prop of copyStyle) {
        div.style[prop as any] = copyStyle[prop as any];
    }
    
    // Reset specific properties to ensure accuracy
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.top = '0px';
    div.style.left = '0px';
    div.style.transform = 'none';
    
    const swap = '.';
    const inputValue = textarea.value.substr(0, selectionPoint);
    const textContent = inputValue.replace(/\n/g, '<br>');
    div.innerHTML = textContent + swap;
    
    document.body.appendChild(div);
    const span = document.createElement('span');
    span.textContent = inputValue.substr(inputValue.length - 1);
    div.appendChild(span);
    
    const { offsetTop: spanY, offsetLeft: spanX } = span;
    
    document.body.removeChild(div);

    // Calculate position relative to the offset parent (the wrapper div)
    // using offsetLeft/Top is correct for absolute positioning within a relative container
    return {
        x: inputX + spanX - inputScrollLeft,
        y: inputY + spanY - inputScrollTop,
    };
}

interface UseEditorLogicProps {
    value: string;
    onChange: (value: string) => void;
    onUpload: (file: File) => Promise<string>;
}

export function useEditorLogic({ value, onChange, onUpload }: UseEditorLogicProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const pendingCursor = useRef<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Suggestions state
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<MathSymbol[]>([]);
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 });
    const [triggerIdx, setTriggerIdx] = useState<number | null>(null);

    // Filter suggestions based on input
    useEffect(() => {
        if (triggerIdx !== null && textareaRef.current) {
            const cursor = textareaRef.current.selectionStart;
            const text = value;
            
            // If cursor moved behind trigger, text detected as empty, or newline
            if (cursor < triggerIdx) {
                setShowSuggestions(false);
                setTriggerIdx(null);
                return;
            }

            const query = text.slice(triggerIdx, cursor);
            // If query contains space, close suggestions
            if (query.includes(' ') || query.includes('\n')) {
                setShowSuggestions(false);
                setTriggerIdx(null);
                return;
            }

            const filtered = mathSymbols.filter(s => 
                s.label.toLowerCase().includes(query.toLowerCase()) || 
                (s.description && s.description.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 10); // Limit to 10

            setSuggestions(filtered);
            setSuggestionIndex(0);
            setShowSuggestions(filtered.length > 0);
        }
    }, [value, triggerIdx]);

    // Handle text change to detect trigger
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const newCursor = e.target.selectionStart;
        
        // Detect backspace over trigger
        if (newValue.length < value.length) {
            if (triggerIdx !== null && newCursor < triggerIdx) {
                setShowSuggestions(false);
                setTriggerIdx(null);
            }
        }

        // Detect '\' trigger
        if (newValue[newCursor - 1] === '\\') {
            const xy = getCursorXY(e.target, newCursor);
            setSuggestionPos({ top: xy.y, left: xy.x });
            setTriggerIdx(newCursor);
            setShowSuggestions(true);
        }
        
        onChange(newValue);
    };

    // Handle cursor movement / selection changes
    const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        if (triggerIdx !== null && textareaRef.current) {
            const cursor = textareaRef.current.selectionStart;
            
            // If cursor moves away from the trigger area, close suggestions
            // checking if cursor is before trigger or too far ahead (optional, but simple check is enough)
            if (cursor < triggerIdx) {
                setShowSuggestions(false);
                setTriggerIdx(null);
            }
            
            // Also re-verify the text match
            const text = value;
            const query = text.slice(triggerIdx, cursor);
            if (query.includes(' ') || query.includes('\n')) {
                setShowSuggestions(false);
                setTriggerIdx(null);
            }
        }
    };

    // Replace insertText with one that handles suggestions too
    const insertSuggestion = (symbol: MathSymbol) => {
        if (!textareaRef.current || triggerIdx === null) return;
        
        const cursor = textareaRef.current.selectionStart;
        const before = value.substring(0, triggerIdx - 1); // -1 to remove the '\'
        const after = value.substring(cursor);
        
        const newText = before + symbol.value + after;
        
        onChange(newText);
        // Move cursor after inserted symbol
        pendingCursor.current = before.length + symbol.value.length;
        
        setShowSuggestions(false);
        setTriggerIdx(null);
    };

    // Restore cursor position after update
    useEffect(() => {
        if (pendingCursor.current !== null && textareaRef.current) {
            textareaRef.current.setSelectionRange(pendingCursor.current, pendingCursor.current);
            pendingCursor.current = null;
            textareaRef.current.focus();
        }
    }, [value]);

    // Helper to insert text at cursor or wrap selection
    const insertText = (before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        const newText = text.substring(0, start) + before + selection + after + text.substring(end);
        
        // Store intended cursor position
        pendingCursor.current = start + before.length + selection.length + after.length;

        onChange(newText);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await onUpload(file);
            const isVideo = file.type.startsWith("video/");
            const markdownSnippet = isVideo 
                ? `\n<video controls src="${url}" width="100%"></video>\n` 
                : `\n![${file.name}](${url})\n`;
            
            insertText(markdownSnippet);
        } catch (error) {
            console.error(error);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Handle suggestions navigation
        if (showSuggestions && suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSuggestionIndex(i => (i + 1) % suggestions.length);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSuggestionIndex(i => (i - 1 + suggestions.length) % suggestions.length);
                return;
            }
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                insertSuggestion(suggestions[suggestionIndex]);
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                setShowSuggestions(false);
                setTriggerIdx(null);
                return;
            }
        }

        if (e.key === 'Enter') {
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const text = textarea.value;
            
            // Get current line
            const lineStart = text.lastIndexOf('\n', start - 1) + 1;
            const lineEnd = text.indexOf('\n', start);
            const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);

            // Check for list patterns
            const bulletMatch = /^\s*([-*] )\s*/.exec(currentLine);
            const numberMatch = /^\s*(\d+)\.\s+/.exec(currentLine);

            if (bulletMatch || numberMatch) {
                e.preventDefault();
                
                const fullMatch = bulletMatch ? bulletMatch[0] : numberMatch![0];
                const content = currentLine.slice(fullMatch.length);

                // If empty list item, remove it (end list)
                if (!content.trim()) {
                    const newText = text.substring(0, lineStart) + text.substring(lineEnd === -1 ? text.length : lineEnd + 1);
                    onChange(newText);
                    
                    // Set cursor to start of line (where bullet was)
                    pendingCursor.current = lineStart;
                    return;
                }

                // Determine next marker
                let nextMarker = fullMatch;
                if (numberMatch) {
                    const num = parseInt(numberMatch[1]);
                    nextMarker = fullMatch.replace(/\d+/,String(num + 1));
                }

                // Insert newline and next marker
                const insertion = `\n${nextMarker}`;
                const newText = text.substring(0, start) + insertion + text.substring(start);
                
                pendingCursor.current = start + insertion.length;
                onChange(newText);
            }
        }
    };

    return {
        textareaRef,
        isUploading,
        insertText,
        handleUpload,
        handleKeyDown,
        handleInput,
        handleSelect,
        suggestionsState: {
            showSuggestions,
            suggestions,
            suggestionIndex,
            suggestionPos,
            insertSuggestion
        }
    };
}
