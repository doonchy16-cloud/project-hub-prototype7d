import type { MatchingProfile, ProjectPrivacy } from "@/types/prototype";
import type { ObjectId } from "mongodb";

export type SessionUser = {
  userId: string;
  profileId: string;
  email: string;
};

export type MongoUserDocument = {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  profileId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type MongoProfileDocument = {
  _id: ObjectId;
  email: string;
  fullName: string;
  preferredName?: string;
  phone?: string;
  city?: string;
  region?: string;
  country?: string;
  continent?: string;
  avatarType?: "preset" | "upload";
  avatarPresetId?: string;
  avatarUploadUrl?: string;
  online?: boolean;
  matchingProfile?: MatchingProfile;
  createdAt: Date;
  updatedAt: Date;
};

export type MongoProjectDocument = {
  _id: ObjectId;
  ownerProfileId: ObjectId;
  title: string;
  description: string;
  category?: string;
  tags: string[];
  city?: string;
  region?: string;
  country?: string;
  continent?: string;
  location?: string;
  lat?: number;
  lng?: number;
  privacy: ProjectPrivacy;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
};

export type MongoProjectMembershipDocument = {
  _id: ObjectId;
  projectId: ObjectId;
  profileId: ObjectId;
  status: "joined" | "requested" | "owner";
  createdAt: Date;
  updatedAt: Date;
};

export type MongoConversationDocument = {
  _id: ObjectId;
  type: "global" | "project" | "direct";
  title: string;
  projectId?: ObjectId;
  createdByProfileId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type MongoConversationParticipantDocument = {
  _id: ObjectId;
  conversationId: ObjectId;
  profileId: ObjectId;
  createdAt: Date;
};

export type MongoMessageDocument = {
  _id: ObjectId;
  conversationId: ObjectId;
  senderProfileId: ObjectId;
  senderName: string;
  body: string;
  createdAt: Date;
};

export type MongoFavoriteDocument = {
  _id: ObjectId;
  profileId: ObjectId;
  projectId: ObjectId;
  createdAt: Date;
};

export type MongoQuestionnaireDocument = {
  _id: ObjectId;
  profileId: ObjectId;
  answers: Record<string, string>;
  updatedAt: Date;
};
