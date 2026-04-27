import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/server/env";
import { getMongoDb } from "@/lib/server/mongodb";

export async function GET() {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          configured: false,
          error: "MongoDB Atlas is not configured. Set MONGODB_URI, MONGODB_DB, and APP_SESSION_SECRET.",
        },
        { status: 503 }
      );
    }

    const db = await getMongoDb();
    await db.command({ ping: 1 });

    return NextResponse.json({ ok: true, configured: true });
  } catch (error) {
    console.error("MongoDB health check failed", error);
    return NextResponse.json({ ok: false, configured: true, error: "MongoDB connection failed." }, { status: 500 });
  }
}
