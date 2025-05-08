// src/lib/groq.ts
import { Groq } from 'groq-sdk';

// Match the casing in your environment variable
const apiKey = process.env.birjob_ai_GROQ_API_KEY || "";

export const groqClient = new Groq({ apiKey });