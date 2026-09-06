import mongoose from "mongoose";

const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/siyana";

/*
 * Next reloads modules on every edit in dev, which would open a new pool each
 * time. Cache the promise on globalThis so there is only ever one connection.
 */
const cache = (globalThis.__siyanaMongo ??= { conn: null, promise: null });

export default async function db() {
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(URI, { bufferCommands: false });
  cache.conn = await cache.promise;
  return cache.conn;
}

/** Mongoose documents carry class instances and ObjectIds that RSC can't serialise. */
export const plain = (doc) => JSON.parse(JSON.stringify(doc));
