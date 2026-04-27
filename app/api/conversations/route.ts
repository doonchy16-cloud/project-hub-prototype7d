import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/server/auth";
import { ensureGlobalConversation, ensureProfileConversationMembership, listConversationsForProfile, objectIdToString, serializeMongoMany } from "@/lib/server/repositories";

export async function GET(request: NextRequest) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const includeGlobal = request.nextUrl.searchParams.get("includeGlobal") === "true";
  if (includeGlobal) {
    const globalConversation = await ensureGlobalConversation();
    if (globalConversation?._id) {
      await ensureProfileConversationMembership(session.profileId, objectIdToString(globalConversation._id));
    }
  }

  const conversations = await listConversationsForProfile(session.profileId);
  return NextResponse.json({ conversations: serializeMongoMany(conversations) });
}
