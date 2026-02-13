
"use client";

import { useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { 
    Bold, 
    Italic, 
    Heading1, 
    Heading2, 
    Heading3, 
    Image as ImageIcon,
    Loader2,
    Eye,
    PenLine
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    onUpload: (file: File) => Promise<string>;
    actions?: React.ReactNode;
}

export function MarkdownEditor({ value, onChange, onUpload, actions }: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    
    // Helper to insert text at cursor or wrap selection
    const insertText = (before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        const newText = text.substring(0, start) + before + selection + after + text.substring(end);
        
        onChange(newText);
        
        // Restore focus and cursor position
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        });
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

    return (
        <div className="relative group">
            
            {isPreview ? (
                <div className="prose prose-lg max-w-none min-h-[50vh] mb-32 font-serif leading-relaxed">
                    <ReactMarkdown 
                        rehypePlugins={[rehypeRaw]}
                        urlTransform={(url) => url}
                        components={{
                            // Custom renderers if needed
                            img: ({node, ...props}) => props.src ? <img {...props} className="rounded-lg border border-border/50 shadow-sm" /> : null,
                            video: ({node, ...props}) => props.src ? <video {...props} className="rounded-lg border border-border/50 shadow-sm" controls /> : null
                        }}
                    >
                        {value || "*Nothing to preview*"}
                    </ReactMarkdown>
                </div>
            ) : (
                <TextareaAutosize
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Start writing your story..."
                    className="w-full resize-none bg-transparent outline-none text-lg leading-relaxed min-h-[50vh] placeholder:text-muted-foreground/50 font-serif mb-32"
                    minRows={10}
                />
            )}

            {/* Toolbar - Fixed at Bottom */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-background/80 backdrop-blur-xl border border-border/50 rounded-full px-4 py-2 flex items-center gap-1 shadow-2xl transition-all hover:scale-105">
                <div className="flex items-center gap-1">
                    {/* View Toggle */}
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            isPreview ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                        title={isPreview ? "Edit" : "Preview"}
                    >
                        {isPreview ? <PenLine className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    <div className="w-px h-6 bg-border mx-2" />

                    {/* Editor Tools */}
                    <ToolbarButton icon={Bold} onClick={() => insertText("**", "**")} label="Bold" disabled={isPreview} />
                    <ToolbarButton icon={Italic} onClick={() => insertText("*", "*")} label="Italic" disabled={isPreview} />
                    <div className="w-px h-4 bg-border mx-2" />
                    <ToolbarButton icon={Heading1} onClick={() => insertText("# ", "")} label="Heading 1" disabled={isPreview} />
                    <ToolbarButton icon={Heading2} onClick={() => insertText("## ", "")} label="Heading 2" disabled={isPreview} />
                    <ToolbarButton icon={Heading3} onClick={() => insertText("### ", "")} label="Heading 3" disabled={isPreview} />
                    <div className="w-px h-4 bg-border mx-2" />
                    <div className="relative flex items-center justify-center">
                        <input 
                            type="file" 
                            accept="image/*,video/*"
                            onChange={handleUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 disabled:pointer-events-none"
                            disabled={isUploading || isPreview}
                            title="Upload Media"
                        />
                        <button 
                            type="button" 
                            className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isUploading || isPreview}
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <ImageIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {actions && (
                    <>
                        <div className="w-px h-6 bg-border mx-2" />
                        <div className="pl-1">
                            {actions}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function ToolbarButton({ icon: Icon, onClick, label, disabled }: { icon: any, onClick: () => void, label: string, disabled?: boolean }) {
    return (
        <button 
            type="button" 
            onClick={onClick}
            disabled={disabled}
            className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none"
            title={label}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}
