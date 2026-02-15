"use client";

import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useEditorLogic } from "./markdown-editor/use-editor-logic";
import { Preview } from "./markdown-editor/preview";
import { Toolbar } from "./markdown-editor/toolbar";
import { SuggestionBox } from "./markdown-editor/suggestion-box";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    onUpload: (file: File) => Promise<string>;
    actions?: React.ReactNode;
}

export function MarkdownEditor({ value, onChange, onUpload, actions }: MarkdownEditorProps) {
    const [isPreview, setIsPreview] = useState(false);
    
    const { 
        textareaRef,
        isUploading,
        insertText,
        handleUpload,
        handleKeyDown,
        handleInput,
        handleSelect,
        suggestionsState
    } = useEditorLogic({ value, onChange, onUpload });

    return (
        <div className="relative group">
            
            {isPreview ? (
                <Preview value={value} />
            ) : (
                <TextareaAutosize
                    ref={textareaRef}
                    value={value}
                    onChange={handleInput}
                    onSelect={handleSelect}
                    onClick={handleSelect}
                    placeholder="Start writing your story..."
                    className="w-full resize-none bg-transparent outline-none text-lg leading-relaxed min-h-[50vh] placeholder:text-muted-foreground/50 font-serif mb-32"
                    minRows={10}
                    onKeyDown={handleKeyDown}
                />
            )}

            <SuggestionBox 
                visible={suggestionsState.showSuggestions}
                suggestions={suggestionsState.suggestions}
                selectedIndex={suggestionsState.suggestionIndex}
                onSelect={suggestionsState.insertSuggestion}
                position={suggestionsState.suggestionPos}
            />

            <Toolbar 
                insertText={insertText}
                handleUpload={handleUpload}
                isUploading={isUploading}
                isPreview={isPreview}
                setIsPreview={setIsPreview}
                actions={actions}
            />
        </div>
    );
}
