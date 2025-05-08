// src/app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.error("Missing Groq API key");
    return NextResponse.json(
      { error: "Server configuration error - missing API key" },
      { status: 500 }
    );
  }

  try {
    const { messages } = await request.json();
    
    // Initialize client with the standard API key name
    const groqClient = new Groq({ apiKey });
    
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error with Groq API:", error);
    
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { error: "Failed to process AI request: " + errorMessage },
      { status: 500 }
    );
  }
}