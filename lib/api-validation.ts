type AiMessageRole = "user" | "assistant" | "system";

export type AiRouteMessage = {
  role: AiMessageRole;
  content: string;
};

export type AiChatPayload = {
  messages: AiRouteMessage[];
  appContext: unknown;
};

const VALID_AI_ROLES = new Set<AiMessageRole>(["user", "assistant", "system"]);
const MAX_AI_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 12_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeRole(value: unknown): AiMessageRole | null {
  if (typeof value !== "string") return null;
  return VALID_AI_ROLES.has(value as AiMessageRole) ? (value as AiMessageRole) : null;
}

export function parseAiChatPayload(value: unknown): { ok: true; payload: AiChatPayload } | { ok: false; error: string } {
  if (!isRecord(value)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  if (!Array.isArray(value.messages)) {
    return { ok: false, error: "messages must be an array." };
  }

  if (value.messages.length === 0) {
    return { ok: false, error: "messages cannot be empty." };
  }

  if (value.messages.length > MAX_AI_MESSAGES) {
    return { ok: false, error: `messages cannot contain more than ${MAX_AI_MESSAGES} items.` };
  }

  const messages: AiRouteMessage[] = [];

  for (const rawMessage of value.messages) {
    if (!isRecord(rawMessage)) {
      return { ok: false, error: "Each message must be an object." };
    }

    const role = normalizeRole(rawMessage.role);
    if (!role) {
      return { ok: false, error: "Each message role must be user, assistant, or system." };
    }

    if (typeof rawMessage.content !== "string") {
      return { ok: false, error: "Each message content must be a string." };
    }

    const content = rawMessage.content.trim();
    if (!content) {
      return { ok: false, error: "Message content cannot be empty." };
    }

    if (content.length > MAX_MESSAGE_CHARS) {
      return { ok: false, error: `Message content cannot exceed ${MAX_MESSAGE_CHARS} characters.` };
    }

    messages.push({ role, content });
  }

  return {
    ok: true,
    payload: {
      messages,
      appContext: "appContext" in value ? value.appContext : {},
    },
  };
}
