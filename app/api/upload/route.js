import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";

/*
 * Product image upload. Files land in public/uploads and the product stores the
 * public path, so nothing else in the app needs to know where they live.
 *
 * ponytail: local disk. Swap the writeFile for an S3/Cloudinary put when the app
 * runs on more than one machine — the response shape stays the same.
 */
const MAX_BYTES = 6 * 1024 * 1024;
const TYPES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif" };

export async function POST(request) {
  const user = await currentUser();
  if (!can(user, "products:write")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((f) => typeof f === "object" && f.size > 0);
  if (!files.length) return NextResponse.json({ error: "No files received." }, { status: 400 });
  if (files.length > 8) return NextResponse.json({ error: "Up to 8 images at a time." }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });

  const urls = [];
  for (const file of files) {
    const ext = TYPES[file.type];
    if (!ext) return NextResponse.json({ error: `${file.name}: only JPEG, PNG, WebP or AVIF.` }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: `${file.name} is over 6 MB.` }, { status: 400 });

    // Random name: the original could be anything, including a path traversal.
    const name = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    urls.push(`/uploads/${name}`);
  }

  return NextResponse.json({ urls });
}
