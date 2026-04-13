import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type Post = {
  title: string;
  body: string;
  tag: string;
  imageUrl?: string | null;
  date: string;
  slug: string;
  source?: "manual" | "automated";
};

const filePath = path.join(process.cwd(), "data", "posts.json");
const API_KEY = "my-secret-key";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

async function readPosts(): Promise<Post[]> {
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch {
    return [];
  }
}

async function writePosts(posts: Post[]) {
  await fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf-8");
}

function isProductionDeployment() {
  return process.env.VERCEL === "1";
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const posts = await readPosts();
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Failed to read post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    if (isProductionDeployment()) {
      return NextResponse.json(
        { error: "Post editing is disabled in production." },
        { status: 403 }
      );
    }

    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { slug } = await context.params;
    const requestBody = await request.json();

    const title = requestBody.title?.trim();
    const bodyText = requestBody.body?.trim();
    const tag = requestBody.tag?.trim();
    const imageUrl = requestBody.imageUrl?.trim() || null;

    if (!title || !bodyText || !tag) {
      return NextResponse.json(
        { error: "Title, body, and tag are required." },
        { status: 400 }
      );
    }

    const posts = await readPosts();
    const postIndex = posts.findIndex((p) => p.slug === slug);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existingPost = posts[postIndex];
    const nextSlugBase = createSlug(title);
    let nextSlug = nextSlugBase;
    let counter = 1;

    while (
      posts.some((post, index) => index !== postIndex && post.slug === nextSlug)
    ) {
      nextSlug = `${nextSlugBase}-${counter}`;
      counter++;
    }

    const updatedPost: Post = {
      ...existingPost,
      title,
      body: bodyText,
      tag,
      imageUrl,
      slug: nextSlug,
    };

    posts[postIndex] = updatedPost;
    await writePosts(posts);

    return NextResponse.json(updatedPost);
  } catch {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    if (isProductionDeployment()) {
      return NextResponse.json(
        { error: "Post deletion is disabled in production." },
        { status: 403 }
      );
    }

    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { slug } = await context.params;
    const posts = await readPosts();
    const filteredPosts = posts.filter((post) => post.slug !== slug);

    if (filteredPosts.length === posts.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await writePosts(filteredPosts);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
