import { Intake } from "./types";

export type ContactRequest = {
  id: string;
  submittedAt: number;
  need: string;
  location: string;
  urgency: string;
  phone?: string;
  email?: string;
  hasPet: boolean;
  hasChildren: boolean;
  noId: boolean;
  prefersSpanish: boolean;
  wheelchairAccess: boolean;
  womenOrFamilySafe: boolean;
  status: "new" | "contacted";
};

const KEY = "harbor_contact_requests";

export function saveContactRequest(intake: Intake): void {
  if (typeof window === "undefined") return;
  const existing = loadContactRequests();
  const request: ContactRequest = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    submittedAt: Date.now(),
    need: intake.need,
    location: intake.location,
    urgency: intake.urgency,
    phone: intake.contactPhone || undefined,
    email: intake.contactEmail || undefined,
    hasPet: intake.hasPet,
    hasChildren: intake.hasChildren,
    noId: intake.noId,
    prefersSpanish: intake.prefersSpanish,
    wheelchairAccess: intake.wheelchairAccess,
    womenOrFamilySafe: intake.womenOrFamilySafe,
    status: "new",
  };
  window.localStorage.setItem(KEY, JSON.stringify([request, ...existing]));
}

export function loadContactRequests(): ContactRequest[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function markContacted(id: string): void {
  if (typeof window === "undefined") return;
  const updated = loadContactRequests().map((r) =>
    r.id === id ? { ...r, status: "contacted" as const } : r
  );
  window.localStorage.setItem(KEY, JSON.stringify(updated));
}

export function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
