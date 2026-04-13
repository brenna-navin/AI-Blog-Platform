import Link from "next/link";
import { notFound } from "next/navigation";
import posts from "../../../data/posts.json";

type Post = {
  title: string;
  body: string;
  tag: string;
  imageUrl?: string | null;
  date: string;
  slug: string;
  source?: "manual" | "automated";
};

function getReadingTime(text: string) {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} min read`;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const allPosts = posts as Post[];
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-block text-sm text-gray-500 hover:text-gray-900 mb-8 transition"
        >
          ← Back to Home
        </Link>

        <article className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm">
          <p className="text-sm text-gray-500 mb-3">
            {post.date} • {post.tag} • {getReadingTime(post.body)}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-[300px] object-cover rounded-2xl mb-6"
            />
          )}

          <div className="text-lg text-gray-700 leading-9 whitespace-pre-line">
            {post.body}
          </div>
        </article>
      </div>
    </main>
  );
}