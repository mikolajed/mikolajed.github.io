"use client";

import { 
    Bold, 
    Italic, 
    Heading1, 
    Heading2, 
    Heading3, 
    Image as ImageIcon,
    Loader2,
    Eye,
    EyeOff,
    Quote,
    Code,
    Strikethrough,
    Link,
    List,
    ListOrdered,
    ListTodo,
    Table as TableIcon,
    PenLine,
    Underline,
    Superscript,
    Subscript,
    Minus,
    Sigma,
    SquareSigma
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
    insertText: (before: string, after?: string) => void;
    handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    isUploading: boolean;
    isPreview: boolean;
    setIsPreview: (isPreview: boolean) => void;
    actions?: React.ReactNode;
}

export function Toolbar({
    insertText,
    handleUpload,
    isUploading,
    isPreview,
    setIsPreview,
    actions
}: ToolbarProps) {
    return (
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
                <ToolbarButton icon={Italic} onClick={() => insertText("_", "_")} label="Italic" disabled={isPreview} />
                <ToolbarButton icon={Underline} onClick={() => insertText("<u>", "</u>")} label="Underline" disabled={isPreview} />
                <ToolbarButton icon={Strikethrough} onClick={() => insertText("~~", "~~")} label="Strikethrough" disabled={isPreview} />
                <ToolbarButton icon={Superscript} onClick={() => insertText("<sup>", "</sup>")} label="Superscript" disabled={isPreview} />
                <ToolbarButton icon={Subscript} onClick={() => insertText("<sub>", "</sub>")} label="Subscript" disabled={isPreview} />

                <div className="w-px h-4 bg-border mx-2" />
                <ToolbarButton icon={Heading1} onClick={() => insertText("# ", "")} label="Heading 1" disabled={isPreview} />
                <ToolbarButton icon={Heading2} onClick={() => insertText("## ", "")} label="Heading 2" disabled={isPreview} />
                <ToolbarButton icon={Heading3} onClick={() => insertText("### ", "")} label="Heading 3" disabled={isPreview} />

                <div className="w-px h-4 bg-border mx-2" />

                <ToolbarButton icon={Quote} onClick={() => insertText("> ", "")} label="Quote" disabled={isPreview} />
                <ToolbarButton icon={Code} onClick={() => insertText("```\n", "\n```")} label="Code Block" disabled={isPreview} />
                <ToolbarButton icon={Link} onClick={() => insertText("[", "](https://)")} label="Link" disabled={isPreview} />

                <div className="w-px h-4 bg-border mx-2" />

                <ToolbarButton icon={List} onClick={() => insertText("- ", "")} label="Bullet List" disabled={isPreview} />
                <ToolbarButton icon={ListOrdered} onClick={() => insertText("1. ", "")} label="Numbered List" disabled={isPreview} />
                <ToolbarButton icon={TableIcon} onClick={() => insertText(`
| Header 1 | Header 2 |
| :--- | :--- |
| Cell 1 | Cell 2 |
`, "")} label="Table" disabled={isPreview} />

                <ToolbarButton icon={Minus} onClick={() => insertText("\n---\n", "")} label="Horizontal Rule" disabled={isPreview} />

                <div className="w-px h-4 bg-border mx-2" />

                <ToolbarButton icon={Sigma} onClick={() => insertText("$", "$")} label="Inline Math" disabled={isPreview} />
                <ToolbarButton icon={SquareSigma} onClick={() => insertText("$$\n", "\n$$")} label="Block Math" disabled={isPreview} />

                <div className="w-px h-4 bg-border mx-2" />
                <div className={cn(
                    "relative flex items-center justify-center p-2 rounded-full transition-colors",
                    "hover:bg-secondary hover:text-foreground text-muted-foreground",
                    (isUploading || isPreview) && "opacity-50 pointer-events-none"
                )}>
                    <input 
                        type="file" 
                        accept="image/*,video/*"
                        onChange={handleUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        disabled={isUploading || isPreview}
                        title="Upload Media"
                    />
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <ImageIcon className="w-4 h-4" />}
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
