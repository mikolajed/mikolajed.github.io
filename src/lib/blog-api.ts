import { BLOG_API_URL } from "@/lib/constants";
const API_URL = BLOG_API_URL;

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  created_at: number;
  updated_at: number;
}

export async function createPost(
  post: Omit<BlogPost, "created_at" | "updated_at">,
  auth: { signature: string; timestamp: number }
) {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Signature": auth.signature,
      "X-Timestamp": auth.timestamp.toString(),
    },
    body: JSON.stringify(post),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function uploadFile(file: File, auth: { signature: string; timestamp: number }) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      "X-Signature": auth.signature,
      "X-Timestamp": auth.timestamp.toString(),
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/posts`, { 
        next: { revalidate: 60 },
        cache: 'no-store' 
    });
    if (!res.ok) {
        console.warn(`Failed to fetch posts: ${res.status} ${res.statusText}`);
        return [];
    }
    return res.json();
  } catch (e) {
    console.warn("Failed to fetch posts (likely offline or build):", e);
    return [];
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}
