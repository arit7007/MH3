import { Intake } from "./types";

export type DemoCase = {
  id: string;
  name: string;
  needSummary: string;
  constraints: string;
  recommendedId: string;
  followUp: string;
  intake: Intake;
};

export const mariaIntake: Intake = {
  need: "Shelter tonight",
  location: "Santa Clara, CA",
  urgency: "Tonight",
  transportation: "Public transit",
  hasPet: true,
  hasChildren: false,
  noId: true,
  prefersSpanish: true,
  wheelchairAccess: false,
  womenOrFamilySafe: false,
  wantsPlan: true,
};

export const demoCases: DemoCase[] = [
  {
    id: "maria",
    name: "Maria",
    needSummary: "Shelter tonight",
    constraints: "Dog, no ID, no car, Spanish preferred",
    recommendedId: "safestay-santa-clara",
    followUp: "Call before 8:30 PM",
    intake: mariaIntake,
  },
  {
    id: "james",
    name: "James",
    needSummary: "ID/document help",
    constraints: "No ID, needs benefits paperwork",
    recommendedId: "new-start-document-clinic",
    followUp: "Visit during walk-in hours (10 AM to 4 PM)",
    intake: {
      need: "ID/document help",
      location: "Santa Clara, CA",
      urgency: "This week",
      transportation: "Public transit",
      hasPet: false,
      hasChildren: false,
      noId: true,
      prefersSpanish: false,
      wheelchairAccess: false,
      womenOrFamilySafe: false,
      wantsPlan: true,
    },
  },
  {
    id: "elena",
    name: "Elena and Child",
    needSummary: "Family shelter this week",
    constraints: "One child, needs family-safe option",
    recommendedId: "family-bridge-housing",
    followUp: "Call during business hours (9 AM to 5 PM)",
    intake: {
      need: "Shelter tonight",
      location: "Santa Clara, CA",
      urgency: "This week",
      transportation: "Public transit",
      hasPet: false,
      hasChildren: true,
      noId: false,
      prefersSpanish: false,
      wheelchairAccess: false,
      womenOrFamilySafe: true,
      wantsPlan: true,
    },
  },
];
