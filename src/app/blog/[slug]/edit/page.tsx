import { getPosts } from "@/lib/blog-api";
import EditPostClient from "./EditPostClient";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EditPostClient slug={slug} />;
}
