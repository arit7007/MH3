import { NextRequest, NextResponse } from "next/server";
import { ActionPlan, Intake, MatchResult } from "@/lib/types";
import { buildFallbackPlan } from "@/lib/planFallback";
import { callClaude, extractJson } from "@/lib/anthropic";

export const runtime = "nodejs";

const SYSTEM = `You create short, practical, respectful action plans for people experiencing housing insecurity.
Rules:
- Use only the resource information provided.
- Do not invent availability.
- Do not provide legal, medical, or emergency advice.
- Use plain language.
- Be dignity-centered and nonjudgmental.
- Always mention that availability should be confirmed.
- Keep the plan specific and actionable.
- If the person may be in immediate danger, advise contacting emergency services or a local crisis hotline.
Return ONLY valid JSON matching this shape:
{
  "summary": "...",
  "nextSteps": ["...", "...", "..."],
  "whatToBring": ["...", "..."],
  "messageScript": "...",
  "backupPlan": "...",
  "outreachSummary": "...",
  "spanishMessageScript": "..."
}`;

export async function POST(req: NextRequest) {
  let body: { intake: Intake; top: MatchResult; backup?: MatchResult };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { intake, top, backup } = body;
  if (!intake || !top) {
    return NextResponse.json({ error: "Missing intake or top resource" }, { status: 400 });
  }

  // Deterministic fallback is always available.
  const fallback = buildFallbackPlan(intake, top, backup);

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(fallback);
  }

  try {
    const userContent = JSON.stringify({
      intake,
      topResource: {
        name: top.name,
        phone: top.phone,
        address: top.address,
        intakeHours: top.intakeHours,
        whatToBring: top.whatToBring,
        notes: top.notes,
        reasons: top.reasons,
        warnings: top.warnings,
      },
      backupResource: backup
        ? { name: backup.name, phone: backup.phone, notes: backup.notes }
        : null,
      wantSpanish: intake.prefersSpanish,
    });

    const text = await callClaude(SYSTEM, userContent, 1200);
    const parsed = extractJson<Omit<ActionPlan, "source">>(text);

    const plan: ActionPlan = {
      summary: parsed.summary || fallback.summary,
      nextSteps: parsed.nextSteps?.length ? parsed.nextSteps : fallback.nextSteps,
      whatToBring: parsed.whatToBring?.length
        ? parsed.whatToBring
        : fallback.whatToBring,
      messageScript: parsed.messageScript || fallback.messageScript,
      backupPlan: parsed.backupPlan || fallback.backupPlan,
      outreachSummary: parsed.outreachSummary || fallback.outreachSummary,
      spanishMessageScript: intake.prefersSpanish
        ? parsed.spanishMessageScript || fallback.spanishMessageScript
        : undefined,
      source: "ai",
    };
    return NextResponse.json(plan);
  } catch {
    // Any failure falls back to the deterministic template.
    return NextResponse.json(fallback);
  }
}
