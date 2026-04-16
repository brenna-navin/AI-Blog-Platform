import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, tag, image_url, body: postBody, slug, date } = body;

    if (!title || !tag || !postBody || !slug || !date) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          tag,
          image_url: image_url || null,
          body: postBody,
          slug,
          date,
          source: "manual",
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Post created successfully.",
      post: data?.[0] ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error creating post." },
      { status: 500 }
    );
  }
}