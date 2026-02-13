"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { DEPLOYER_ADDRESS } from "@/lib/constants";
import { getPosts, BlogPost } from "@/lib/blog-api";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function BlogPage() {
  const { address } = useWallet();
  const isOwner = address?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);



  return (
    <main className="min-h-screen pt-32 pb-16 px-6">
      <div className="container mx-auto max-w-4xl space-y-12">
        <header className="space-y-4 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight font-display">Notes & Thoughts</h1>
            <p className="text-muted-foreground text-lg">
                A storage for my thoughts on crypto, engineering, and life.
            </p>
          </div>
          {isOwner && (
            <Link
                href="/blog/new"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
                Create New Post
            </Link>
          )}
        </header>

        {/* Admin Creation Form */}


        {/* Posts List */}
        {loading ? (
           <div className="flex justify-center py-12">
             <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
           </div>
        ) : (
            <div className="grid gap-8">
                {posts.length === 0 ? (
                    <p className="text-muted-foreground italic">No posts found.</p>
                ) : (
                    posts.map(post => (
                        <article key={post.slug} className="group relative flex flex-col items-start p-6 rounded-2xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50">
                            <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                <Link href={`/blog/${post.slug}`}>
                                    <span className="absolute inset-0" />
                                    {post.title}
                                </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {new Date(post.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                            {post.excerpt && (
                                <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                </p>
                            )}
                        </article>
                    ))
                )}
            </div>
        )}
      </div>
    </main>
  );
}
