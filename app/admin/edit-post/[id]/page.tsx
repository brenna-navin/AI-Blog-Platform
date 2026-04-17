"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch("/api/posts", { cache: "no-store" });
        const data = await res.json();

        if (!Array.isArray(data)) {
          alert("Failed to load post.");
          return;
        }

        const post = data.find((p) => String(p.id) === String(id));

        if (!post) {
          alert("Post not found.");
          router.push("/admin");
          return;
        }

        setTitle(post.title || "");
        setBody(post.body || "");
        setTag(post.tag || "");
        setImageUrl(post.image_url || "");
      } catch (error) {
        console.error("Error loading post:", error);
        alert("Something went wrong loading the post.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/update-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(id),
          title,
          body,
          tag,
          image_url: imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update post.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong while updating the post.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
        <div className="max-w-3xl mx-auto text-gray-600">Loading post...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
          AI in Business
        </p>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">Edit Post</h1>

        <p className="text-lg text-gray-600 mb-10">
          Update your blog post details below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
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
              required
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={10}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <a
              href="/admin"
              className="bg-gray-200 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-300 transition"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}