// src/app/api/ai/chat/route.ts
import { Groq } from 'groq-sdk';
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Get API key from environment variables
  const apiKey = process.env.BIRJOB_AI_GROQ_API_KEY;
  
  // Validate API key is present
  if (!apiKey) {
    console.error("Missing Groq API key");
    return NextResponse.json(
      { error: "Server configuration error - missing API key" },
      { status: 500 }
    );
  }

  try {
    const { messages } = await request.json();
    
    // Initialize the client with each request to ensure latest config
    const groqClient = new Groq({ apiKey });

    // Log that we're making a request (but don't log the full key)
    console.log(`Making Groq API request with key starting with: ${apiKey.substring(0, 5)}...`);
    
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Using the model from Vercel docs
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error with Groq API:", error);
    
    // Provide more specific error information
    if ((error as { status?: number }).status === 401) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your Groq API key configuration." },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    );
  }
}