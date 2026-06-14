export type Need =
  | "Shelter"
  | "Food"
  | "Shower/laundry"
  | "Medical help"
  | "ID/document help"
  | "Recovery support"
  | "Transportation help";

export const NEEDS: Need[] = [
  "Shelter",
  "Food",
  "Shower/laundry",
  "Medical help",
  "ID/document help",
  "Recovery support",
  "Transportation help",
];

export type Urgency = "Tonight" | "This week" | "Planning ahead";

export type Transportation =
  | "Walking"
  | "Public transit"
  | "Car"
  | "Need transportation help";

export type Intake = {
  need: Need;
  location: string;
  requestName?: string;
  useCurrentLocation?: boolean;
  currentCoordinates?: {
    latitude: number;
    longitude: number;
  } | null;
  urgency: Urgency;
  transportation: Transportation;
  hasPet: boolean;
  hasChildren: boolean;
  noId: boolean;
  prefersSpanish: boolean;
  wheelchairAccess: boolean;
  womenOrFamilySafe: boolean;
  wantsPlan: boolean;
  wantsContact: boolean;
  contactPhone?: string;
  contactEmail?: string;
};

export type Reliability = "High" | "Medium" | "Low";
export type RequirementStatus = boolean | null;

export type Resource = {
  id: string;
  name: string;
  type: Need[];
  description: string;
  distanceMiles: number;
  intakeHours: string;
  openTonight: RequirementStatus;
  walkIns: RequirementStatus;
  requiresId: RequirementStatus;
  allowsPets: RequirementStatus;
  familyFriendly: RequirementStatus;
  wheelchairAccessible: RequirementStatus;
  womenOnly?: boolean;
  languages: string[];
  transportation: string[];
  phone: string;
  address: string;
  whatToBring: string[];
  notes: string;
  reliability: Reliability;
};

export type MatchResult = Resource & {
  score: number;
  reasons: string[];
  warnings: string[];
};

export type ActionPlan = {
  summary: string;
  nextSteps: string[];
  whatToBring: string[];
  messageScript: string;
  backupPlan: string;
  outreachSummary: string;
  spanishMessageScript?: string;
  source: "ai" | "template";
};
