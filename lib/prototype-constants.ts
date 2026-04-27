import { LOCATION_DATA, myProjectCategories } from "@/lib/seed-data";
import type { ChatMessage, MatchingProfile } from "@/types/prototype";

export const CURRENT_USER_ID = "current-user";
export const SAMPLE_AI_WELCOME: ChatMessage[] = [];

export const DEMO_QUESTIONNAIRE_ANSWERS: Record<string, string> = {
  household_type: "Family with kids",
  household_size: "3-4",
  timeline: "Within 3-6 months",
  distance_preference: "Anywhere in California",
  project_type: "Family community",
  climate_preference: "Coastal / mild",
  community_style: "Balanced mix",
  housing_style: "Shared land with separate homes",
  work_style: "Remote work",
  budget_status: "Can contribute steadily",
  build_readiness: "Can help regularly",
  family_fit: "Very important",
  food_lifestyle: "Gardening / food growing",
  accessibility_needs: "Need moderate flexibility",
  primary_strength: "Operations / organizing",
  secondary_strength: "Teaching / mentoring",
  role_preference: "Organizer / systems person",
  deal_breakers: "Unclear ownership, poor child fit, or a project with no realistic onboarding path.",
  relocation_readiness: "Can start planning soon",
  success_definition:
    "A grounded family rhythm with shared food growing, trusted neighbors, and clear ways to contribute.",
};

export const EMPTY_MATCHING_PROFILE: MatchingProfile = {
  preferredName: "",
  age: "",
  gender: "",
  occupation: "",
  companyOrSchool: "",
  languages: "",
  maritalStatus: "",
  emergencyContact: "",
  website: "",
  hobbies: "",
  values: "",
  interests: "",
  skillsOfferedIds: [],
  educationLevel: "",
  workExperience: "",
  experienceLevel: "",
  availability: "",
  rolePreferences: "",
  goals: "",
  needs: "",
};

export const DEMO_MATCHING_PROFILE: MatchingProfile = {
  preferredName: "Jordan",
  age: "36",
  gender: "Parent / community builder",
  occupation: "Operations designer",
  companyOrSchool: "Independent project consultant",
  languages: "English, conversational Spanish",
  maritalStatus: "Partnered",
  emergencyContact: "Alex Rivera - (619) 555-0134",
  website: "https://example.com/jordan",
  hobbies: "Gardening, facilitation, family education, practical design",
  values: "Clear agreements, family safety, shared responsibility, transparent money, practical kindness",
  interests: "Regenerative farming, homeschool co-ops, project governance, food systems, shared tools",
  skillsOfferedIds: [
    "communication",
    "governance",
    "project-planning",
    "administration-documentation",
    "teaching-skill-sharing",
    "food-production",
  ],
  educationLevel: "Bachelor's degree plus community facilitation training",
  workExperience: "12 years in operations, program design, and small-team coordination",
  experienceLevel: "Advanced organizer / intermediate hands-on contributor",
  availability: "Weekends plus 6-8 remote hours per week",
  rolePreferences: "Organizer, documentation lead, onboarding support, governance facilitator",
  goals:
    "Find a family-friendly off-grid or regenerative community with clear governance and real project momentum.",
  needs:
    "Child-compatible routines, transparent costs, practical onboarding, and a project that values systems work.",
};

export const AVAILABILITY_OPTIONS = [
  "Weekends only",
  "Evenings and weekends",
  "Part-time remote contribution",
  "Part-time on-site contribution",
  "Full-time project involvement",
  "Flexible / depends on project",
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
  "Teacher / mentor",
  "Still discovering",
];

export const COMMUNITY_STYLE_OPTIONS = [
  "Balanced mix",
  "Highly communal",
  "Family-centered",
  "Remote-work friendly",
  "Hands-on build crew",
  "Education and skill-sharing",
  "Regenerative land stewardship",
];

export type UserProjectForm = {
  title: string;
  country: string;
  region: string;
  city: string;
  category: (typeof myProjectCategories)[number];
  description: string;
  tags: string;
  neededSkillIds: string[];
  desiredMemberTypes: string;
  locationConstraints: string;
  resourceNeeds: string;
  fundingGoal: string;
  fundingUse: string;
  fundingNeeds: string;
  communityStyle: string;
};

export const EMPTY_USER_PROJECT_FORM: UserProjectForm = {
  title: "",
  country: "",
  region: "",
  city: "",
  category: "Community Living",
  description: "",
  tags: "",
  neededSkillIds: [],
  desiredMemberTypes: "",
  locationConstraints: "",
  resourceNeeds: "",
  fundingGoal: "",
  fundingUse: "",
  fundingNeeds: "",
  communityStyle: "Balanced mix",
};

export function inferContinentFromCountry(country: string) {
  return (
    Object.entries(LOCATION_DATA).find(([, countries]) =>
      Object.prototype.hasOwnProperty.call(countries, country)
    )?.[0] ?? ""
  );
}

export function formatProjectLocation(city: string, region: string, country: string, continent: string) {
  if (!city || !region || !country || !continent) return "";
  return `${city}, ${region}, ${country}, ${continent}`;
}
