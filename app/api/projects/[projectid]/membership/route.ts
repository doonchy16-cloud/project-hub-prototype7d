import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/server/auth";
import { setProjectMembership } from "@/lib/server/repositories";

export async function POST(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const body = await request.json();
  const action = body.action === "leave" ? "leave" : body.action === "request" ? "request" : "join";

  try {
    const result = await setProjectMembership({ projectId, profileId: session.profileId, action });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Membership update failed." }, { status: 500 });
  }
}
