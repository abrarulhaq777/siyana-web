import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";

/*
 * Outgoing mail. MAIL_USER is the sending mailbox and MAIL_APP_PASSWORD its password;
 * MAIL_TO is the inbox that receives order alerts and enquiries. With MAIL_HOST unset it sends through Gmail
 * (which needs an app password, never the account password). For good inbox placement,
 * send from the shop's own domain instead — e.g. a Hostinger mailbox:
 *   MAIL_HOST=smtp.hostinger.com  MAIL_PORT=465  MAIL_USER=orders@siyanamodesty.com
 * All of these live in the environment: .env locally, the host's settings in production.
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
  const host = process.env.MAIL_HOST?.trim();
  const port = Number(process.env.MAIL_PORT) || 465;
  transporter ??= nodemailer.createTransport(
    host ? { host, port, secure: port === 465, auth: { user, pass } } : { service: "gmail", auth: { user, pass } }
  );
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

/**
 * Sends to a customer. Replies go back to MAIL_USER, the address customers see —
 * never to MAIL_TO, which may be a private inbox the shop forwards its mail to.
 */
export async function sendToCustomer({ to, subject, text, html }) {
  await deliver({
    from: `"Siyana Daily Modesty" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

/** Checks the login without sending anything. */
export const verifyMail = () => transport().verify();
