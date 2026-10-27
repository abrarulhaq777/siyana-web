import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";

/*
 * Outgoing mail through the store's Gmail account. Gmail needs an app password
 * (Google Account → Security → App passwords), never the account password.
 * MAIL_USER / MAIL_APP_PASSWORD / MAIL_TO live in the environment: .env locally,
 * the host's environment variables in production.
 *
 * MAIL_CAPTURE_DIR, for testing only, writes each email to that folder as an .html file
 * instead of sending it, so every email can be previewed without a real inbox. Never set
 * it on the live server — mail would quietly stop going out.
 */
let transporter;

function transport() {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_APP_PASSWORD?.replace(/\s/g, ""); // Google shows it in groups of four
  if (!user || !pass) throw new Error("Email is not configured: set MAIL_USER and MAIL_APP_PASSWORD.");
  transporter ??= nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  return transporter;
}

async function deliver(message) {
  const dir = process.env.MAIL_CAPTURE_DIR;
  if (dir) {
    await mkdir(dir, { recursive: true });
    const name = `${Date.now()}-${message.subject.replace(/[^\w]+/g, "-").slice(0, 60)}.html`;
    const head = `<!-- to: ${message.to} | reply-to: ${message.replyTo ?? ""} | subject: ${message.subject} -->\n`;
    await writeFile(path.join(dir, name), head + message.html);
    return;
  }
  await transport().sendMail(message);
}

const storeInbox = () => process.env.MAIL_TO || process.env.MAIL_USER;

/** Sends to the store inbox. `replyTo` lets the owner answer the customer straight from Gmail. */
export async function sendToStore({ subject, text, html, replyTo }) {
  await deliver({
    from: `"Siyana Daily Modesty website" <${process.env.MAIL_USER}>`,
    to: storeInbox(),
    replyTo,
    subject,
    text,
    html,
  });
}

/** Sends to a customer. Their replies go to the store inbox. */
export async function sendToCustomer({ to, subject, text, html }) {
  await deliver({
    from: `"Siyana Daily Modesty" <${process.env.MAIL_USER}>`,
    to,
    replyTo: storeInbox(),
    subject,
    text,
    html,
  });
}

/** Checks the login without sending anything. */
export const verifyMail = () => transport().verify();
