import { getSkillLabel } from "@/lib/community-framework";
import { CURRENT_USER_ID, type UserProjectForm } from "@/lib/prototype-constants";
import { createTimestamp, generateId } from "@/lib/prototype-utils";
import { sharedProjectsSeed } from "@/lib/seed-data";
import type {
  ChatMessage,
  JoinStatus,
  Project,
  ProjectMembershipFilter,
  SharedProject,
  UserProject,
} from "@/types/prototype";

export const DEFAULT_PROJECT_JOIN_STATUSES: Record<number, JoinStatus> = {
  1: "joined",
  2: "joined",
  3: "not_joined",
  4: "not_joined",
  5: "not_joined",
  6: "not_joined",
  7: "not_joined",
  8: "not_joined",
};

export function normalizeSharedProjects(
  joinStatuses: Record<number, JoinStatus>,
  projects: SharedProject[] = sharedProjectsSeed
): SharedProject[] {
  return projects.map((project) => ({
    ...project,
    joinStatus: joinStatuses[project.id] ?? project.joinStatus ?? "not_joined",
  }));
}

export function isUserProject(project: Project): project is UserProject {
  return "visibility" in project;
}

export function isProjectOwner(project: Project, currentUserId = CURRENT_USER_ID) {
  return project.creatorId === currentUserId;
}

export function isProjectJoined(project: Project, currentUserId = CURRENT_USER_ID) {
  return isProjectOwner(project, currentUserId) || (("joinStatus" in project ? project.joinStatus : "joined") === "joined");
}

export function canAccessProjectChat(project: Project, currentUserId = CURRENT_USER_ID) {
  return isProjectJoined(project, currentUserId);
}

export function canLeaveProject(project: Project, currentUserId = CURRENT_USER_ID) {
  return !isProjectOwner(project, currentUserId) && isProjectJoined(project, currentUserId);
}

export function leaveProjectMembership({
  joinStatuses,
  project,
  currentUserId = CURRENT_USER_ID,
}: {
  joinStatuses: Record<number, JoinStatus>;
  project: Project;
  currentUserId?: string;
}) {
  if (!canLeaveProject(project, currentUserId)) return joinStatuses;
  return { ...joinStatuses, [project.id]: "not_joined" as JoinStatus };
}

export function collectProjectSources(sharedProjects: SharedProject[], userProjects: UserProject[]): Project[] {
  return [...sharedProjects, ...userProjects];
}

export function getMyProjectsCollection({
  sharedProjects,
  userProjects,
  filter,
  currentUserId = CURRENT_USER_ID,
}: {
  sharedProjects: SharedProject[];
  userProjects: UserProject[];
  filter: ProjectMembershipFilter;
  currentUserId?: string;
}): Project[] {
  const joined = sharedProjects.filter((project) => isProjectJoined(project, currentUserId) && !isProjectOwner(project, currentUserId));
  const created = userProjects.filter((project) => isProjectOwner(project, currentUserId));
  if (filter === "created") return created;
  if (filter === "joined") return joined;
  return [...created, ...joined];
}

export function getProjectSearchText(project: Project) {
  return [
    project.title,
    project.creator,
    project.category,
    project.location,
    project.description,
    project.communityStyle ?? "",
    project.locationConstraints ?? "",
    project.fundingGoal ?? "",
    project.fundingUse ?? "",
    ...(project.fundingNeeds ?? []),
    ...(project.resourceNeeds ?? []),
    ...(project.desiredMemberTypes ?? []),
    ...project.tags,
    ...(project.neededSkillIds ?? []).map(getSkillLabel),
    ...("profileKeywords" in project ? project.profileKeywords : []),
  ]
    .join(" ")
    .toLowerCase();
}

export function filterProjectsByQuery(projects: Project[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return projects;
  return projects.filter((project) => getProjectSearchText(project).includes(q));
}

export function parseCsvList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildUserProjectFromForm({
  id,
  form,
  currentUserName,
  continent,
  location,
  coordinates,
}: {
  id: number;
  form: UserProjectForm;
  currentUserName: string;
  continent: string;
  location: string;
  coordinates: { lat: number; lng: number };
}): UserProject {
  const enteredTags = parseCsvList(form.tags);
  const skillTags = form.neededSkillIds.map((skillId) => getSkillLabel(skillId).toLowerCase());

  return {
    id,
    title: form.title.trim(),
    creatorId: CURRENT_USER_ID,
    creator: currentUserName,
    category: form.category,
    location,
    state: form.region,
    country: form.country,
    continent,
    city: form.city,
    description: form.description.trim(),
    tags: Array.from(new Set([...enteredTags, ...skillTags])),
    thumbnail: form.title.trim().slice(0, 2).toUpperCase(),
    lat: coordinates.lat,
    lng: coordinates.lng,
    privacy: "public",
    visibility: "public",
    joinStatus: "joined",
    neededSkillIds: form.neededSkillIds,
    desiredMemberTypes: parseCsvList(form.desiredMemberTypes),
    locationConstraints: form.locationConstraints.trim(),
    resourceNeeds: parseCsvList(form.resourceNeeds),
    fundingGoal: form.fundingGoal.trim(),
    fundingUse: form.fundingUse.trim(),
    fundingNeeds: parseCsvList(form.fundingNeeds),
    communityStyle: form.communityStyle,
  };
}

export function createProjectRoomMessage(project: Project, senderName: string): ChatMessage {
  return {
    id: generateId("msg"),
    conversationId: `project-${project.id}`,
    senderId: CURRENT_USER_ID,
    senderName,
    content: `Welcome to ${project.title}. This room is ready for project members and future backend sync.`,
    createdAt: createTimestamp(0),
  };
}

export function createJoinProjectMessages(project: SharedProject, currentUserName: string) {
  const projectRoomMessage: ChatMessage = {
    id: generateId("msg"),
    conversationId: `project-${project.id}`,
    senderId: project.creatorId,
    senderName: project.creator,
    content: `Welcome to ${project.title}. You're now in the project room and you can message the project owner directly.`,
    createdAt: createTimestamp(0),
  };

  const directMessage: ChatMessage = {
    id: generateId("msg"),
    conversationId: `direct-${project.creatorId}`,
    senderId: project.creatorId,
    senderName: project.creator,
    content: `Hi ${currentUserName}! I saw you joined ${project.title}. Feel free to ask questions here anytime.`,
    createdAt: createTimestamp(1),
  };

  return { projectRoomMessage, directMessage };
}
