import { notFound } from "next/navigation";

type Post = {
  id: number;
  title: string;
  body: string;
  tag: string;
  slug: string;
  date: string;
  image_url?: string | null;
};

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  // 🔥 FIX: remove timestamp from slug
  const cleanSlug = params.slug.split("-").slice(0, -1).join("-");

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/posts`, {
    cache: "no-store",
  });

  const data = await res.json();

  const post = data.posts.find((p: Post) => p.slug === cleanSlug);

  if (!post) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <p className="text-gray-500 mb-6">
        {post.date} • {post.tag}
      </p>

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-72 object-cover rounded-2xl mb-8"
        />
      )}

      <div className="text-lg leading-8 whitespace-pre-line text-gray-700">
        {post.body}
      </div>
    </main>
  );
}