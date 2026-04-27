import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME, hashPassword } from "@/lib/server/auth";
import { createProfileAndUser } from "@/lib/server/repositories";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const phone = String(body.phone || "").trim();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "fullName, email, and password are required." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const sessionUser = await createProfileAndUser({ fullName, email, passwordHash, phone });
    const token = await createSessionToken(sessionUser);

    const response = NextResponse.json({ ok: true, user: sessionUser });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("Signup failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Signup failed." },
      { status: 500 }
    );
  }
}
