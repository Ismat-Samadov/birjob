// src/lib/groq.ts
import OpenAI from "openai";

// Initialize the client with Groq's API endpoint
export const groqClient = new OpenAI({
  apiKey: process.env.BIRJOB_AI_GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});