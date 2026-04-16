import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Post id is required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Post deleted successfully." });
  } catch {
    return NextResponse.json(
      { error: "Server error deleting post." },
      { status: 500 }
    );
  }
}