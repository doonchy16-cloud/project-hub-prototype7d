import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/server/auth";
import { createMessage, getProfileById, listMessagesForConversation, serializeMongoMany } from "@/lib/server/repositories";

export async function GET(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;
  const messages = await listMessagesForConversation(conversationId);
  return NextResponse.json({ messages: serializeMongoMany(messages) });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;
  const body = await request.json();
  const content = String(body.content || body.body || "").trim();
  if (!content) {
    return NextResponse.json({ error: "Message content is required." }, { status: 400 });
  }

  const profile = await getProfileById(session.profileId);
  const senderName = profile?.preferredName || profile?.fullName || session.email;
  const messageId = await createMessage({
    conversationId,
    senderProfileId: session.profileId,
    senderName,
    body: content,
  });

  return NextResponse.json({ ok: true, messageId }, { status: 201 });
}
