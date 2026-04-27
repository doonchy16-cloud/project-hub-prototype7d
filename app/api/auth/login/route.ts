import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME, verifyPassword } from "@/lib/server/auth";
import { findUserByEmail } from "@/lib/server/repositories";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "email and password are required." }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const sessionUser = {
      userId: user._id.toHexString(),
      profileId: user.profileId.toHexString(),
      email: user.email,
    };
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
    console.error("Login failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed." },
      { status: 500 }
    );
  }
}
