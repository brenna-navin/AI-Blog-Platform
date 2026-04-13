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

export async function GET() {
  try {
    const posts = await readPosts();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "Failed to read posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const requestBody = await request.json();

    const title = requestBody.title?.trim();
    const bodyText = requestBody.body?.trim();
    const tag = requestBody.tag?.trim();
    const imageUrl = requestBody.imageUrl?.trim() || null;
    const source = requestBody.source === "automated" ? "automated" : "manual";

    if (!title || !bodyText || !tag) {
      return NextResponse.json(
        { error: "Title, body, and tag are required." },
        { status: 400 }
      );
    }

    const posts = await readPosts();

    const baseSlug = createSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (posts.some((post) => post.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newPost: Post = {
      title,
      body: bodyText,
      tag,
      imageUrl,
      date: new Date().toLocaleDateString(),
      slug,
      source,
    };

    posts.unshift(newPost);
    await writePosts(posts);

    return NextResponse.json(newPost, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}