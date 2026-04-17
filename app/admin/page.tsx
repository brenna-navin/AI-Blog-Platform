"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
  tag: string;
  slug: string;
  date: string;
  image_url?: string | null;
};

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts", {
        cache: "no-store",
      });

      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      setDeletingId(id);

      const res = await fetch("/api/delete-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete post.");
        return;
      }

      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
              AI in Business
            </p>

            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Admin Dashboard
            </h1>

            <p className="text-lg text-gray-600">
              Manage your blog posts here.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/create-post"
              className="bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-700 transition"
            >
              + Create Post
            </a>

            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-900 px-5 py-2 rounded-full hover:bg-gray-300 transition"
            >
              Log Out
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-600">No posts found.</p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm"
              >
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-[260px] object-cover rounded-2xl mb-6"
                  />
                )}

                <p className="text-sm text-gray-500 mb-3">
                  {post.date} • {post.tag}
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                  {post.title}
                </h2>

                <p className="text-gray-600 text-lg leading-8 mb-6">
                  {post.body.substring(0, 140)}...
                </p>

                <div className="flex gap-3">
                  <a
                    href={`/posts/${post.slug}`}
                    className="bg-gray-200 text-gray-900 px-5 py-2 rounded-full hover:bg-gray-300 transition"
                  >
                    View
                  </a>

                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {deletingId === post.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}