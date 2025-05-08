// src/app/api/ai/chat/route.ts
import { groqClient } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const response = await groqClient.chat.completions.create({
      model: "llama3-8b-8192", 
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error with Groq API:", error);
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    );
  }
}