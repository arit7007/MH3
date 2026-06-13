export type Need =
  | "Shelter tonight"
  | "Food"
  | "Shower/laundry"
  | "Medical help"
  | "ID/document help"
  | "Case management"
  | "Transportation help";

export const NEEDS: Need[] = [
  "Shelter tonight",
  "Food",
  "Shower/laundry",
  "Medical help",
  "ID/document help",
  "Case management",
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
  urgency: Urgency;
  transportation: Transportation;
  hasPet: boolean;
  hasChildren: boolean;
  noId: boolean;
  prefersSpanish: boolean;
  wheelchairAccess: boolean;
  womenOrFamilySafe: boolean;
  wantsPlan: boolean;
};

export type Reliability = "High" | "Medium" | "Low";

export type Resource = {
  id: string;
  name: string;
  type: Need[];
  description: string;
  distanceMiles: number;
  intakeHours: string;
  openTonight: boolean;
  walkIns: boolean;
  requiresId: boolean;
  allowsPets: boolean;
  familyFriendly: boolean;
  wheelchairAccessible: boolean;
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
