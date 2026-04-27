import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/server/auth";
import { listFavorites, replaceFavorites, serializeMongoMany } from "@/lib/server/repositories";

export async function GET(request: NextRequest) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await listFavorites(session.profileId);
  return NextResponse.json({ favorites: serializeMongoMany(favorites) });
}

export async function PUT(request: NextRequest) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const projectIds = Array.isArray(body.projectIds) ? body.projectIds.map(String) : [];
  await replaceFavorites(session.profileId, projectIds);
  return NextResponse.json({ ok: true });
}
