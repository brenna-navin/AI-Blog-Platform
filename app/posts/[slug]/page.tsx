import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type Post = {
  id?: number;
  title: string;
  body: string;
  tag: string;
  slug: string;
  image_url?: string | null;
  date: string;
};

async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing Supabase env vars");
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }

  return data as Post;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <article className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to all posts
        </Link>

        <p className="mb-4 text-sm text-gray-500">
          {post.date} • {post.tag} • 2 min read
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          {post.title}
        </h1>

        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="mb-8 h-[400px] w-full rounded-2xl object-cover"
          />
        )}

        <div className="prose prose-lg max-w-none text-gray-700">
          <p>{post.body}</p>
        </div>
      </article>
    </main>
  );
}