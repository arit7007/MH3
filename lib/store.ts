"use client";

import { Intake, Resource } from "./types";
import { resources as defaultResources } from "./resources";

const INTAKE_KEY = "harbor_intake";
const OVERRIDES_KEY = "harbor_resource_overrides";

type ResourceOverride = Partial<Resource>;

export function saveIntake(intake: Intake) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INTAKE_KEY, JSON.stringify(intake));
}

export function loadIntake(): Intake | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(INTAKE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Intake;
  } catch {
    return null;
  }
}

export function clearIntake() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(INTAKE_KEY);
}

// Admin overrides let a partner organization adjust live status. These are
// merged on top of the default seeded resource data.
export function loadOverrides(): Record<string, ResourceOverride> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(OVERRIDES_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, ResourceOverride>;
  } catch {
    return {};
  }
}

export function saveOverride(id: string, override: ResourceOverride) {
  if (typeof window === "undefined") return;
  const all = loadOverrides();
  all[id] = { ...all[id], ...override };
  window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
}

export function resetOverrides() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(OVERRIDES_KEY);
}

export function getResources(): Resource[] {
  const overrides = loadOverrides();
  return defaultResources.map((r) =>
    overrides[r.id] ? { ...r, ...overrides[r.id] } : r
  );
}
