import { canAccessProjectChat } from "@/lib/project-workflows";
import type { AppSeedUser, ChatMessage, Conversation, Project } from "@/types/prototype";

type BuildConversationsInput = {
  globalChatOptIn: boolean;
  projects: Project[];
  currentUserId: string;
  seedUsers: AppSeedUser[];
  messagesByConversation: Record<string, ChatMessage[]>;
  lastReadAtByConversation: Record<string, string>;
  searchQuery: string;
};

function getUnreadCount(
  conversationId: string,
  messagesByConversation: Record<string, ChatMessage[]>,
  lastReadAtByConversation: Record<string, string>,
  currentUserId: string
) {
  const lastReadAt = lastReadAtByConversation[conversationId];
  const lastReadTime = lastReadAt ? new Date(lastReadAt).getTime() : 0;

  return (messagesByConversation[conversationId] ?? []).filter((message) => {
    if (message.senderId === currentUserId) return false;
    return new Date(message.createdAt).getTime() > lastReadTime;
  }).length;
}

export function buildAvailableConversations({
  globalChatOptIn,
  projects,
  currentUserId,
  seedUsers,
  messagesByConversation,
  lastReadAtByConversation,
  searchQuery,
}: BuildConversationsInput): Conversation[] {
  const conversations: Conversation[] = [];

  if (globalChatOptIn) {
    conversations.push({
      id: "global-community",
      kind: "global",
      title: "Global community",
      subtitle: "All opted-in members",
      avatarLabel: "GL",
      avatarGradient: "from-slate-700 to-sky-700",
      unreadCount: getUnreadCount("global-community", messagesByConversation, lastReadAtByConversation, currentUserId),
      participantIds: [currentUserId],
      canAccess: true,
      pinned: true,
    });
  }

  const accessibleProjects = projects.filter((project) => canAccessProjectChat(project, currentUserId));

  const projectConversations = accessibleProjects.map((project) => ({
    id: `project-${project.id}`,
    kind: "project" as const,
    title: project.title,
    subtitle: `${project.privacy === "public" ? "Public" : "Private"} project room`,
    projectId: project.id,
    avatarLabel: project.thumbnail || project.title.slice(0, 2).toUpperCase(),
    avatarGradient: "from-sky-500 to-indigo-600",
    unreadCount: getUnreadCount(`project-${project.id}`, messagesByConversation, lastReadAtByConversation, currentUserId),
    participantIds: [currentUserId, project.creatorId],
    canAccess: true,
  }));

  const creatorIds = Array.from(
    new Set(
      accessibleProjects
        .map((project) => project.creatorId)
        .filter((creatorId) => creatorId !== currentUserId)
    )
  );

  const directConversations = creatorIds.map((creatorId) => {
    const person = seedUsers.find((user) => user.id === creatorId);
    const conversationId = `direct-${creatorId}`;
    return {
      id: conversationId,
      kind: "direct" as const,
      title: person?.fullName || "Direct chat",
      subtitle: "Project owner direct channel",
      avatarLabel: person?.avatarLabel || "DM",
      avatarGradient: person?.avatarGradient || "from-slate-500 to-slate-700",
      online: person?.online,
      unreadCount: getUnreadCount(conversationId, messagesByConversation, lastReadAtByConversation, currentUserId),
      participantIds: [currentUserId, creatorId],
      canAccess: true,
    };
  });

  const combined = [...conversations, ...projectConversations, ...directConversations];
  const q = searchQuery.trim().toLowerCase();
  if (!q) return combined;

  return combined.filter((conversation) =>
    [conversation.title, conversation.subtitle, conversation.kind].join(" ").toLowerCase().includes(q)
  );
}
