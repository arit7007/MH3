import { NextRequest, NextResponse } from "next/server";
import { Intake, Need, Transportation, Urgency } from "@/lib/types";
import { callClaude, extractJson } from "@/lib/anthropic";

export const runtime = "nodejs";

const SYSTEM = `You convert a short outreach worker note into a structured intake object for a housing resource navigator.
Return ONLY valid JSON matching this shape, inferring sensible defaults when unstated:
{
  "need": "Shelter" | "Food" | "Shower/laundry" | "Medical help" | "ID/document help" | "Recovery support" | "Transportation help",
  "location": "string",
  "urgency": "Tonight" | "This week" | "Planning ahead",
  "transportation": "Walking" | "Public transit" | "Car" | "Need transportation help",
  "hasPet": boolean,
  "hasChildren": boolean,
  "noId": boolean,
  "prefersSpanish": boolean,
  "wheelchairAccess": boolean,
  "womenOrFamilySafe": boolean
}
Do not invent details that are clearly absent; use false / defaults instead.`;

// Deterministic keyword fallback so the feature works without an API key.
function ruleBasedExtract(note: string): Intake {
  const n = note.toLowerCase();
  const has = (...words: string[]) => words.some((w) => n.includes(w));

  let need: Need = "Shelter";
  if (has("food", "meal", "hungry")) need = "Food";
  else if (has("shower", "laundry", "hygiene")) need = "Shower/laundry";
  else if (has("medical", "health", "doctor", "wound")) need = "Medical help";
  else if (has("id", "document", "paperwork", "benefits")) need = "ID/document help";
  else if (has("transport", "bus", "ride")) need = "Transportation help";
  else if (has("rehab", "recovery", "detox", "substance", "addiction", "alcohol", "drug", "case management", "case worker")) need = "Recovery support";

  let urgency: Urgency = "This week";
  if (has("tonight", "today", "now", "right now", "urgent")) urgency = "Tonight";
  else if (has("planning", "future", "eventually")) urgency = "Planning ahead";

  let transportation: Transportation = "Public transit";
  if (has("no car", "without a car", "no vehicle", "walking", "on foot"))
    transportation = "Walking";
  else if (has("has a car", "drives", "by car")) transportation = "Car";
  else if (has("needs a ride", "transportation help", "no way to get"))
    transportation = "Need transportation help";

  return {
    need,
    location: extractLocation(note),
    requestName: undefined,
    useCurrentLocation: false,
    currentCoordinates: null,
    urgency,
    transportation,
    hasPet: has("dog", "cat", "pet", "animal"),
    hasChildren: has("child", "kid", "children", "family", "baby", "son", "daughter"),
    noId: has("no id", "without id", "lost id", "no identification"),
    prefersSpanish: has("spanish", "español", "espanol"),
    wheelchairAccess: has("wheelchair", "mobility", "accessible"),
    womenOrFamilySafe: has("women", "woman", "family-safe", "domestic", "safe option"),
    wantsPlan: true,
    wantsContact: false,
  };
}

function extractLocation(note: string): string {
  const m = note.match(/(?:near|in)\s+([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*)/);
  if (m) return `${m[1]}, CA`;
  return "Santa Clara, CA";
}

export async function POST(req: NextRequest) {
  let body: { note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const note = (body.note || "").trim();
  if (!note) {
    return NextResponse.json({ error: "Missing note" }, { status: 400 });
  }

  const fallback = ruleBasedExtract(note);

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(fallback);
  }

  try {
    const text = await callClaude(SYSTEM, note, 600);
    const parsed = extractJson<Partial<Intake>>(text);
    const intake: Intake = {
      need: (parsed.need as Need) || fallback.need,
      location: parsed.location || fallback.location,
      requestName: undefined,
      useCurrentLocation: false,
      currentCoordinates: null,
      urgency: (parsed.urgency as Urgency) || fallback.urgency,
      transportation: (parsed.transportation as Transportation) || fallback.transportation,
      hasPet: parsed.hasPet ?? fallback.hasPet,
      hasChildren: parsed.hasChildren ?? fallback.hasChildren,
      noId: parsed.noId ?? fallback.noId,
      prefersSpanish: parsed.prefersSpanish ?? fallback.prefersSpanish,
      wheelchairAccess: parsed.wheelchairAccess ?? fallback.wheelchairAccess,
      womenOrFamilySafe: parsed.womenOrFamilySafe ?? fallback.womenOrFamilySafe,
      wantsPlan: true,
      wantsContact: false,
    };
    return NextResponse.json(intake);
  } catch {
    return NextResponse.json(fallback);
  }
}
