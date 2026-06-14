import { NextRequest, NextResponse } from "next/server";
import { Intake, Resource } from "@/lib/types";
import { callClaude, extractJson } from "@/lib/anthropic";
import { resources as fallbackResources } from "@/lib/resources";

export const runtime = "nodejs";

const SYSTEM = `You are a housing and social services database for the United States. Given a person's location and needs, return a JSON array of REAL organizations near that location.

STRICT RULES:
- Only include organizations you are highly confident exist with accurate contact details
- Set reliability to "High" only for major, well-established organizations whose details rarely change
- Set reliability to "Medium" for organizations you know exist but whose hours/details may have changed
- Set reliability to "Low" if you are guessing at any detail
- NEVER invent organizations, addresses, or phone numbers
- Always include 211 (dial 2-1-1) as a last entry — it works in every US county
- Include 5-8 resources total, prioritizing the person's primary need
- Use null (not true/false) when you genuinely don't know a boolean field

Return ONLY a valid JSON array with no prose. Each item must match exactly:
{
  "id": "kebab-case-id",
  "name": "Full Organization Name",
  "type": ["Shelter tonight" | "Food" | "Shower/laundry" | "Medical help" | "ID/document help" | "Case management" | "Transportation help"],
  "description": "One clear sentence describing what they offer",
  "distanceMiles": 3.0,
  "intakeHours": "e.g. Mon-Fri 9am-5pm or Walk-in daily",
  "openTonight": true | false | null,
  "walkIns": true | false | null,
  "requiresId": true | false | null,
  "allowsPets": true | false | null,
  "familyFriendly": true | false | null,
  "wheelchairAccessible": true | false | null,
  "languages": ["English"],
  "transportation": ["Public transit", "Car"],
  "phone": "(xxx) xxx-xxxx",
  "address": "Full street address, City, State ZIP",
  "whatToBring": ["item 1", "item 2"],
  "notes": "Any important eligibility or call-ahead notes",
  "reliability": "High" | "Medium" | "Low"
}`;

export async function POST(req: NextRequest) {
  let body: { intake: Intake };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ resources: fallbackResources, source: "fallback" });
  }

  const { intake } = body;

  if (!intake) {
    return NextResponse.json({ resources: fallbackResources, source: "fallback" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ resources: fallbackResources, source: "fallback" });
  }

  const constraints = [
    intake.hasPet && "has a pet",
    intake.hasChildren && "has children",
    intake.noId && "has no ID",
    intake.prefersSpanish && "prefers Spanish",
    intake.wheelchairAccess && "needs wheelchair access",
    intake.womenOrFamilySafe && "needs women-only or family-safe options",
    intake.transportation === "Need transportation help" && "cannot travel independently",
  ].filter(Boolean).join(", ");

  const userContent = `Find help for someone near: ${intake.location}
Primary need: ${intake.need}
Urgency: ${intake.urgency}
How they can travel: ${intake.transportation}
${constraints ? `Constraints: ${constraints}` : ""}

Return 5-8 real organizations near ${intake.location} that can help with "${intake.need}". Prioritize those that match the primary need and fit the constraints listed.`;

  try {
    const text = await callClaude(SYSTEM, userContent, 2500);
    const parsed = extractJson<Resource[]>(text);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return NextResponse.json({ resources: fallbackResources, source: "fallback" });
    }

    return NextResponse.json({ resources: parsed, source: "ai" });
  } catch {
    return NextResponse.json({ resources: fallbackResources, source: "fallback" });
  }
}
