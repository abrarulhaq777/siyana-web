import { readFile } from "node:fs/promises";
import path from "node:path";
import { readUpload, typeFor } from "@/lib/uploads";

// Upload names are random and never reused, so a fetched image can be cached for good.
const CACHE = "public, max-age=31536000, immutable";

export async function GET(_request, { params }) {
  const { name } = await params;
  const type = /^[\w-]+\.\w+$/.test(name) && typeFor(name);
  if (!type) return new Response("Not found", { status: 404 });

  const file = await readUpload(name);
  if (file) {
    return new Response(file.body, {
      headers: { "Content-Type": file.contentType, "Content-Length": String(file.length), "Cache-Control": CACHE },
    });
  }

  // Files written to public/uploads before uploads moved into the database.
  try {
    const buf = await readFile(path.join(process.cwd(), "public", "uploads", name));
    return new Response(buf, { headers: { "Content-Type": type, "Cache-Control": CACHE } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
