"use client";

import { useState, useRef, useEffect, use } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { DEPLOYER_ADDRESS } from "@/lib/constants";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPost, updatePost, uploadFile } from "@/lib/blog-api";
import { useSignMessage } from "wagmi";
import { MarkdownEditor } from "@/components/markdown-editor";
import TextareaAutosize from "react-textarea-autosize";

export default function EditPostClient({ slug }: { slug: string }) {
  const { address } = useWallet();
  const isOwner = address?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase();
  const router = useRouter();
  const { signMessageAsync } = useSignMessage();

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pendingUploads = useRef<Map<string, File>>(new Map());

  useEffect(() => {
    getPost(slug).then((post) => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setExcerpt(post.excerpt);
        }
        setIsLoading(false);
    });
  }, [slug]);

  const getAuth = async () => {
      const timestamp = Date.now();
      const message = `Authorize Blog Action\nTimestamp: ${timestamp}`;
      const signature = await signMessageAsync({ message });
      return { signature, timestamp };
  }

  const handleEditorUpload = async (file: File) => {
      const blobUrl = URL.createObjectURL(file);
      pendingUploads.current.set(blobUrl, file);
      return blobUrl;
  };

  const handleUpdate = async () => {
    if (!isOwner) return;
    if (!title || !content) {
        alert("Please fill in Title and Content.");
        return;
    }

    setIsSubmitting(true);
    try {
        // Single signature for all actions
        const auth = await getAuth();
        
        let finalContent = content;

        // Process pending uploads
        for (const [blobUrl, file] of pendingUploads.current.entries()) {
            if (finalContent.includes(blobUrl)) {
                try {
                    const { url: r2Url } = await uploadFile(file, auth);
                    finalContent = finalContent.replaceAll(blobUrl, r2Url);
                } catch (err) {
                    console.error("Failed to upload image:", file.name, err);
                    alert(`Failed to upload ${file.name}`);
                    setIsSubmitting(false);
                    return;
                }
            }
        }

        await updatePost(slug, { 
            title, 
            content: finalContent, 
            excerpt, 
            published: true,
        }, auth);

        // Cleanup
        for (const blobUrl of pendingUploads.current.keys()) {
            URL.revokeObjectURL(blobUrl);
        }
        pendingUploads.current.clear();

        alert("Post updated!");
        router.push(`/blog/${slug}`);
        router.refresh();
    } catch (error) {
        console.error(error);
        alert("Error updating post");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOwner) {
      return (
          <main className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center">
              <p className="text-muted-foreground">Access denied.</p>
          </main>
      )
  }

  if (isLoading) {
      return (
          <main className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </main>
      )
  }

  return (
    <main className="min-h-screen pt-32 pb-32 px-6 bg-background">
      <div className="container mx-auto max-w-3xl space-y-8">
        
        <Link 
            href={`/blog/${slug}`} 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to post
        </Link>

        {/* Document Editing Area */}
        <div className="space-y-6 pt-4">
            {/* Title Input */}
            <TextareaAutosize 
                placeholder="Post Title" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-transparent text-4xl md:text-5xl font-bold font-display placeholder:text-muted-foreground/30 focus:outline-none resize-none leading-tight"
                minRows={1}
            />

            {/* Meta Data (Slug & Excerpt) - Subtle Inputs */}
            <div className="space-y-4 border-l-2 border-border pl-4 py-2 opacity-50 focus-within:opacity-100 transition-opacity">
                <div className="w-full bg-transparent font-mono text-sm text-muted-foreground">
                    /{slug}
                </div>
                <TextareaAutosize 
                    placeholder="Excerpt (optional)..." 
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    className="w-full bg-transparent text-lg text-muted-foreground focus:text-foreground focus:outline-none resize-none"
                    minRows={1}
                />
            </div>

            {/* Markdown Content Editor */}
            <MarkdownEditor 
                value={content}
                onChange={setContent}
                onUpload={handleEditorUpload}
                actions={
                    <button 
                        onClick={handleUpdate}
                        disabled={isSubmitting}
                        className="px-5 py-2 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Post"
                        )}
                    </button>
                }
            />
        </div>
      </div>
    </main>
  );
}
