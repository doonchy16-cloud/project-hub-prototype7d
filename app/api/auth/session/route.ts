import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/server/auth";
import { getProfileById, serializeMongo } from "@/lib/server/repositories";

export async function GET(request: NextRequest) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const profile = await getProfileById(session.profileId);
  return NextResponse.json({ authenticated: true, session, profile: serializeMongo(profile) });
}
