import "server-only";
import crypto from "node:crypto";
import db from "./db.js";
import { User, Session } from "./models.js";
import { hashPassword } from "./auth.js";
import { getKey } from "./content.js";
import { sendToCustomer } from "./mail.js";
import { emailLayout, heading, para, button, esc } from "./email-layout.js";

const TTL = 60 * 60 * 1000; // a reset link works for one hour
const RESEND_AFTER = 2 * 60 * 1000; // and a new one can be requested every two minutes
const digest = (token) => crypto.createHash("sha256").update(token).digest("hex");

/**
 * Emails a one-time reset link if the address belongs to an active account. Callers
 * show the same message either way, so the form can't be used to find out who has one.
 */
export async function emailResetLink(email, base) {
  await db();
  const user = await User.findOne({ email: String(email).toLowerCase().trim(), status: "active" }).select("+resetTokenExpires");
  if (!user) return;
  if (user.resetTokenExpires && user.resetTokenExpires.getTime() - TTL > Date.now() - RESEND_AFTER) return;

  const token = crypto.randomBytes(32).toString("base64url");
  user.resetTokenHash = digest(token);
  user.resetTokenExpires = new Date(Date.now() + TTL);
  await user.save();

  const link = `${base}/reset-password?token=${token}`;
  const settings = await getKey("settings");
  await sendToCustomer({
    to: user.email,
    subject: "Reset your Siyana password",
    html: emailLayout({
      preheader: "Your password reset link — valid for one hour",
      settings,
      body: `
        ${heading(`Reset your password`)}
        ${para(`Hello ${esc(user.name.split(" ")[0])}, we received a request to reset the password for your Siyana Daily Modesty account.`)}
        ${button(link, "Choose a new password")}
        ${para("This link works once and expires in one hour.")}
        ${para("If you didn't ask to reset your password, you can ignore this email — your password won't change.")}`,
    }),
    text: `Reset your Siyana password: ${link}\n\nThis link works once and expires in one hour. If you didn't ask for it, ignore this email.`,
  });
}

/** True while a reset link can still be used — lets the page say so before the shopper types. */
export async function resetLinkIsValid(token) {
  if (!token) return false;
  await db();
  return !!(await User.exists({ resetTokenHash: digest(token), resetTokenExpires: { $gt: new Date() } }));
}

/** Sets the new password, burns the link and signs the account out everywhere. Returns the role. */
export async function resetPassword(token, password) {
  await db();
  const user = await User.findOne({ resetTokenHash: digest(String(token)), resetTokenExpires: { $gt: new Date() } }).select(
    "+resetTokenHash +resetTokenExpires"
  );
  if (!user) throw new Error("This reset link is invalid or has expired. Please request a new one.");

  user.passwordHash = await hashPassword(password);
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  await Session.deleteMany({ user: user._id });
  return user.role;
}
