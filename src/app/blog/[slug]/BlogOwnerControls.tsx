"use client";

import { useWallet } from "@/hooks/use-wallet";
import { DEPLOYER_ADDRESS } from "@/lib/constants";
import { Loader2, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/blog-api";
import { useSignMessage } from "wagmi";
import { useState } from "react";

interface BlogOwnerControlsProps {
    slug: string;
}

export function BlogOwnerControls({ slug }: BlogOwnerControlsProps) {
    const { address } = useWallet();
    const isOwner = address?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase();
    const router = useRouter();
    const { signMessageAsync } = useSignMessage();
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOwner) return null;

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
        
        setIsDeleting(true);
        try {
            const timestamp = Date.now();
            const message = `Authorize Blog Action\nTimestamp: ${timestamp}`;
            const signature = await signMessageAsync({ message });
            
            await deletePost(slug, { signature, timestamp });
            
            alert("Post deleted successfully");
            router.push("/blog");
            router.refresh();
        } catch (error) {
            console.error("Failed to delete post:", error);
            alert("Failed to delete post");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link 
                href={`/blog/${slug}/edit`}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-md transition-colors"
            >
                <Edit className="w-4 h-4" />
                Edit
            </Link>
            <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-500/80 hover:text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors disabled:opacity-50"
            >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
            </button>
        </div>
    );
}
