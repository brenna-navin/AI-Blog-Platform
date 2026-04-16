import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Post = {
  id?: number;
  title: string;
  body: string;
  tag: string;
  image_url?: string | null;
  date: string;
  slug: string;
};

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !post) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <article>
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-72 object-cover rounded-2xl mb-8"
            />
          )}

          <p className="text-sm text-gray-500 mb-3">
            {post.date} • {post.tag}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="text-lg leading-8 text-gray-700 whitespace-pre-line">
            {post.body}
          </div>
        </article>
      </div>
    </main>
  );
}