import { NextRequest, NextResponse } from "next/server";
import { calculateElectrificationScore, ALL_TRIGGERS } from "@/lib/triggers/sexy-canvas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const analysis = calculateElectrificationScore(text);

    // Enrich trigger data
    const enrichedTriggers = analysis.triggers.map((t) => {
      const triggerInfo = ALL_TRIGGERS[t.trigger];
      return {
        id: t.trigger,
        name: triggerInfo?.name || t.trigger,
        emoji: triggerInfo?.emoji || "",
        category: triggerInfo?.category || "unknown",
        matches: t.matches,
        matchCount: t.matches.length,
      };
    });

    // Get missing essential triggers
    const usedTriggers = analysis.triggers.map((t) => t.trigger);
    const essentialMissing = ["CURIOSIDADE", "SEGURANCA", "AVAREZA", "IRA"]
      .filter((t) => !usedTriggers.includes(t))
      .map((t) => {
        const triggerInfo = ALL_TRIGGERS[t];
        return {
          id: t,
          name: triggerInfo.name,
          emoji: triggerInfo.emoji,
          suggestion: triggerInfo.examples[0],
        };
      });

    return NextResponse.json({
      success: true,
      analysis: {
        score: analysis.score,
        scoreLabel: getScoreLabel(analysis.score),
        triggers: enrichedTriggers,
        triggerCount: enrichedTriggers.length,
        suggestions: analysis.suggestions,
        essentialMissing,
        wordCount: text.split(/\s+/).length,
      },
    });
  } catch (error) {
    console.error("Error analyzing text:", error);
    return NextResponse.json(
      { error: "Failed to analyze text" },
      { status: 500 }
    );
  }
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Altamente Eletrificado";
  if (score >= 60) return "Bem Eletrificado";
  if (score >= 40) return "Parcialmente Eletrificado";
  if (score >= 20) return "Pouco Eletrificado";
  return "Sem Eletrificação";
}
