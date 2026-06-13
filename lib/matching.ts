import { Intake, MatchResult, Resource } from "./types";

// Deterministic scoring. AI is never used for ranking.
export function scoreResource(intake: Intake, resource: Resource) {
  let score = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];

  if (resource.type.includes(intake.need)) {
    score += 5;
    reasons.push("Matches your main need");
  }

  if (intake.urgency === "Tonight" && resource.openTonight) {
    score += 4;
    reasons.push("Available tonight");
  }
  if (intake.urgency === "Tonight" && !resource.openTonight) {
    score -= 4;
    warnings.push("May not be available tonight");
  }

  if (resource.walkIns) {
    score += 3;
    reasons.push("Accepts walk-ins");
  } else {
    warnings.push("May require an appointment or referral");
  }

  if (intake.hasPet) {
    if (resource.allowsPets) {
      score += 4;
      reasons.push("Allows pets");
    } else {
      score -= 5;
      warnings.push("May not allow pets");
    }
  }

  if (intake.noId) {
    if (!resource.requiresId) {
      score += 3;
      reasons.push("ID not required");
    } else {
      score -= 4;
      warnings.push("May require ID");
    }
  }

  if (intake.hasChildren) {
    if (resource.familyFriendly) {
      score += 4;
      reasons.push("Family-friendly");
    } else {
      score -= 3;
      warnings.push("May not serve families with children");
    }
  }

  if (intake.wheelchairAccess) {
    if (resource.wheelchairAccessible) {
      score += 3;
      reasons.push("Wheelchair accessible");
    } else {
      score -= 3;
      warnings.push("Accessibility may be limited");
    }
  }

  if (intake.prefersSpanish) {
    if (resource.languages.includes("Spanish")) {
      score += 2;
      reasons.push("Spanish support available");
    } else {
      warnings.push("Spanish support not listed");
    }
  }

  if (intake.womenOrFamilySafe) {
    if (resource.womenOnly || resource.familyFriendly) {
      score += 2;
      reasons.push("Women-only or family-safe option");
    } else {
      warnings.push("May not be women-only or family-safe");
    }
  }

  if (resource.distanceMiles <= 2) {
    score += 3;
    reasons.push("Nearby");
  } else if (resource.distanceMiles <= 5) {
    score += 1;
    reasons.push("Reachable nearby");
  } else {
    score -= 1;
    warnings.push("Farther away");
  }

  if (resource.reliability === "High") {
    score += 2;
    reasons.push("Resource information is recently verified");
  } else if (resource.reliability === "Low") {
    warnings.push("Resource details may need confirmation");
  }

  return { score, reasons, warnings };
}

export function rankResources(
  intake: Intake,
  resourceList: Resource[]
): MatchResult[] {
  return resourceList
    .map((resource) => ({
      ...resource,
      ...scoreResource(intake, resource),
    }))
    .sort((a, b) => b.score - a.score);
}

// Convert a raw score to a friendly match label / percentage.
export function matchLabel(result: MatchResult, best: number): {
  percent: number;
  label: string;
} {
  const max = Math.max(best, 1);
  const percent = Math.max(
    0,
    Math.min(100, Math.round((result.score / max) * 100))
  );
  let label = "Possible match";
  if (percent >= 85) label = "Best Match";
  else if (percent >= 60) label = "Strong match";
  else if (percent >= 35) label = "Partial match";
  return { percent, label };
}
