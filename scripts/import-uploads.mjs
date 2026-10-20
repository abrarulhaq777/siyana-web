/*
 * Copies a folder of previously uploaded images into MongoDB, so the existing
 * /uploads/<name> links in products, categories and the hero work again.
 * Files already in the database are skipped — safe to re-run.
 *
 *   node --env-file=.env scripts/import-uploads.mjs ~/Downloads/uploads
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) {
  console.error("Usage: node --env-file=.env scripts/import-uploads.mjs <folder with the image files>");
  process.exit(1);
}

const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/siyana";
const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };

await mongoose.connect(URI);
const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

let added = 0, skipped = 0;
for (const name of fs.readdirSync(dir)) {
  const contentType = TYPES[path.extname(name).toLowerCase()];
  if (!contentType) continue;
  if (await bucket.find({ filename: name }).limit(1).hasNext()) {
    skipped++;
    continue;
  }
  await new Promise((resolve, reject) =>
    fs.createReadStream(path.join(dir, name))
      .pipe(bucket.openUploadStream(name, { metadata: { contentType } }))
      .on("finish", resolve)
      .on("error", reject)
  );
  added++;
  console.log("added", name);
}

console.log(`Done: ${added} added, ${skipped} already there.`);
await mongoose.disconnect();
