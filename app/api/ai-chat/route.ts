import OpenAI from "openai";
import { NextResponse } from "next/server";
import { parseAiChatPayload } from "@/lib/api-validation";

export async function POST(req: Request) {
  try {
    const parsed = parseAiChatPayload(await req.json());

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("AI route error: OPENAI_API_KEY is not configured.");
      return NextResponse.json(
        { error: "AI chat is not configured yet." },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const { messages, appContext } = parsed.payload;

    const response = await openai.responses.create({
      model: "gpt-5.4-mini",
      instructions:
        "You are the AI assistant for an off-grid and project-based community app. Use app context when relevant.",
      input: [
        {
          role: "system",
          content: `App context: ${JSON.stringify(appContext ?? {})}`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ reply: response.output_text });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "AI chat request failed." },
      { status: 500 }
    );
  }
}
