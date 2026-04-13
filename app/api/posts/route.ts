import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "posts.json");

// GET = works on Vercel
export async function GET() {
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const posts = JSON.parse(fileData);
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to read posts" }, { status: 500 });
  }
}

// POST = disabled in production
export async function POST() {
  return NextResponse.json(
    { error: "Post creation disabled in production" },
    { status: 403 }
  );
}
