import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/server/auth";
import { getProfileById, serializeMongo, upsertProfile } from "@/lib/server/repositories";

export async function GET(request: NextRequest) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfileById(session.profileId);
  return NextResponse.json({ profile: serializeMongo(profile) });
}

export async function PATCH(request: NextRequest) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const profile = await upsertProfile(session.profileId, body);
  return NextResponse.json({ profile: serializeMongo(profile) });
}
