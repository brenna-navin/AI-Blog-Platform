import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { supabase } from "./lib/supabase";

type Post = {
  id?: number;
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

export default async function Home() {
  noStore();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return <div>Error loading posts</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
            AI in Business
          </p>

          <div className="flex flex-col gap-6">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
                AI in Marketing & Customer Experience
              </h1>

              <p className="text-lg text-gray-600 leading-8 max-w-2xl">
                A blog exploring how artificial intelligence is shaping
                marketing, personalization, customer support, and modern
                business strategy.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-10" />

        <div className="grid gap-6">
          {posts?.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <article className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition duration-300">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-56 object-cover rounded-2xl mb-4"
                  />
                )}

                <p className="text-sm text-gray-500 mb-3">
                  {post.date} • {post.tag} • {getReadingTime(post.body)}
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                  {post.title}
                </h2>

                <p className="text-gray-600 text-lg leading-8">
                  {post.body.substring(0, 140)}...
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}