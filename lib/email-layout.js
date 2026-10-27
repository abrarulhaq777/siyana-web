import "server-only";
import { publicAsset } from "./site.js";

/*
 * The frame every customer email shares. Email clients ignore stylesheets and most
 * modern CSS, so this is tables and inline styles — deliberately old-fashioned.
 */
export const C = { ink: "#141311", muted: "#675f52", line: "#e3dcd1", gold: "#8c6e33", bone: "#f6f3ec", paper: "#fbf9f5" };
const SANS = "Arial,Helvetica,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const rupees = (n) => "₹" + Number(n ?? 0).toLocaleString("en-IN");

export const heading = (text) =>
  `<h1 style="margin:0 0 12px;font-family:${SERIF};font-weight:normal;font-size:26px;line-height:1.25;color:${C.ink}">${esc(text)}</h1>`;

export const para = (html) =>
  `<p style="margin:0 0 16px;font-family:${SANS};font-size:14px;line-height:1.7;color:${C.muted}">${html}</p>`;

export const button = (href, label) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px"><tr>
    <td style="background:${C.ink}">
      <a href="${esc(href)}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.bone};text-decoration:none">${esc(label)}</a>
    </td>
  </tr></table>`;

export const label = (text) =>
  `<p style="margin:0 0 6px;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.gold}">${esc(text)}</p>`;

export function emailLayout({ body, settings = {} }) {
  const contact = [settings.supportEmail, settings.supportPhone].filter((x) => x && !/0{5}|example/.test(x)).map(esc).join(" · ");
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${C.bone}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bone}">
    <tr><td align="center" style="padding:32px 12px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
        <tr><td align="center" style="padding:0 0 24px">
          <img src="${publicAsset("/siyana-logo-transparent.png")}" width="170" alt="Siyana — The Daily Modesty" style="display:block;border:0;width:170px;height:auto">
        </td></tr>
        <tr><td style="background:${C.paper};border:1px solid ${C.line};border-top:3px solid ${C.gold};padding:36px 32px">
          ${body}
        </td></tr>
        <tr><td align="center" style="padding:24px 12px;font-family:${SANS};font-size:12px;line-height:1.7;color:${C.muted}">
          Questions? Just reply to this email${contact ? `, or reach us at ${contact}` : ""}.<br>
          Instagram <a href="https://www.instagram.com/siyana_dailymodesty/" style="color:${C.gold}">@siyana_dailymodesty</a><br>
          <span style="color:${C.gold}">Siyana Daily Modesty</span> — Minimal. Sophisticated. Effortless.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
