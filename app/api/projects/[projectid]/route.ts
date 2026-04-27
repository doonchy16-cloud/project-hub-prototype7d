import { NextRequest, NextResponse } from "next/server";
import { getProjectById, serializeMongo } from "@/lib/server/repositories";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ project: serializeMongo(project) });
}
