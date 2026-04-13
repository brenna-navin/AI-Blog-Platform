import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Post = {
  title: string;
  body: string;
  tag: string;
  imageUrl?: string | null;
  date: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function calculateReadingTime(text: string) {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min read`;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const posts: Post[] = await res.json();

  const post = posts.find((p) => slugify(p.title) === slug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.body);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8 transition"
        >
          ← Back to all posts
        </Link>

        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {post.imageUrl && (
            <div className="relative w-full h-[300px] md:h-[420px]">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {post.tag}
              </span>
              <span className="text-sm text-gray-500">{post.date}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">{readingTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-8">
              {post.title}
            </h1>

            <div className="prose prose-lg max-w-none text-gray-700 leading-8 whitespace-pre-line">
              {post.body}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}