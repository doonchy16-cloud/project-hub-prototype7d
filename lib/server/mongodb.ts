import { MongoClient, ServerApiVersion, type Db } from "mongodb";
import { getMongoConfig } from "@/lib/server/env";

declare global {
  // eslint-disable-next-line no-var
  var _prototype7dMongoClientPromise: Promise<MongoClient> | undefined;
}

function createMongoClient() {
  const { uri } = getMongoConfig();
  return new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

export async function getMongoClient() {
  if (!global._prototype7dMongoClientPromise) {
    global._prototype7dMongoClientPromise = createMongoClient().connect();
  }

  return global._prototype7dMongoClientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();
  const { dbName } = getMongoConfig();
  return client.db(dbName);
}
