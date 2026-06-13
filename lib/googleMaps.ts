import { Intake, MatchResult } from "./types";

type TravelMode = "walking" | "transit" | "driving";

export function getTravelMode(intake: Intake): TravelMode {
  switch (intake.transportation) {
    case "Public transit":
      return "transit";
    case "Car":
      return "driving";
    case "Walking":
    case "Need transportation help":
    default:
      return "walking";
  }
}

export function getTravelModeLabel(intake: Intake): string {
  if (intake.transportation === "Need transportation help") {
    return "Walking route shown because transportation help was selected";
  }

  switch (getTravelMode(intake)) {
    case "transit":
      return "Fastest public transit route";
    case "driving":
      return "Fastest driving route";
    case "walking":
    default:
      return "Fastest walking route";
  }
}

export function getOrigin(intake: Intake): string {
  if (intake.currentCoordinates) {
    return `${intake.currentCoordinates.latitude},${intake.currentCoordinates.longitude}`;
  }
  return intake.location;
}

export function getDirectionsUrl(intake: Intake, result: MatchResult): string {
  const params = new URLSearchParams({
    api: "1",
    origin: getOrigin(intake),
    destination: result.address,
    travelmode: getTravelMode(intake),
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function getMapUrl(result: MatchResult): string {
  const params = new URLSearchParams({
    api: "1",
    query: result.address,
  });

  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export function getEmbedUrl(intake: Intake, result: MatchResult): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;

  if (key) {
    const params = new URLSearchParams({
      key,
      origin: getOrigin(intake),
      destination: result.address,
      mode: getTravelMode(intake),
    });

    return `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;
  }

  return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(result.address)}`;
}
