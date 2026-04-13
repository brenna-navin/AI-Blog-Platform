"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const API_KEY = "my-secret-key";

export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          title,
          body,
          tag,
          imageUrl: imageUrl.trim() || null,
          source: "manual",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← Back to Home
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
            Admin
          </p>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Create a New Blog Post
          </h1>

          <p className="text-lg text-gray-600 leading-8 mb-8">
            Add a new post to your AI in Business blog.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog post title"
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tag
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Marketing, AI, Customer Experience..."
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your blog post here..."
                rows={10}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition disabled:opacity-60"
            >
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}