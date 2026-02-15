"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import { Mermaid } from "../mermaid";

interface PreviewProps {
    value: string;
}

export function Preview({ value }: PreviewProps) {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none min-h-[50vh] mb-32 font-serif leading-relaxed prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground">
            <style jsx global>{`
                .katex { color: var(--foreground) !important; }
                .katex-html { color: var(--foreground) !important; }
            `}</style>
            <ReactMarkdown 
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
                urlTransform={(url) => url}
                components={{
                    code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        if (!inline && match && match[1] === 'mermaid') {
                            return <Mermaid chart={String(children).replace(/\n$/, '')} />
                        }
                        return !inline && match ? (
                        <code className={className} {...props}>
                            {children}
                        </code>
                        ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                        )
                    },
                    // Custom renderers
                    a: ({node, ...props}) => (
                        <a 
                            {...props} 
                            className="text-primary hover:underline underline-offset-4 font-medium transition-colors" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                        />
                    ),
                    img: ({node, ...props}) => props.src ? <img {...props} className="rounded-lg border border-border/50 shadow-sm" /> : null,
                    video: ({node, ...props}) => props.src ? <video {...props} className="rounded-lg border border-border/50 shadow-sm" controls /> : null
                }}
            >
                {value || "*Nothing to preview*"}
            </ReactMarkdown>
        </div>
    );
}
