import "server-only";
import { headers } from "next/headers";

const LIVE = "https://siyanamodesty.com";

/*
 * The shop's public address, for links in emails. Production uses SITE_URL (or the live
 * domain) and never the request's Host header: a visitor can forge that header, which
 * would put their own domain into someone's password-reset link.
 */
export async function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.NODE_ENV !== "production") {
    const h = await headers();
    return `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  }
  return LIVE;
}

/** Images in emails are fetched by the mail client, so they always come from the live site. */
export const publicAsset = (path) => `${process.env.SITE_URL?.replace(/\/$/, "") || LIVE}${path}`;
