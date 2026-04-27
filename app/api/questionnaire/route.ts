import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/server/auth";
import { getQuestionnaireAnswers, saveQuestionnaireAnswers, serializeMongo } from "@/lib/server/repositories";

export async function GET(request: NextRequest) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const answers = await getQuestionnaireAnswers(session.profileId);
  return NextResponse.json({ questionnaire: serializeMongo(answers) });
}

export async function PUT(request: NextRequest) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
  await saveQuestionnaireAnswers(session.profileId, answers);
  return NextResponse.json({ ok: true });
}
