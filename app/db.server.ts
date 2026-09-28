import { MongoClient, type Db } from "mongodb";
import { env } from "./env.server";

declare global {
  // eslint-disable-next-line no-var
  var mongoClientGlobal: MongoClient | undefined;
}

// Reuse one client across dev hot reloads instead of opening a new pool each time.
const client = global.mongoClientGlobal ?? new MongoClient(env.MONGODB_URI);

if (!env.isProduction) {
  global.mongoClientGlobal = client;
}

export const mongoClient = client;

export function getDb(): Db {
  return client.db(env.MONGODB_DB_NAME);
}

export default getDb;
