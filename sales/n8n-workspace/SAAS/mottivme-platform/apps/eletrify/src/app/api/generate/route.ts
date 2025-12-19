import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai/index.mjs";
import { buildCopyPrompt, buildEmailPrompt, buildVSLPrompt } from "@/lib/ai/prompts/copy";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...input } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      );
    }

    let prompt: string;

    switch (type) {
      case "copy":
        prompt = buildCopyPrompt(input);
        break;
      case "email":
        prompt = buildEmailPrompt(input);
        break;
      case "vsl":
        prompt = buildVSLPrompt(input);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid type" },
          { status: 400 }
        );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em copywriting usando a metodologia SEXY CANVAS de André Diamand. Você cria copies que ELETRIFICAM usando os 14 gatilhos emocionais. Sempre seja específico, visceral e emocional.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      content,
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
        totalTokens: completion.usage?.total_tokens,
      },
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
