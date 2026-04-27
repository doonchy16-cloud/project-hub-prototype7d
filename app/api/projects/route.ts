import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/server/auth";
import { createProject, listProjects, serializeMongoMany } from "@/lib/server/repositories";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects: serializeMongoMany(projects) });
}

export async function POST(request: NextRequest) {
  const session = await getSessionUserFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();

    if (!title || !description) {
      return NextResponse.json({ error: "title and description are required." }, { status: 400 });
    }

    const projectId = await createProject({
      ownerProfileId: session.profileId,
      title,
      description,
      category: body.category,
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [],
      city: body.city,
      region: body.region,
      country: body.country,
      continent: body.continent,
      location: body.location,
      lat: typeof body.lat === "number" ? body.lat : undefined,
      lng: typeof body.lng === "number" ? body.lng : undefined,
      privacy: body.privacy === "private" ? "private" : "public",
    });

    return NextResponse.json({ ok: true, projectId }, { status: 201 });
  } catch (error) {
    console.error("Create project failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Create project failed." }, { status: 500 });
  }
}
