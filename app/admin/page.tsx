"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Post = {
  title: string;
  body: string;
  tag: string;
  imageUrl?: string | null;
  date: string;
  slug: string;
  source?: "manual" | "automated";
};

const ADMIN_PASSWORD = "admin123";
const API_KEY = "my-secret-key";

export default function AdminPage() {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  async function fetchPosts() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/posts", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("Failed to load posts");
      }

      const data: Post[] = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isUnlocked) return;
    fetchPosts();
  }, [isUnlocked]);

  const recentPosts = useMemo(() => posts.slice(0, 10), [posts]);

  const lastAutomatedPost = useMemo(() => {
    return posts.find((post) => (post.source ?? "manual") === "automated");
  }, [posts]);

  const manualPostsCount = useMemo(() => {
    return posts.filter((post) => (post.source ?? "manual") === "manual").length;
  }, [posts]);

  function handleUnlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (enteredPassword === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  async function handleDelete(slug: string, title: string) {
    const confirmed = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingSlug(slug);
    setError("");

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${API_KEY}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.slug !== slug)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeletingSlug(null);
    }
  }

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-block text-sm text-gray-500 hover:text-gray-900 transition"
            >
              ← Back to Home
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-[2rem] p-8 md:p-10 shadow-sm">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
              Admin
            </p>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Dashboard Access
            </h1>

            <p className="text-gray-600 leading-8 mb-8">
              Enter the admin password to manage your blog posts.
            </p>

            <form onSubmit={handleUnlock} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
              Admin
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
              Blog Dashboard
            </h1>
            <p className="text-lg text-gray-600 leading-8 max-w-2xl">
              Review posts, edit content, and manage your blog from one dashboard.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="px-5 py-3 rounded-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition"
            >
              View Blog
            </Link>

            <Link
              href="/create-post"
              className="px-5 py-3 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition"
            >
              + New Post
            </Link>
          </div>
        </div>

        {error && <p className="text-red-600 mb-6">{error}</p>}

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm">
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <div className="bg-white border border-gray-200 rounded-[2rem] p-7 shadow-sm">
                <p className="text-sm uppercase tracking-wide text-gray-500 mb-3">
                  Total Posts
                </p>
                <h2 className="text-4xl font-bold text-gray-900">{posts.length}</h2>
                <p className="text-sm text-gray-500 mt-3">
                  All blog posts currently in your data file.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-[2rem] p-7 shadow-sm">
                <p className="text-sm uppercase tracking-wide text-gray-500 mb-3">
                  Last Automated Post
                </p>
                <h2 className="text-2xl font-semibold text-gray-900 leading-snug">
                  {lastAutomatedPost ? lastAutomatedPost.date : "None yet"}
                </h2>
                <p className="text-sm text-gray-500 mt-3">
                  Most recent automated post date, if one exists.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-[2rem] p-7 shadow-sm">
                <p className="text-sm uppercase tracking-wide text-gray-500 mb-3">
                  Manual Posts
                </p>
                <h2 className="text-4xl font-bold text-gray-900">{manualPostsCount}</h2>
                <p className="text-sm text-gray-500 mt-3">
                  Posts created manually through your form.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-[2rem] p-6 md:p-8 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-8">
                <div>
                  <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-2">
                    Activity
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Recent Posts
                  </h2>
                </div>

                <p className="text-sm text-gray-500">
                  Open any post, edit it, or delete it.
                </p>
              </div>

              {recentPosts.length === 0 ? (
                <p className="text-gray-600">No posts yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post.slug}
                      className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition duration-200"
                    >
                      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div className="min-w-0">
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2 break-words">
                            {post.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.tag}</span>
                            <span
                              className={`ml-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                (post.source ?? "manual") === "automated"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {post.source ?? "manual"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 lg:justify-end">
                          <Link
                            href={`/posts/${post.slug}`}
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-4 px-1 py-2"
                          >
                            View
                          </Link>

                          <Link
                            href={`/admin/edit/${post.slug}`}
                            className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 px-4 py-2 rounded-full transition"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(post.slug, post.title)}
                            disabled={deletingSlug === post.slug}
                            className="text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition disabled:opacity-60"
                          >
                            {deletingSlug === post.slug ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}