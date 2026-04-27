import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/server/mongodb";
import type {
  MongoConversationDocument,
  MongoConversationParticipantDocument,
  MongoFavoriteDocument,
  MongoMessageDocument,
  MongoProfileDocument,
  MongoProjectDocument,
  MongoProjectMembershipDocument,
  MongoQuestionnaireDocument,
  MongoUserDocument,
} from "@/types/backend";
import type { MatchingProfile, ProjectPrivacy } from "@/types/prototype";

export function toObjectId(id: string) {
  return new ObjectId(id);
}

export function objectIdToString(id: ObjectId) {
  return id.toHexString();
}

export async function getCollections() {
  const db = await getMongoDb();
  return {
    users: db.collection<MongoUserDocument>("users"),
    profiles: db.collection<MongoProfileDocument>("profiles"),
    projects: db.collection<MongoProjectDocument>("projects"),
    projectMemberships: db.collection<MongoProjectMembershipDocument>("project_memberships"),
    conversations: db.collection<MongoConversationDocument>("conversations"),
    conversationParticipants: db.collection<MongoConversationParticipantDocument>("conversation_participants"),
    messages: db.collection<MongoMessageDocument>("messages"),
    favorites: db.collection<MongoFavoriteDocument>("favorites"),
    questionnaires: db.collection<MongoQuestionnaireDocument>("questionnaires"),
  };
}

export async function createProfileAndUser(input: {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
}) {
  const { users, profiles } = await getCollections();
  const existing = await users.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const profileId = new ObjectId();
  const now = new Date();

  await profiles.insertOne({
    _id: profileId,
    email: input.email.toLowerCase(),
    fullName: input.fullName,
    phone: input.phone,
    online: true,
    createdAt: now,
    updatedAt: now,
  });

  const userInsert = await users.insertOne({
    _id: new ObjectId(),
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    profileId,
    createdAt: now,
    updatedAt: now,
  });

  return {
    userId: objectIdToString(userInsert.insertedId),
    profileId: objectIdToString(profileId),
    email: input.email.toLowerCase(),
  };
}

export async function findUserByEmail(email: string) {
  const { users } = await getCollections();
  return users.findOne({ email: email.toLowerCase() });
}

export async function getProfileById(profileId: string) {
  const { profiles } = await getCollections();
  return profiles.findOne({ _id: toObjectId(profileId) });
}

export async function upsertProfile(profileId: string, updates: Partial<MongoProfileDocument>) {
  const { profiles } = await getCollections();
  await profiles.updateOne(
    { _id: toObjectId(profileId) },
    { $set: { ...updates, updatedAt: new Date() } },
    { upsert: false }
  );
  return profiles.findOne({ _id: toObjectId(profileId) });
}

export async function createProject(input: {
  ownerProfileId: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  city?: string;
  region?: string;
  country?: string;
  continent?: string;
  location?: string;
  lat?: number;
  lng?: number;
  privacy?: ProjectPrivacy;
}) {
  const { projects, projectMemberships, conversations, conversationParticipants } = await getCollections();
  const now = new Date();
  const projectId = new ObjectId();
  const ownerProfileObjectId = toObjectId(input.ownerProfileId);

  await projects.insertOne({
    _id: projectId,
    ownerProfileId: ownerProfileObjectId,
    title: input.title,
    description: input.description,
    category: input.category,
    tags: input.tags ?? [],
    city: input.city,
    region: input.region,
    country: input.country,
    continent: input.continent,
    location: input.location,
    lat: input.lat,
    lng: input.lng,
    privacy: input.privacy ?? "public",
    status: "active",
    createdAt: now,
    updatedAt: now,
  });

  await projectMemberships.insertOne({
    _id: new ObjectId(),
    projectId,
    profileId: ownerProfileObjectId,
    status: "owner",
    createdAt: now,
    updatedAt: now,
  });

  const conversationInsert = await conversations.insertOne({
    _id: new ObjectId(),
    type: "project",
    title: input.title,
    projectId,
    createdByProfileId: ownerProfileObjectId,
    createdAt: now,
    updatedAt: now,
  });

  await conversationParticipants.insertOne({
    _id: new ObjectId(),
    conversationId: conversationInsert.insertedId,
    profileId: ownerProfileObjectId,
    createdAt: now,
  });

  return objectIdToString(projectId);
}

export async function listProjects() {
  const { projects } = await getCollections();
  return projects.find({ status: "active" }).sort({ createdAt: -1 }).toArray();
}

export async function getProjectById(projectId: string) {
  const { projects } = await getCollections();
  return projects.findOne({ _id: toObjectId(projectId) });
}

export async function setProjectMembership(input: {
  projectId: string;
  profileId: string;
  action: "join" | "leave" | "request";
}) {
  const { projects, projectMemberships, conversations, conversationParticipants } = await getCollections();
  const projectObjectId = toObjectId(input.projectId);
  const profileObjectId = toObjectId(input.profileId);
  const project = await projects.findOne({ _id: projectObjectId });
  if (!project) {
    throw new Error("Project not found.");
  }

  const now = new Date();
  const projectConversation = await conversations.findOne({ projectId: projectObjectId, type: "project" });

  if (input.action === "leave") {
    await projectMemberships.deleteOne({ projectId: projectObjectId, profileId: profileObjectId, status: { $ne: "owner" } as any });
    if (projectConversation) {
      await conversationParticipants.deleteOne({ conversationId: projectConversation._id, profileId: profileObjectId });
    }
    return { status: "left" };
  }

  const status = input.action === "request" || project.privacy === "private" ? "requested" : "joined";
  await projectMemberships.updateOne(
    { projectId: projectObjectId, profileId: profileObjectId },
    { $set: { status, updatedAt: now }, $setOnInsert: { _id: new ObjectId(), createdAt: now } },
    { upsert: true }
  );

  if (status === "joined" && projectConversation) {
    await conversationParticipants.updateOne(
      { conversationId: projectConversation._id, profileId: profileObjectId },
      { $setOnInsert: { _id: new ObjectId(), createdAt: now } },
      { upsert: true }
    );
  }

  return { status };
}

export async function listConversationsForProfile(profileId: string) {
  const { conversationParticipants, conversations } = await getCollections();
  const profileObjectId = toObjectId(profileId);
  const participants = await conversationParticipants.find({ profileId: profileObjectId }).toArray();
  const ids = participants.map((item) => item.conversationId);
  if (!ids.length) return [];
  return conversations.find({ _id: { $in: ids } }).sort({ updatedAt: -1 }).toArray();
}

export async function listMessagesForConversation(conversationId: string) {
  const { messages } = await getCollections();
  return messages.find({ conversationId: toObjectId(conversationId) }).sort({ createdAt: 1 }).toArray();
}

export async function createMessage(input: {
  conversationId: string;
  senderProfileId: string;
  senderName: string;
  body: string;
}) {
  const { messages, conversations } = await getCollections();
  const now = new Date();
  const conversationObjectId = toObjectId(input.conversationId);
  const insert = await messages.insertOne({
    _id: new ObjectId(),
    conversationId: conversationObjectId,
    senderProfileId: toObjectId(input.senderProfileId),
    senderName: input.senderName,
    body: input.body,
    createdAt: now,
  });
  await conversations.updateOne({ _id: conversationObjectId }, { $set: { updatedAt: now } });
  return objectIdToString(insert.insertedId);
}

export async function replaceFavorites(profileId: string, projectIds: string[]) {
  const { favorites } = await getCollections();
  const profileObjectId = toObjectId(profileId);
  await favorites.deleteMany({ profileId: profileObjectId });
  if (!projectIds.length) return;
  await favorites.insertMany(
    projectIds.map((projectId) => ({
      _id: new ObjectId(),
      profileId: profileObjectId,
      projectId: toObjectId(projectId),
      createdAt: new Date(),
    }))
  );
}

export async function listFavorites(profileId: string) {
  const { favorites } = await getCollections();
  return favorites.find({ profileId: toObjectId(profileId) }).toArray();
}

export async function saveQuestionnaireAnswers(profileId: string, answers: Record<string, string>) {
  const { questionnaires } = await getCollections();
  const now = new Date();
  await questionnaires.updateOne(
    { profileId: toObjectId(profileId) },
    { $set: { answers, updatedAt: now }, $setOnInsert: { _id: new ObjectId() } },
    { upsert: true }
  );
}

export async function getQuestionnaireAnswers(profileId: string) {
  const { questionnaires } = await getCollections();
  return questionnaires.findOne({ profileId: toObjectId(profileId) });
}

export async function ensureGlobalConversation() {
  const { conversations } = await getCollections();
  const existing = await conversations.findOne({ type: "global" });
  if (existing) return existing;
  const now = new Date();
  const insert = await conversations.insertOne({
    _id: new ObjectId(),
    type: "global",
    title: "Global Community",
    createdAt: now,
    updatedAt: now,
  });
  return conversations.findOne({ _id: insert.insertedId });
}

export async function ensureProfileConversationMembership(profileId: string, conversationId: string) {
  const { conversationParticipants } = await getCollections();
  await conversationParticipants.updateOne(
    { conversationId: toObjectId(conversationId), profileId: toObjectId(profileId) },
    { $setOnInsert: { _id: new ObjectId(), createdAt: new Date() } },
    { upsert: true }
  );
}

export function serializeMongo<T extends { _id?: ObjectId; createdAt?: Date; updatedAt?: Date }>(doc: T | null) {
  if (!doc) return null;
  const { _id, ...rest } = doc as any;
  return {
    id: _id ? objectIdToString(_id) : undefined,
    ...Object.fromEntries(
      Object.entries(rest).map(([key, value]) => {
        if (value instanceof ObjectId) return [key, objectIdToString(value)];
        if (value instanceof Date) return [key, value.toISOString()];
        return [key, value];
      })
    ),
  };
}

export function serializeMongoMany<T extends { _id?: ObjectId }>(docs: T[]) {
  return docs.map((doc) => serializeMongo(doc));
}
