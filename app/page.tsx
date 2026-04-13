import Link from "next/link";

type Post = {
  title: string;
  body: string;
  tag: string;
  imageUrl?: string | null;
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
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts: Post[] = await res.json();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
            AI in Business
          </p>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
                AI in Marketing &amp; Customer Experience
              </h1>

              <p className="text-lg text-gray-600 leading-8 max-w-2xl">
                A blog exploring how artificial intelligence is shaping
                marketing, personalization, customer support, and modern
                business strategy.
              </p>
            </div>

            <div>
              <Link href="/create-post">
                <button className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-700 hover:scale-105 transition">
                  + Create Post
                </button>
              </Link>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-10" />

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <article className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition duration-300">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
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