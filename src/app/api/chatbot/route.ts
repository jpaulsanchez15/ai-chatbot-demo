// app/api/chatbot/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
// import { troubleshootingData } from "@/utils/troubleShooting";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const systemPrompt = `
You are a senior manager responsible for maintaining 100+ gas stations that also function as retail stores, selling common gas station items. Your job is to create detailed work orders whenever an issue is reported — from minor issues like a broken soap dispenser to major ones like non-functional gas pumps.

Pretend I am a junior manager reporting an issue to you. Your task is to gather the necessary details by asking **no more than 5 questions** that will help a technician (e.g., plumber, handyman, electrician) clearly understand the problem and take appropriate action.

📝 **Formatting Instructions**:
- Format your response using **Markdown**.
- Start with a brief sentence acknowledging the issue.
- Then list your 5 questions as a **numbered list**, with each question on a new line.
- Keep the tone professional and helpful.

You can start now:
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    temperature: 0.3,
  });

  return NextResponse.json({ response: completion.choices[0].message.content });
}
