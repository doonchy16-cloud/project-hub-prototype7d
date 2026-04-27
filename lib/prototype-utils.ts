import type {
  AvatarPreset,
  ChatMessage,
  Conversation,
  Project,
  Question,
  SharedProject,
  UserProject,
} from "@/types/prototype";
import { AVATAR_PRESETS, sharedProjectsSeed } from "@/lib/seed-data";

type ProjectLocationInput = {
  continent: string;
  country: string;
  region: string;
  city: string;
};

const CONTINENT_COORDINATE_ANCHORS: Record<string, { lat: number; lng: number }> = {
  Africa: { lat: 1.65, lng: 17.32 },
  Asia: { lat: 34.05, lng: 100.62 },
  Europe: { lat: 54.53, lng: 15.26 },
  "North America": { lat: 48.17, lng: -100.17 },
  Oceania: { lat: -25.27, lng: 133.77 },
  "South America": { lat: -14.24, lng: -51.93 },
};

export function uniqueProjectList<T extends { id: number }>(projects: T[]): T[] {
  const seen = new Set<number>();
  return projects.filter((project) => {
    if (seen.has(project.id)) return false;
    seen.add(project.id);
    return true;
  });
}

function averageProjectCoordinates(projects: Pick<SharedProject, "lat" | "lng">[]) {
  if (projects.length === 0) return null;

  return {
    lat: projects.reduce((sum, project) => sum + project.lat, 0) / projects.length,
    lng: projects.reduce((sum, project) => sum + project.lng, 0) / projects.length,
  };
}

function stableOffset(source: string, span: number) {
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }
  return (hash / 0xffffffff - 0.5) * span;
}

function clampCoordinate(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function resolveProjectCoordinates({ continent, country, region, city }: ProjectLocationInput) {
  const exactCityMatch = sharedProjectsSeed.find(
    (project) =>
      project.continent === continent &&
      project.country === country &&
      project.state === region &&
      project.city === city
  );
  if (exactCityMatch) return { lat: exactCityMatch.lat, lng: exactCityMatch.lng };

  const regionAverage = averageProjectCoordinates(
    sharedProjectsSeed.filter(
      (project) => project.continent === continent && project.country === country && project.state === region
    )
  );
  if (regionAverage) return regionAverage;

  const countryAverage = averageProjectCoordinates(
    sharedProjectsSeed.filter((project) => project.continent === continent && project.country === country)
  );
  if (countryAverage) return countryAverage;

  const continentAverage = averageProjectCoordinates(
    sharedProjectsSeed.filter((project) => project.continent === continent)
  );
  if (continentAverage) return continentAverage;

  const anchor = CONTINENT_COORDINATE_ANCHORS[continent] ?? { lat: 0, lng: 0 };
  const source = `${continent}|${country}|${region}|${city}`;

  return {
    lat: clampCoordinate(anchor.lat + stableOffset(source, 10), -75, 75),
    lng: clampCoordinate(anchor.lng + stableOffset(source.split("").reverse().join(""), 20), -179, 179),
  };
}

export function getAdaptiveQuestions(
  currentLocation: string,
  answers: Record<string, string>
): Question[] {
  const locationLower = currentLocation.toLowerCase();
  const inCalifornia =
    locationLower.includes("california") ||
    locationLower.includes("san diego") ||
    locationLower.includes("los angeles");

  const householdType = answers.household_type || "";
  const projectType = answers.project_type || "community";
  const primaryStrength = answers.primary_strength || "your main strength";
  const timeline = answers.timeline || "sometime soon";

  const shouldAskHouseholdSize =
    householdType !== "Individual" && householdType !== "Couple";

  const householdSizeLabel =
    householdType === "Friends / group"
      ? "How many people are in your group?"
      : "How many people are in your household?";

  return [
    {
      id: "household_type",
      category: "Status",
      type: "select",
      label: "Which best describes your current household status?",
      options: [
        "Individual",
        "Couple",
        "Family with kids",
        "Family without kids",
        "Friends / group",
      ],
    },
    ...(shouldAskHouseholdSize
      ? [
          {
            id: "household_size",
            category: "Status",
            type: "select",
            label: householdSizeLabel,
            options: ["1", "2", "3-4", "5-6", "7+"],
          } as Question,
        ]
      : []),
    {
      id: "timeline",
      category: "Location + Timing",
      type: "select",
      label: "How soon are you realistically hoping to move or join a project?",
      options: [
        "Just researching",
        "Within 6-12 months",
        "Within 3-6 months",
        "Within 1-3 months",
        "Ready now",
      ],
    },
    {
      id: "distance_preference",
      category: "Location + Timing",
      type: "select",
      label: `How far from ${currentLocation || "your current location"} would you consider going?`,
      options: inCalifornia
        ? [
            "Stay very local",
            "Anywhere in California",
            "Western U.S.",
            "Anywhere in the U.S.",
            "Open internationally",
          ]
        : [
            "Stay very local",
            "Within my region",
            "Anywhere in my state",
            "Anywhere in the U.S.",
            "Open internationally",
          ],
    },
    {
      id: "project_type",
      category: "Project Preferences",
      type: "select",
      label: "What kind of project are you most drawn to right now?",
      options: [
        "Off-grid build",
        "Family community",
        "Creative homestead",
        "Regenerative farm",
        "Remote-work community",
        "Education village",
      ],
    },
    {
      id: "climate_preference",
      category: "Project Preferences",
      type: "select",
      label: `Based on being in ${currentLocation || "your location"}, what climate or environment feels best for you?`,
      options: inCalifornia
        ? [
            "Coastal / mild",
            "Mountain / forest",
            "Desert / dry",
            "Rural farmland",
            "No strong preference",
          ]
        : [
            "Warm / sunny",
            "Cool / forested",
            "Dry / desert",
            "Rural farmland",
            "No strong preference",
          ],
    },
    {
      id: "community_style",
      category: "Lifestyle",
      type: "select",
      label: "How much community interaction do you want in everyday life?",
      options: [
        "Mostly private",
        "Small circle",
        "Balanced mix",
        "Highly communal",
        "Flexible / depends on project",
      ],
    },
    {
      id: "housing_style",
      category: "Lifestyle",
      type: "select",
      label: `For a ${projectType.toLowerCase()} setup, what housing style feels like the best fit?`,
      options: [
        "Private house",
        "Cabin / tiny home",
        "Shared land with separate homes",
        "Intentional shared housing",
        "Still exploring",
      ],
    },
    {
      id: "work_style",
      category: "Work + Finances",
      type: "select",
      label: "What best describes your current work or income style?",
      options: [
        "Remote work",
        "Local job / business",
        "Self-employed",
        "Homemaker / caretaker",
        "Mixed / transitioning",
      ],
    },
    {
      id: "budget_status",
      category: "Work + Finances",
      type: "select",
      label: "What is your current financial readiness for joining or building something?",
      options: [
        "Very limited right now",
        "Modest budget",
        "Can contribute steadily",
        "Can invest meaningfully",
        "Need flexible arrangements",
      ],
    },
    {
      id: "build_readiness",
      category: "Skills + Abilities",
      type: "select",
      label: "How ready are you for physical building, setup, or hands-on project work?",
      options: [
        "Prefer non-physical roles",
        "Can help lightly",
        "Can help regularly",
        "Strong hands-on contributor",
        "Depends on the project",
      ],
    },
    {
      id: "family_fit",
      category: "Lifestyle",
      type: "select",
      label: householdType.toLowerCase().includes("family")
        ? "What kind of child and family support matters most to you?"
        : "How important is it that the project be family-friendly or child-compatible?",
      options: [
        "Very important",
        "Helpful but not essential",
        "Neutral",
        "Only if the fit is right",
        "Not important",
      ],
    },
    {
      id: "food_lifestyle",
      category: "Project Preferences",
      type: "select",
      label: "Which daily culture element matters most to you?",
      options: [
        "Gardening / food growing",
        "Health / wellness",
        "Learning / education",
        "Creativity / arts",
        "Building / making",
      ],
    },
    {
      id: "accessibility_needs",
      category: "Status",
      type: "select",
      label: "What best describes your accessibility, health, or energy considerations right now?",
      options: [
        "No major constraints",
        "Need moderate flexibility",
        "Need strong accessibility support",
        "Need lower-physical-intensity roles",
        "Prefer not to say",
      ],
    },
    {
      id: "primary_strength",
      category: "Skills + Abilities",
      type: "select",
      label: "What is your strongest contribution to a community or project?",
      options: [
        "Teaching / mentoring",
        "Building / construction",
        "Gardening / farming",
        "Operations / organizing",
        "Creative / arts",
        "Wellness / care",
      ],
    },
    {
      id: "secondary_strength",
      category: "Skills + Abilities",
      type: "select",
      label: `What is your second-strongest contribution alongside ${primaryStrength.toLowerCase()}?`,
      options: [
        "Teaching / mentoring",
        "Building / construction",
        "Gardening / farming",
        "Operations / organizing",
        "Creative / arts",
        "Wellness / care",
      ],
    },
    {
      id: "role_preference",
      category: "Commitment + Fit",
      type: "select",
      label: "What role do you naturally want in a community?",
      options: [
        "Leader / initiator",
        "Reliable builder",
        "Organizer / systems person",
        "Caregiver / support role",
        "Explorer / still figuring it out",
      ],
    },
    {
      id: "deal_breakers",
      category: "Commitment + Fit",
      type: "textarea",
      label: `What are your biggest deal-breakers for a ${projectType.toLowerCase()} project?`,
      placeholder:
        "For example: too isolated, too crowded, not enough privacy, poor school fit, unclear ownership...",
    },
    {
      id: "relocation_readiness",
      category: "Location + Timing",
      type: "select",
      label: `Given your timeline of ${timeline.toLowerCase()}, how ready are you for real-world relocation steps?`,
      options: [
        "Not ready yet",
        "Collecting information",
        "Can start planning soon",
        "Actively preparing",
        "Already taking action",
      ],
    },
    {
      id: "success_definition",
      category: "Commitment + Fit",
      type: "textarea",
      label: "What would success look like for you one year after joining the right project?",
      placeholder:
        "Describe the life, rhythm, environment, and sense of belonging you want.",
    },
  ];
}

export function formatTimeLabel(isoString: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoString));
}

export function createTimestamp(offsetMinutes = 0) {
  return new Date(Date.now() + offsetMinutes * 60_000).toISOString();
}

export function presetFromId(id?: string): AvatarPreset | undefined {
  return AVATAR_PRESETS.find((preset) => preset.id === id);
}

export function getProjectMembershipBuckets<T extends Project>(projects: T[]) {
  return {
    created: projects.filter((project) => project.creatorId === "current-user"),
    joined: projects.filter((project) => project.creatorId !== "current-user"),
  };
}

export function inferConversationResponse(title: string, kind: Conversation["kind"]) {
  if (kind === "global") {
    return `The community has seen this topic before. A smart next step would be posting your location, timeline, and what kind of collaborators you want.`;
  }

  if (kind === "project") {
    return `Thanks for sharing this in ${title}. I can help coordinate next steps, answer questions, or line up the right people for the project.`;
  }

  return `Got it - I'm here. Let me know what you need next and I'll help you move it forward.`;
}

export function cloneMessages(messages: ChatMessage[]) {
  return messages.map((message) => ({ ...message }));
}

export function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function deriveInitials(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function buildUserProjectFromForm(project: UserProject): UserProject {
  return project;
}
