// Minimal Anthropic Messages API client using fetch (no extra dependency).
// Returns the text content of the first message, or throws.
export async function callClaude(
  system: string,
  userContent: string,
  maxTokens = 1024
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API error ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = data.content?.find((c) => c.type === "text")?.text;
  if (!text) throw new Error("No text content in Anthropic response");
  return text;
}

// Extract the first JSON object or array from a model response that may include
// prose or code fences.
export function extractJson<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const objStart = candidate.indexOf("{");
  const arrStart = candidate.indexOf("[");
  if (arrStart !== -1 && (objStart === -1 || arrStart < objStart)) {
    const end = candidate.lastIndexOf("]");
    if (end === -1) throw new Error("No JSON array found");
    return JSON.parse(candidate.slice(arrStart, end + 1)) as T;
  }
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found");
  return JSON.parse(candidate.slice(start, end + 1)) as T;
}
