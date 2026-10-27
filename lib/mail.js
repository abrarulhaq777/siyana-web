import "server-only";
import nodemailer from "nodemailer";

/*
 * Outgoing mail through the store's Gmail account. Gmail needs an app password
 * (Google Account → Security → App passwords), never the account password.
 * MAIL_USER / MAIL_APP_PASSWORD / MAIL_TO live in the environment: .env locally,
 * the host's environment variables in production.
 */
let transporter;

function transport() {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_APP_PASSWORD?.replace(/\s/g, ""); // Google shows it in groups of four
  if (!user || !pass) throw new Error("Email is not configured: set MAIL_USER and MAIL_APP_PASSWORD.");
  transporter ??= nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  return transporter;
}

/** Sends to the store inbox. `replyTo` lets the owner answer the customer straight from Gmail. */
export async function sendToStore({ subject, text, html, replyTo }) {
  const from = process.env.MAIL_USER;
  await transport().sendMail({
    from: `"Siyana Daily Modesty website" <${from}>`,
    to: process.env.MAIL_TO || from,
    replyTo,
    subject,
    text,
    html,
  });
}

/** Checks the login without sending anything. */
export const verifyMail = () => transport().verify();
