import type { LucideIcon } from "lucide-react";

export type ThemeMode = "light" | "dark";
export type AppStage = "signin_profile" | "signin_plan" | "signin_confirmation" | "app";
export type PageKey =
  | "home"
  | "matches"
  | "projects"
  | "favorites"
  | "chats"
  | "support"
  | "ecosystem"
  | "settings"
  | "account_info"
  | "answers_summary"
  | "questionnaire"
  | "project_detail";
export type PlanKey = "starter" | "pro" | "skip";
export type ProjectsTabKey = "explore" | "my_projects";
export type ProjectMembershipFilter = "all" | "created" | "joined";
export type ChatsTab = "user" | "ai";
export type JoinStatus = "not_joined" | "joined" | "requested";
export type ProjectPrivacy = "public" | "private";
export type ConversationKind = "global" | "project" | "direct";
export type MessageRole = "user" | "assistant";
export type SkillPriority = "highest" | "standard";
export type CommunitySkillCategory =
  | "Community Leadership"
  | "Infrastructure"
  | "Food + Land"
  | "Safety + Care"
  | "Operations"
  | "Culture + Education";

export type ThemeStyles = {
  appBg: string;
  panel: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  primary: string;
  primaryText: string;
  pill: string;
  shadow: string;
};

export type RegionData = {
  name: string;
  cities: string[];
};

export type CountryData = {
  regionLabel: string;
  cityLabel?: string;
  regions: RegionData[];
};

export type LocationData = Record<string, Record<string, CountryData>>;

export type Question = {
  id: string;
  category: string;
  type: "select" | "textarea";
  label: string;
  options?: string[];
  placeholder?: string;
};

export type AvatarPreset = {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
};

export type CommunitySkill = {
  id: string;
  label: string;
  category: CommunitySkillCategory;
  priority: SkillPriority;
  description: string;
  keywords: string[];
};

export type MatchingProfile = {
  preferredName: string;
  age: string;
  gender: string;
  occupation: string;
  companyOrSchool: string;
  languages: string;
  maritalStatus: string;
  emergencyContact: string;
  website: string;
  hobbies: string;
  values: string;
  interests: string;
  skillsOfferedIds: string[];
  educationLevel: string;
  workExperience: string;
  experienceLevel: string;
  availability: string;
  rolePreferences: string;
  goals: string;
  needs: string;
};

export type ProjectMatchScore = {
  score: number;
  reasons: string[];
  matchedSkillLabels: string[];
  missingPrioritySkillLabels: string[];
  locationFit: "same-city" | "same-region" | "same-country" | "different-location" | "unknown";
};

export type PersonMatchScore = {
  personId: string;
  score: number;
  reasons: string[];
  sharedSkillLabels: string[];
  complementarySkillLabels: string[];
};

export type UserProfile = {
  id: string;
  fullName: string;
  preferredName?: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  country?: string;
  continent?: string;
  matchingProfile?: MatchingProfile;
  avatarType: "preset" | "upload";
  avatarPresetId?: string;
  avatarUploadUrl?: string;
  online: boolean;
};

export type BaseProject = {
  id: number;
  title: string;
  creatorId: string;
  creator: string;
  category: string;
  location: string;
  state: string;
  country: string;
  continent: string;
  city: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  lat: number;
  lng: number;
  privacy: ProjectPrivacy;
  neededSkillIds?: string[];
  desiredMemberTypes?: string[];
  locationConstraints?: string;
  resourceNeeds?: string[];
  fundingGoal?: string;
  fundingUse?: string;
  fundingNeeds?: string[];
  communityStyle?: string;
};

export type SharedProject = BaseProject & {
  profileKeywords: string[];
  score?: number;
  reasons?: string[];
  joinStatus?: JoinStatus;
};

export type UserProject = BaseProject & {
  visibility: "public";
  joinStatus: "joined";
};

export type Project = SharedProject | UserProject;
export type MapMode = "mini" | "full";

export type ProjectMapProps = {
  projects: Project[];
  highlightedIds: number[];
  activeProjectId: number | null;
  onSelectProject?: (project: Project) => void;
  mode: MapMode;
};

export type NavItem = {
  key: Exclude<PageKey, "questionnaire" | "project_detail">;
  label: string;
  icon: LucideIcon;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  role?: MessageRole;
  content: string;
  createdAt: string;
  status?: "sent" | "streaming" | "error";
};

export type Conversation = {
  id: string;
  kind: ConversationKind;
  title: string;
  subtitle: string;
  projectId?: number;
  avatarLabel: string;
  avatarGradient: string;
  online?: boolean;
  unreadCount: number;
  participantIds: string[];
  optedInRequired?: boolean;
  canAccess: boolean;
  pinned?: boolean;
};

export type AppSeedUser = {
  id: string;
  fullName: string;
  avatarLabel: string;
  avatarGradient: string;
  online: boolean;
  matchingProfile?: MatchingProfile;
};
