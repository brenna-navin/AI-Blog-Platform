import Link from "next/link";

type Post = {
  id?: string;
  title: string;
  body: string;
  tag: string;
  imageUrl?: string | null;
  date: string;
};

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts`, {
    cache: "no-store",
  });

  const posts: Post[] = await res.json();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
            AI IN BUSINESS
          </p>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
                AI in Marketing & Customer Experience
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                A blog exploring how artificial intelligence is shaping
                marketing, personalization, customer support, and modern
                business strategy.
              </p>
            </div>

            {/* ❌ CREATE POST BUTTON REMOVED */}
          </div>
        </div>

        {/* POSTS */}
        <div className="grid gap-10">
          {posts.map((post, index) => (
            <Link
              key={index}
              href={`/posts/${post.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}`}
              className="group"
            >
              <div className="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-[300px] object-cover"
                  />
                )}

                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">
                    {post.date} • {post.tag} • 2 min read
                  </p>

                  <h2 className="text-2xl font-semibold text-gray-900 group-hover:underline mb-3">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 line-clamp-3">
                    {post.body}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}