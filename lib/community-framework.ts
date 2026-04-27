import type { AppSeedUser, CommunitySkill, MatchingProfile, PersonMatchScore, Project, ProjectMatchScore } from "@/types/prototype";

export const COMMUNITY_SKILLS: CommunitySkill[] = [
  {
    id: "communication",
    label: "Communication",
    category: "Community Leadership",
    priority: "standard",
    description: "Clear updates, listening, agreements, and group communication habits.",
    keywords: ["communication", "listening", "updates", "clarity", "group"],
  },
  {
    id: "conflict-resolution",
    label: "Conflict resolution",
    category: "Community Leadership",
    priority: "highest",
    description: "Helping people move through tension, repair trust, and keep collaboration healthy.",
    keywords: ["conflict", "mediation", "repair", "trust", "agreement"],
  },
  {
    id: "governance",
    label: "Governance",
    category: "Community Leadership",
    priority: "highest",
    description: "Decision-making, roles, accountability, and fair community process.",
    keywords: ["governance", "decision", "roles", "accountability", "policy"],
  },
  {
    id: "leadership-facilitation",
    label: "Leadership + facilitation",
    category: "Community Leadership",
    priority: "standard",
    description: "Running meetings, coordinating people, and helping groups move forward.",
    keywords: ["leadership", "facilitation", "meeting", "coordinate", "organizing"],
  },
  {
    id: "water-systems",
    label: "Water systems",
    category: "Infrastructure",
    priority: "highest",
    description: "Water capture, filtration, storage, distribution, and conservation.",
    keywords: ["water", "well", "filtration", "catchment", "irrigation", "storage"],
  },
  {
    id: "power-systems",
    label: "Power systems",
    category: "Infrastructure",
    priority: "highest",
    description: "Solar, batteries, microgrids, backup power, and energy planning.",
    keywords: ["power", "solar", "energy", "battery", "microgrid", "electric"],
  },
  {
    id: "sanitation",
    label: "Sanitation",
    category: "Infrastructure",
    priority: "highest",
    description: "Wastewater, composting toilets, hygiene systems, and waste safety.",
    keywords: ["sanitation", "waste", "toilet", "graywater", "compost", "hygiene"],
  },
  {
    id: "construction-repair",
    label: "Construction + repair",
    category: "Infrastructure",
    priority: "highest",
    description: "Building, repair, shelter, tools, maintenance, and practical fixing.",
    keywords: ["build", "building", "construction", "repair", "maintenance", "shelter", "tools"],
  },
  {
    id: "food-production",
    label: "Food production",
    category: "Food + Land",
    priority: "highest",
    description: "Gardening, farming, animals, greenhouses, orchards, and reliable food systems.",
    keywords: ["food", "garden", "gardening", "farm", "farming", "growing", "regenerative"],
  },
  {
    id: "cooking-preservation",
    label: "Cooking + preservation",
    category: "Food + Land",
    priority: "standard",
    description: "Shared meals, canning, drying, fermentation, storage, and food routines.",
    keywords: ["cooking", "meal", "preservation", "canning", "ferment", "kitchen"],
  },
  {
    id: "land-management",
    label: "Land management",
    category: "Food + Land",
    priority: "standard",
    description: "Soil, trees, access paths, fire-wise planning, habitat, and long-term land care.",
    keywords: ["land", "soil", "trees", "forest", "habitat", "permaculture"],
  },
  {
    id: "emergency-preparedness",
    label: "Emergency preparedness",
    category: "Safety + Care",
    priority: "highest",
    description: "Readiness plans, supplies, safety drills, evacuation, and backup systems.",
    keywords: ["emergency", "preparedness", "safety", "risk", "backup", "resilience"],
  },
  {
    id: "health-wellness",
    label: "Health + wellness support",
    category: "Safety + Care",
    priority: "standard",
    description: "Care routines, wellness, accessibility, first response, and everyday support.",
    keywords: ["health", "wellness", "care", "accessibility", "support", "healing"],
  },
  {
    id: "security-risk-awareness",
    label: "Security + risk awareness",
    category: "Safety + Care",
    priority: "standard",
    description: "Risk review, site safety, boundaries, emergency response, and prevention.",
    keywords: ["security", "risk", "boundaries", "safety", "response"],
  },
  {
    id: "financial-management",
    label: "Financial management",
    category: "Operations",
    priority: "highest",
    description: "Budgeting, accounting, contributions, transparent costs, and funding plans.",
    keywords: ["finance", "financial", "budget", "accounting", "cost", "funding", "capital"],
  },
  {
    id: "administration-documentation",
    label: "Administration + documentation",
    category: "Operations",
    priority: "standard",
    description: "Records, admin systems, onboarding docs, agreements, and project organization.",
    keywords: ["administration", "documentation", "records", "onboarding", "systems"],
  },
  {
    id: "project-planning",
    label: "Project planning",
    category: "Operations",
    priority: "standard",
    description: "Milestones, sequencing, tasks, schedules, and execution planning.",
    keywords: ["planning", "timeline", "milestone", "tasks", "operations", "project"],
  },
  {
    id: "legal-regulatory",
    label: "Legal + regulatory awareness",
    category: "Operations",
    priority: "standard",
    description: "Permits, zoning, ownership structures, compliance, and documentation.",
    keywords: ["legal", "regulatory", "zoning", "permit", "ownership", "compliance"],
  },
  {
    id: "teaching-skill-sharing",
    label: "Teaching + skill-sharing",
    category: "Culture + Education",
    priority: "standard",
    description: "Helping members learn skills, mentor others, and share practical knowledge.",
    keywords: ["teaching", "mentoring", "learning", "education", "workshop", "skills"],
  },
  {
    id: "community-culture-building",
    label: "Community culture-building",
    category: "Culture + Education",
    priority: "standard",
    description: "Rituals, shared norms, belonging, events, and healthy day-to-day culture.",
    keywords: ["culture", "community", "belonging", "events", "shared"],
  },
  {
    id: "childcare-education",
    label: "Childcare + education support",
    category: "Culture + Education",
    priority: "standard",
    description: "Family support, child-safe routines, homeschooling, and youth learning.",
    keywords: ["childcare", "children", "kids", "family", "homeschool", "education"],
  },
  {
    id: "resource-sharing",
    label: "Resource sharing systems",
    category: "Operations",
    priority: "standard",
    description: "Tool libraries, shared inventories, member exchanges, and contribution systems.",
    keywords: ["resource", "sharing", "tools", "inventory", "exchange", "marketplace"],
  },
  {
    id: "emotional-intelligence",
    label: "Emotional intelligence + adaptability",
    category: "Community Leadership",
    priority: "standard",
    description: "Self-awareness, flexibility, relationship care, and adapting under pressure.",
    keywords: ["emotional", "adaptability", "awareness", "relationship", "flexible"],
  },
  {
    id: "responsibility-follow-through",
    label: "Responsibility + follow-through",
    category: "Operations",
    priority: "standard",
    description: "Reliability, ownership, commitments, and finishing what the group depends on.",
    keywords: ["responsibility", "follow-through", "reliable", "commitment", "ownership"],
  },
];

export const HIGH_PRIORITY_SKILL_IDS = COMMUNITY_SKILLS.filter((skill) => skill.priority === "highest").map(
  (skill) => skill.id
);

export const RESOURCE_CATALOG = [
  "Water testing, filtration, catchment, and storage planning",
  "Solar, battery, generator, and backup power system design",
  "Composting toilet, graywater, and waste management guidance",
  "Greenhouse, seed, nursery, soil, and food preservation suppliers",
  "Tool libraries, repair workshops, and shared equipment systems",
  "Site safety, emergency kits, communications, and first-response supplies",
];

export const FUNDING_PATHWAYS = [
  "Project-specific crowdfunding campaign",
  "Member contribution plan",
  "Community loan or cooperative ownership model",
  "Grant and nonprofit fiscal sponsorship research",
  "Sponsor, donor, or investor-ready project brief",
];

export const COMMUNITY_MEMBER_PROFILES: Record<string, Pick<MatchingProfile, "availability" | "goals" | "interests" | "rolePreferences" | "skillsOfferedIds" | "values">> = {
  "u-ava": {
    availability: "Weekends and parent-friendly build days",
    goals: "Family-centered food growing and education routines",
    interests: "Gardening, homeschooling, governance, childcare",
    rolePreferences: "Garden coordinator, parent mentor",
    skillsOfferedIds: ["food-production", "childcare-education", "teaching-skill-sharing", "governance"],
    values: "Family safety, shared meals, patient communication",
  },
  "u-marcus": {
    availability: "Build sprints and design sessions",
    goals: "Reliable desert off-grid infrastructure",
    interests: "Solar, water storage, tiny homes, emergency planning",
    rolePreferences: "Build lead, power systems coordinator",
    skillsOfferedIds: ["power-systems", "water-systems", "construction-repair", "emergency-preparedness"],
    values: "Practical action, resilience, direct communication",
  },
  "u-lina": {
    availability: "Weekly workshops and shared studio days",
    goals: "Creative homestead culture with shared resources",
    interests: "Art, food, culture-building, workshops",
    rolePreferences: "Culture host, workshop facilitator",
    skillsOfferedIds: ["community-culture-building", "teaching-skill-sharing", "resource-sharing", "food-production"],
    values: "Creativity, belonging, mutual aid",
  },
  "u-daniel": {
    availability: "Remote planning and monthly build weekends",
    goals: "Remote-work compatible intentional living",
    interests: "Operations, planning, tools, finance",
    rolePreferences: "Project planner, documentation lead",
    skillsOfferedIds: ["project-planning", "administration-documentation", "financial-management", "construction-repair"],
    values: "Clear systems, financial transparency, useful tools",
  },
  "u-sofia": {
    availability: "Family learning days and seasonal intensives",
    goals: "Outdoor education village for families",
    interests: "Education, childcare, food growing, governance",
    rolePreferences: "Educator, parent facilitator",
    skillsOfferedIds: ["childcare-education", "teaching-skill-sharing", "governance", "food-production"],
    values: "Learning, safety, intergenerational support",
  },
  "u-priya": {
    availability: "Farm planning and multi-day work sessions",
    goals: "Regenerative farm hub with strong food and finance systems",
    interests: "Land management, food production, water, finance",
    rolePreferences: "Farm coordinator, land steward",
    skillsOfferedIds: ["food-production", "land-management", "water-systems", "financial-management"],
    values: "Land care, accountability, long-term stewardship",
  },
  "u-carlos": {
    availability: "Bilingual weekend workshops",
    goals: "Maker homestead network with shared tools",
    interests: "Making, repair, teaching, bilingual community",
    rolePreferences: "Tool steward, repair mentor",
    skillsOfferedIds: ["construction-repair", "teaching-skill-sharing", "resource-sharing", "communication"],
    values: "Practical learning, family inclusion, shared tools",
  },
  "u-jasmine": {
    availability: "Remote coordination and warm-climate gatherings",
    goals: "Wellness-centered community harbor",
    interests: "Wellness, emergency planning, culture, administration",
    rolePreferences: "Care coordinator, support lead",
    skillsOfferedIds: ["health-wellness", "emergency-preparedness", "community-culture-building", "administration-documentation"],
    values: "Care, accessibility, emotional steadiness",
  },
};

export function getSkillLabel(skillId: string) {
  return COMMUNITY_SKILLS.find((skill) => skill.id === skillId)?.label ?? skillId;
}

export function getSkillsByCategory() {
  return COMMUNITY_SKILLS.reduce<Record<string, CommunitySkill[]>>((groups, skill) => {
    groups[skill.category] = [...(groups[skill.category] ?? []), skill];
    return groups;
  }, {});
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
}

export function deriveSkillIdsFromText(...values: string[]) {
  const source = values.join(" ").toLowerCase();
  return COMMUNITY_SKILLS.filter((skill) => skill.keywords.some((keyword) => source.includes(keyword))).map(
    (skill) => skill.id
  );
}

export function inferProjectNeededSkillIds(project: Project) {
  if (project.neededSkillIds && project.neededSkillIds.length > 0) {
    return uniqueValues(project.neededSkillIds);
  }

  const source = [
    project.title,
    project.category,
    project.description,
    ...project.tags,
    ...("profileKeywords" in project ? project.profileKeywords : []),
  ];

  return deriveSkillIdsFromText(...source);
}

export function deriveUserSkillIds(skillIds: string[], answers: Record<string, string>, profileText: string) {
  return uniqueValues([...skillIds, ...deriveSkillIdsFromText(...Object.values(answers), profileText)]);
}

export function scoreProjectCompatibility({
  project,
  userSkillIds,
  questionnaireAnswers,
  profileText,
  selectedCountry,
  selectedRegion,
  selectedCity,
}: {
  project: Project;
  userSkillIds: string[];
  questionnaireAnswers: Record<string, string>;
  profileText: string;
  selectedCountry: string;
  selectedRegion: string;
  selectedCity: string;
}): ProjectMatchScore {
  const reasons: string[] = [];
  let score = 12;
  let locationFit: ProjectMatchScore["locationFit"] = "unknown";

  if (selectedCity && selectedRegion && selectedCountry) {
    if (project.city === selectedCity && project.state === selectedRegion && project.country === selectedCountry) {
      score += 22;
      locationFit = "same-city";
      reasons.push(`Same city: ${project.city}`);
    } else if (project.state === selectedRegion && project.country === selectedCountry) {
      score += 17;
      locationFit = "same-region";
      reasons.push(`Same region: ${project.state}`);
    } else if (project.country === selectedCountry) {
      score += 9;
      locationFit = "same-country";
      reasons.push(`Same country: ${project.country}`);
    } else {
      locationFit = "different-location";
    }
  }

  const projectSkillIds = inferProjectNeededSkillIds(project);
  const matchedSkillIds = projectSkillIds.filter((skillId) => userSkillIds.includes(skillId));
  const matchedSkillLabels = matchedSkillIds.map(getSkillLabel);
  const missingPrioritySkillLabels = projectSkillIds
    .filter((skillId) => HIGH_PRIORITY_SKILL_IDS.includes(skillId) && !userSkillIds.includes(skillId))
    .map(getSkillLabel);

  if (projectSkillIds.length > 0) {
    const skillScore = Math.round((matchedSkillIds.length / projectSkillIds.length) * 30);
    score += skillScore;
    if (matchedSkillLabels.length > 0) {
      reasons.push(`Skill fit: ${matchedSkillLabels.slice(0, 2).join(", ")}`);
    }
  }

  const answerTokens = tokenize([...Object.values(questionnaireAnswers), profileText].join(" "));
  const projectBlob = [
    project.title,
    project.category,
    project.location,
    project.description,
    ...project.tags,
    ...("profileKeywords" in project ? project.profileKeywords : []),
  ]
    .join(" ")
    .toLowerCase();
  const matchingTokens = uniqueValues(answerTokens.filter((token) => projectBlob.includes(token)));

  score += Math.min(22, matchingTokens.length * 2);
  if (matchingTokens.length > 0) {
    reasons.push(`Interest overlap: ${matchingTokens.slice(0, 3).join(", ")}`);
  }

  const readiness = String(questionnaireAnswers.relocation_readiness || questionnaireAnswers.timeline || "").toLowerCase();
  if (readiness.includes("ready") || readiness.includes("preparing") || readiness.includes("soon")) {
    score += 8;
    reasons.push("Timeline is actionable");
  }

  if (project.privacy === "public") {
    score += 4;
  }

  return {
    score: Math.min(100, score),
    reasons: reasons.slice(0, 4),
    matchedSkillLabels,
    missingPrioritySkillLabels: uniqueValues(missingPrioritySkillLabels),
    locationFit,
  };
}

export function scorePersonCompatibility({
  person,
  currentUserSkillIds,
  matchingProfile,
  questionnaireAnswers,
}: {
  person: AppSeedUser;
  currentUserSkillIds: string[];
  matchingProfile: MatchingProfile;
  questionnaireAnswers: Record<string, string>;
}): PersonMatchScore {
  const profile = COMMUNITY_MEMBER_PROFILES[person.id];
  const reasons: string[] = [];

  if (!profile) {
    return {
      personId: person.id,
      score: 20,
      reasons: ["Profile is still being completed"],
      sharedSkillLabels: [],
      complementarySkillLabels: [],
    };
  }

  let score = 18;
  const sharedSkillIds = profile.skillsOfferedIds.filter((skillId) => currentUserSkillIds.includes(skillId));
  const complementarySkillIds = profile.skillsOfferedIds.filter((skillId) => !currentUserSkillIds.includes(skillId));
  const sharedSkillLabels = sharedSkillIds.map(getSkillLabel);
  const complementarySkillLabels = complementarySkillIds.map(getSkillLabel);

  score += Math.min(28, sharedSkillIds.length * 7);
  score += Math.min(22, complementarySkillIds.length * 4);

  if (sharedSkillLabels.length > 0) {
    reasons.push(`Shared skills: ${sharedSkillLabels.slice(0, 2).join(", ")}`);
  }
  if (complementarySkillLabels.length > 0) {
    reasons.push(`Adds: ${complementarySkillLabels.slice(0, 2).join(", ")}`);
  }

  const userText = [
    matchingProfile.values,
    matchingProfile.interests,
    matchingProfile.goals,
    matchingProfile.needs,
    matchingProfile.rolePreferences,
    ...Object.values(questionnaireAnswers),
  ].join(" ");
  const personText = [profile.values, profile.interests, profile.goals, profile.rolePreferences].join(" ").toLowerCase();
  const overlap = uniqueValues(tokenize(userText).filter((token) => personText.includes(token)));

  score += Math.min(22, overlap.length * 3);
  if (overlap.length > 0) {
    reasons.push(`Values/interests overlap: ${overlap.slice(0, 3).join(", ")}`);
  }

  if (matchingProfile.availability && profile.availability.toLowerCase().includes("weekend") && matchingProfile.availability.toLowerCase().includes("weekend")) {
    score += 8;
    reasons.push("Availability overlap");
  }

  return {
    personId: person.id,
    score: Math.min(100, score),
    reasons: reasons.slice(0, 4),
    sharedSkillLabels,
    complementarySkillLabels,
  };
}
