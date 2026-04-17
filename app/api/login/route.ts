import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (username === "admin" && password === "password123") {
      const response = NextResponse.json({ message: "Login successful" });

      response.cookies.set("admin-auth", "true", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}