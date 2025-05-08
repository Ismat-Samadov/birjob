// src/lib/groq.ts
import { Groq } from 'groq-sdk';

// Initialize the Groq client with your API key
export const groqClient = new Groq({ 
  apiKey: process.env.BIRJOB_AI_GROQ_API_KEY || "" 
});