import Link from "next/link";
import { headers } from "next/headers";

type Post = {
  id?: string;
  title: string;
  body: string;
  tag: string;
  imageUrl?: string | null;
  date: string;
};

async function getPosts(): Promise<Post[]> {
  const headersList = await headers();
  const host = headersList.get("host");

  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-gray-500">
            AI IN BUSINESS
          </p>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="mb-4 text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
                AI in Marketing & Customer Experience
              </h1>

              <p className="text-lg leading-relaxed text-gray-600">
                A blog exploring how artificial intelligence is shaping
                marketing, personalization, customer support, and modern
                business strategy.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-10">
          {posts.map((post, index) => {
            const slug = post.title
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");

            return (
              <Link key={post.id ?? index} href={`/posts/${slug}`} className="group">
                <article className="overflow-hidden rounded-2xl border border-gray-200 transition hover:shadow-lg">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-[300px] w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    <p className="mb-2 text-sm text-gray-500">
                      {post.date} • {post.tag} • 2 min read
                    </p>

                    <h2 className="mb-3 text-2xl font-semibold text-gray-900 group-hover:underline">
                      {post.title}
                    </h2>

                    <p className="line-clamp-3 text-gray-600">{post.body}</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}