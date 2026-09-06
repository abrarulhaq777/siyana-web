import "server-only";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import db, { plain } from "./db.js";
import { User, Session, Audit } from "./models.js";
import { can, isStaff } from "./permissions.js";

const COOKIE = "siyana_session";
const DAYS = 30;

export const hashPassword = (pw) => bcrypt.hash(pw, 12);
export const verifyPassword = (pw, hash) => bcrypt.compare(pw, hash);

/*
 * Opaque session tokens, hashed at rest. The raw token only ever exists in the
 * user's cookie, so a leaked database dump cannot be replayed as a login.
 */
const digest = (token) => crypto.createHash("sha256").update(token).digest("hex");

export async function createSession(userId, userAgent = "") {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + DAYS * 864e5);

  await Session.create({ tokenHash: digest(token), user: userId, expiresAt, userAgent });

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db().then(() => Session.deleteOne({ tokenHash: digest(token) }));
  jar.delete(COOKIE);
}

/** The signed-in user, or null. Safe to call from any server component. */
export async function currentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  await db();
  const session = await Session.findOne({ tokenHash: digest(token) }).populate("user").lean();
  if (!session?.user) return null;
  if (session.user.status !== "active") return null;

  return plain(session.user);
}

/* ─────────────────────────────────────────────────────────────── guards */

export async function requireUser(next = "/account") {
  const user = await currentUser();
  if (!user) redirect(`/account?next=${encodeURIComponent(next)}`);
  return user;
}

/** Anyone allowed into /admin at all. */
export async function requireStaff() {
  const user = await currentUser();
  if (!isStaff(user)) redirect("/admin/login");
  return user;
}

/**
 * Guard for a specific capability, used by every server action. Throwing is the
 * right answer there — an action must never half-run.
 */
export async function requirePermission(permission) {
  const user = await requireStaff();
  if (!can(user, permission)) {
    throw new Error(`Not permitted: ${permission}`);
  }
  return user;
}

/**
 * Same check for a page render. The nav already hides what you cannot open, so
 * landing here means a typed URL — show a real screen rather than a 500.
 */
export async function requirePageAccess(permission) {
  const user = await requireStaff();
  if (!can(user, permission)) redirect(`/admin/denied?p=${encodeURIComponent(permission)}`);
  return user;
}

export async function log(user, action, { entity, entityId, meta } = {}) {
  await Audit.create({
    user: user?._id,
    userName: user?.name,
    action,
    entity,
    entityId: entityId ? String(entityId) : undefined,
    meta,
  });
}

/** Signs a user in and returns them, or throws with a message safe to show. */
export async function login(email, password, userAgent) {
  await db();
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+passwordHash");

  // Compare regardless of whether the account exists, so timing doesn't leak it.
  const ok = await verifyPassword(password, user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvali");
  if (!user || !ok) throw new Error("Email or password is incorrect.");
  if (user.status !== "active") throw new Error("This account has been disabled.");

  user.lastLoginAt = new Date();
  await user.save();
  await createSession(user._id, userAgent);
  return plain(user.toObject({ transform: (_, r) => { delete r.passwordHash; return r; } }));
}
