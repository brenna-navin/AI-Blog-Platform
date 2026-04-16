"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const slug = title.toLowerCase().replace(/\s+/g, "-");
    const date = new Date().toLocaleDateString();

    const res = await fetch("/api/create-post", {
      method: "POST",
      body: JSON.stringify({
        title,
        tag,
        image_url: imageUrl,
        body,
        slug,
        date,
      }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Error creating post");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
          AI in Business
        </p>

        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Create a New Post
        </h1>

        <p className="text-gray-600 mb-10">
          Add a new blog post to your AI in Business website.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* Tag */}
          <input
            type="text"
            placeholder="Example: AI Trends"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* Image URL */}
          <input
            type="text"
            placeholder="Paste image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* Body */}
          <textarea
            placeholder="Write your post here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* Submit */}
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition"
          >
            Publish Post
          </button>
        </form>
      </div>
    </main>
  );
}