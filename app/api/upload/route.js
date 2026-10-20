import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { saveUpload, TYPES } from "@/lib/uploads";

/*
 * Product image upload. Files are stored in MongoDB (see lib/uploads.js) and served
 * from /uploads/<name>, which is the path the product stores.
 */
const MAX_BYTES = 6 * 1024 * 1024;

export async function POST(request) {
  const user = await currentUser();
  if (!can(user, "products:write") && !can(user, "content:write")) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((f) => typeof f === "object" && f.size > 0);
  if (!files.length) return NextResponse.json({ error: "No files received." }, { status: 400 });
  if (files.length > 8) return NextResponse.json({ error: "Up to 8 images at a time." }, { status: 400 });

  const urls = [];
  for (const file of files) {
    const ext = TYPES[file.type];
    if (!ext) return NextResponse.json({ error: `${file.name}: only JPEG, PNG, WebP or AVIF.` }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: `${file.name} is over 6 MB.` }, { status: 400 });

    // Random name: the original could be anything, including a path traversal.
    const name = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    await saveUpload(name, Buffer.from(await file.arrayBuffer()), file.type);
    urls.push(`/uploads/${name}`);
  }

  return NextResponse.json({ urls });
}
