import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    projectid: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { projectid } = await context.params;

  return NextResponse.json({
    ok: true,
    projectid,
  });
}

export async function POST(_request: NextRequest, context: RouteContext) {
  const { projectid } = await context.params;

  return NextResponse.json({
    ok: true,
    status: "joined",
    projectid,
  });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { projectid } = await context.params;

  return NextResponse.json({
    ok: true,
    status: "left",
    projectid,
  });
}
