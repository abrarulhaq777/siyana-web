import { Readable } from "node:stream";
import mongoose from "mongoose";
import db from "./db.js";

/*
 * Admin uploads are stored in MongoDB (GridFS), not on disk. The host rebuilds the
 * app from git on every deploy and public/uploads is git-ignored, so a file written
 * there disappears with the next push. URLs stay /uploads/<name> either way.
 */
export const TYPES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif" };
export const typeFor = (name) =>
  Object.keys(TYPES).find((t) => name.toLowerCase().endsWith(TYPES[t])) ?? (/\.jpe?g$/i.test(name) ? "image/jpeg" : null);

async function bucket() {
  const conn = await db();
  return new mongoose.mongo.GridFSBucket(conn.connection.db, { bucketName: "uploads" });
}

export async function saveUpload(name, buffer, contentType) {
  const b = await bucket();
  await new Promise((resolve, reject) =>
    b.openUploadStream(name, { metadata: { contentType } }).on("finish", resolve).on("error", reject).end(buffer)
  );
}

/** The stored file as a web stream, or null when no upload has that name. */
export async function readUpload(name) {
  const b = await bucket();
  const [file] = await b.find({ filename: name }).sort({ uploadDate: -1 }).limit(1).toArray();
  if (!file) return null;
  return {
    body: Readable.toWeb(b.openDownloadStream(file._id)),
    length: file.length,
    contentType: file.metadata?.contentType ?? typeFor(name) ?? "application/octet-stream",
  };
}
