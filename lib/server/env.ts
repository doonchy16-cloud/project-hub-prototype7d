const REQUIRED_ENV = ["MONGODB_URI", "MONGODB_DB", "APP_SESSION_SECRET"] as const;

type RequiredEnvKey = (typeof REQUIRED_ENV)[number];

export function getRequiredEnv(name: RequiredEnvKey): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Configure it before using MongoDB-backed features.`);
  }
  return value;
}

export function getMongoConfig() {
  return {
    uri: getRequiredEnv("MONGODB_URI"),
    dbName: getRequiredEnv("MONGODB_DB"),
  };
}

export function getSessionSecret() {
  return getRequiredEnv("APP_SESSION_SECRET");
}

export function isMongoConfigured() {
  return REQUIRED_ENV.every((name) => Boolean(process.env[name]));
}
