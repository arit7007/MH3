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

  if (intake.urgency === "Tonight") {
    if (resource.openTonight === true) {
      score += 4;
      reasons.push("Published hours show service tonight");
    } else if (resource.openTonight === false) {
      score -= 4;
      warnings.push("Published hours do not show service tonight");
    } else {
      warnings.push("Tonight availability is not clearly listed");
    }
  }

  if (resource.walkIns === true) {
    score += 3;
    reasons.push("Accepts walk-ins");
  } else if (resource.walkIns === false) {
    warnings.push("May require a call, appointment, or referral");
  } else {
    warnings.push("Walk-in policy is not clearly listed");
  }

  if (intake.hasPet) {
    if (resource.allowsPets === true) {
      score += 4;
      reasons.push("Allows pets");
    } else if (resource.allowsPets === false) {
      score -= 5;
      warnings.push("May not allow pets");
    } else {
      warnings.push("Pet policy is not clearly listed");
    }
  }

  if (intake.noId) {
    if (resource.requiresId === false) {
      score += 3;
      reasons.push("ID not required");
    } else if (resource.requiresId === true) {
      score -= 4;
      warnings.push("May require ID");
    } else {
      warnings.push("ID requirement is not clearly listed");
    }
  }

  if (intake.hasChildren) {
    if (resource.familyFriendly === true) {
      score += 4;
      reasons.push("Family-friendly");
    } else if (resource.familyFriendly === false) {
      score -= 3;
      warnings.push("May not serve families with children");
    } else {
      warnings.push("Family policy is not clearly listed");
    }
  }

  if (intake.wheelchairAccess) {
    if (resource.wheelchairAccessible === true) {
      score += 3;
      reasons.push("Wheelchair accessible");
    } else if (resource.wheelchairAccessible === false) {
      score -= 3;
      warnings.push("Accessibility may be limited");
    } else {
      warnings.push("Accessibility details are not clearly listed");
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
    if (resource.womenOnly || resource.familyFriendly === true) {
      score += 2;
      reasons.push("Women-only or family-safe option");
    } else if (resource.familyFriendly === false) {
      warnings.push("May not be women-only or family-safe");
    } else {
      warnings.push("Women-only or family-safe policy is not clearly listed");
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
