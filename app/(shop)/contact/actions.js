"use server";

import { sendToStore } from "@/lib/mail";

const TOPICS = {
  sizing: "Sizing help",
  product: "Product & fabric questions",
  order: "Order & delivery",
  issue: "Damaged or incorrect item",
  other: "Something else",
};

const fail = (error, values) => ({ ok: false, error, values });

const escape = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Contact form → email to the store inbox, with the customer as reply-to. */
export async function sendInquiry(_prev, formData) {
  const field = (k, max) => String(formData.get(k) ?? "").trim().slice(0, max);
  const values = {
    name: field("name", 120),
    email: field("email", 200).toLowerCase(),
    topic: field("topic", 20),
    order: field("order", 60),
    message: field("message", 5000),
  };

  // Hidden field people never see; bots fill every input. Pretend it worked.
  if (field("website", 200)) return { ok: true };

  if (!values.name) return fail("Please tell us your name.", values);
  if (!/^\S+@\S+\.\S+$/.test(values.email)) return fail("Enter a valid email address so we can reply.", values);
  if (values.message.length < 5) return fail("Please write a short message.", values);

  const topic = TOPICS[values.topic] ?? TOPICS.other;
  const rows = [
    ["Name", values.name],
    ["Email", values.email],
    ["Topic", topic],
    ["Order number", values.order || "—"],
  ];

  try {
    await sendToStore({
      subject: `Website enquiry: ${topic} — ${values.name}`,
      replyTo: `"${values.name.replace(/"/g, "")}" <${values.email}>`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${values.message}`,
      html: `
        <div style="font-family:Georgia,serif;color:#141311;max-width:560px">
          <h2 style="font-weight:normal;margin:0 0 16px">New enquiry from the website</h2>
          <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
            ${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#675f52">${k}</td><td style="padding:4px 0">${escape(v)}</td></tr>`).join("")}
          </table>
          <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap;border-top:1px solid #e3dcd1;margin-top:16px;padding-top:16px">${escape(values.message)}</p>
          <p style="font-family:Arial,sans-serif;font-size:12px;color:#675f52">Reply to this email to answer ${escape(values.name)} directly.</p>
        </div>`,
    });
  } catch (e) {
    console.error("Contact form email failed:", e);
    return fail("Sorry, we couldn't send your message just now. Please try again, or message us on Instagram.", values);
  }

  return { ok: true };
}
