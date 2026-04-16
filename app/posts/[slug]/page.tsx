import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Post = {
  title: string;
  body: string;
  tag: string;
  image_url?: string | null;
  date: string;
  slug: string;
};

function getReadingTime(text: string) {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} min read`;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <article className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm">
        <p className="text-sm text-gray-500 mb-4">
          {post.date} • {post.tag} • {getReadingTime(post.body)}
        </p>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-72 object-cover rounded-2xl mb-8"
          />
        )}

        <div className="text-lg leading-8 text-gray-700 whitespace-pre-line">
          {post.body}
        </div>
      </article>
    </main>
  );
}