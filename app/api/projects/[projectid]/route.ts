import { NextRequest, NextResponse } from "next/server";
import { getProjectById, serializeMongo } from "@/lib/server/repositories";

type RouteContext = {
  params: Promise<{
    projectid: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { projectid } = await context.params;
  const project = await getProjectById(projectid);

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ project: serializeMongo(project) });
}
