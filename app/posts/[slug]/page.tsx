import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type Post = {
  id?: number;
  title: string;
  body: string;
  tag: string;
  imageUrl?: string | null;
  date: string;
};

async function getPosts(): Promise<Post[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing Supabase env vars");
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }

  return (data as Post[]) ?? [];
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

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
            No posts yet.
          </div>
        ) : (
          <div className="grid gap-10">
            {posts.map((post, index) => {
              const slug = post.title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

              return (
                <Link
                  key={post.id ?? index}
                  href={`/posts/${slug}`}
                  className="group"
                >
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
        )}
      </div>
    </main>
  );
}