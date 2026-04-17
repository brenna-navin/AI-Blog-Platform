import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function generateSlug(title: string) {
  return `${title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}-${Date.now()}`;
}

export async function POST(request: NextRequest) {
  try {
    const { id, title, body, tag, image_url } = await request.json();

    if (!id || !title || !body || !tag) {
      return NextResponse.json(
        { error: "ID, title, body, and tag are required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase environment variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const slug = generateSlug(title);

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        body,
        tag,
        image_url: image_url || null,
        slug,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update post error:", error);

    return NextResponse.json(
      { error: "Failed to update post." },
      { status: 500 }
    );
  }
}