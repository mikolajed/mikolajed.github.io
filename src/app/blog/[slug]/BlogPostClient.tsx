"use client";

import { useEffect, useState, use } from "react";
import { getPost, BlogPost } from "@/lib/blog-api";
import Link from "next/link";
import { ArrowLeft, Loader2, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { BlogOwnerControls } from "@/app/blog/[slug]/BlogOwnerControls";
import { Mermaid } from "@/components/mermaid";

export default function BlogPostClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPost(slug).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
        <main className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
    );
  }

  if (!post) {
      return (
        <main className="min-h-screen pt-32 pb-16 px-6">
            <div className="container mx-auto max-w-3xl text-center space-y-4">
                <h1 className="text-2xl font-bold">Post not found</h1>
                <Link href="/blog" className="text-primary hover:underline">Back to blog</Link>
            </div>
        </main>
      )
  }

  return (
    <main className="min-h-screen pt-32 pb-32 px-6 bg-background">
      <article className="container mx-auto max-w-3xl">
        {/* Header */}
        <header className="space-y-6 mb-12">
            <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to notes
            </Link>

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={new Date(post.created_at).toISOString()}>
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                    <div className="ml-auto">
                        <BlogOwnerControls slug={slug} />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display text-foreground leading-tight">
                    {post.title}
                </h1>
                {post.excerpt && (
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {post.excerpt}
                    </p>
                )}
            </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none font-serif leading-relaxed prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground">
            <ReactMarkdown 
                rehypePlugins={[rehypeRaw]}
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
                    img: ({node, ...props}) => props.src ? <img {...props} className="rounded-lg border border-border/50 shadow-sm w-full my-8" /> : null,
                    video: ({node, ...props}) => props.src ? (
                        <video {...props} className="rounded-lg border border-border/50 shadow-sm w-full my-8" controls playsInline />
                    ) : null,
                    a: ({node, ...props}) => <a {...props} className="text-primary hover:underline underline-offset-4" target="_blank text-wrap break-all" rel="noopener noreferrer" />
                }}
            >
                {post.content}
            </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
