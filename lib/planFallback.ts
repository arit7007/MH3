import { ActionPlan, Intake, MatchResult } from "./types";

// Deterministic action plan used when AI is unavailable or fails.
// Guarantees the demo always produces a usable plan.
export function buildFallbackPlan(
  intake: Intake,
  top: MatchResult,
  backup?: MatchResult
): ActionPlan {
  const tonight = intake.urgency === "Tonight";
  const callBy = top.intakeHours.split(" to ")[1]
    ? `before ${top.intakeHours.split(" to ")[1]}`
    : "before you travel";

  const constraints: string[] = [];
  if (intake.hasPet) constraints.push("a pet");
  if (intake.hasChildren) constraints.push("children with you");
  if (intake.noId) constraints.push("no ID");
  if (intake.transportation === "Walking") constraints.push("no car");
  if (intake.transportation === "Need transportation help")
    constraints.push("a need for transportation help");
  const constraintText =
    constraints.length > 0 ? ` You mentioned ${joinList(constraints)}.` : "";

  const nextSteps: string[] = [
    `Call ${top.name} at ${top.phone} ${callBy} to ask if ${
      tonight ? "walk-in space is available tonight" : "space is available"
    }.`,
  ];
  if (intake.hasPet) {
    nextSteps.push("Ask if they can accept a guest with a pet.");
  }
  if (intake.transportation === "Need transportation help") {
    nextSteps.push(
      "Ask about transportation help or a bus pass to reach the location."
    );
  }
  const bringItems = (top.whatToBring.length ? top.whatToBring : ["your belongings"]).map(lcFirst);
  nextSteps.push(
    `Bring ${joinList(bringItems)}.${intake.noId ? " ID is not required for intake here." : ""}`
  );

  const messageScript = buildMessage(intake, top, false);
  const spanishMessageScript = intake.prefersSpanish
    ? buildMessage(intake, top, true)
    : undefined;

  const backupPlan = backup
    ? `If ${top.name} is full, try ${backup.name} at ${backup.phone}. ${backup.notes}`
    : "If this option is full, call to ask whether they can refer you to another nearby resource.";

  const outreachSummary = `${
    intake.prefersSpanish ? "Client prefers Spanish. " : ""
  }Needs ${intake.need.toLowerCase()} near ${intake.location}.${constraintText} ${
    top.name
  } is the strongest match because it ${joinList(
    top.reasons.map((r) => r.toLowerCase())
  )}. ${tonight ? `Call ${callBy} to confirm availability.` : "Confirm availability before referral."}`;

  return {
    summary: `Your ${tonight ? "plan for tonight" : "plan"}: ${top.name} is your best option for ${intake.need.toLowerCase()} near ${intake.location}. Availability is not guaranteed, so please call to confirm before traveling.`,
    nextSteps,
    whatToBring: top.whatToBring.length ? top.whatToBring : ["Your belongings"],
    messageScript,
    backupPlan,
    outreachSummary,
    spanishMessageScript,
    source: "template",
  };
}

function buildMessage(
  intake: Intake,
  top: MatchResult,
  spanish: boolean
): string {
  const details: string[] = [];
  if (intake.hasPet) details.push(spanish ? "tengo una mascota" : "I have a pet");
  if (intake.transportation === "Walking" || intake.transportation === "Need transportation help")
    details.push(spanish ? "no tengo carro" : "I do not have a car");
  if (intake.noId) details.push(spanish ? "no tengo identificación" : "I do not have ID");

  const detailText = details.length ? `, ${joinList(details, spanish)}` : "";

  if (spanish) {
    return `Hola, estoy buscando ${needEsp(intake)} en ${intake.location}${detailText}. ¿Tienen espacio disponible ${intake.urgency === "Tonight" ? "esta noche" : "esta semana"}${intake.hasPet ? " y aceptan mascotas" : ""}?`;
  }
  return `Hi, I'm looking for ${intake.need.toLowerCase()} in ${intake.location}${detailText}. Do you have ${intake.urgency === "Tonight" ? "walk-in space available tonight" : "space available"}${intake.hasPet ? ", and do you accept pets" : ""}?`;
}

function needEsp(intake: Intake): string {
  switch (intake.need) {
    case "Shelter":
      return "refugio";
    case "Food":
      return "comida";
    case "Shower/laundry":
      return "duchas o lavandería";
    case "Medical help":
      return "ayuda médica";
    case "ID/document help":
      return "ayuda con documentos o identificación";
    case "Recovery support":
      return "apoyo de recuperación";
    case "Transportation help":
      return "ayuda con transporte";
    default:
      return "ayuda";
  }
}

function lcFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function joinList(items: string[], spanish = false): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  const and = spanish ? " y " : " and ";
  return items.slice(0, -1).join(", ") + and + items[items.length - 1];
}
