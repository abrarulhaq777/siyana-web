import { NextResponse, after } from "next/server";
import { currentUser } from "@/lib/auth";
import { capiEnabled, requestContext, sendEvent, userFromAccount } from "@/lib/meta-capi";

/*
 * The browser's copy of a Pixel event, forwarded to Meta's Conversions API.
 * Purchase isn't accepted here: the server reports it from the order itself.
 * The neutral path keeps ad blockers from dropping it.
 */
const EVENTS = new Set(["ViewContent", "AddToCart", "InitiateCheckout"]);

const text = (v, max = 200) => (typeof v === "string" && v ? v.slice(0, max) : undefined);
const num = (v) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : undefined);

function customData(p = {}) {
  const ids = Array.isArray(p.content_ids) ? p.content_ids.map((id) => text(id, 100)).filter(Boolean).slice(0, 50) : undefined;
  const data = {
    currency: "INR",
    value: num(p.value),
    content_type: "product",
    content_ids: ids?.length ? ids : undefined,
    content_name: text(p.content_name),
    content_category: text(p.content_category),
    num_items: Number.isInteger(p.num_items) ? num(p.num_items) : undefined,
  };
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
}

export async function POST(request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { name, eventId, params } = body ?? {};
  if (!EVENTS.has(name) || typeof eventId !== "string" || !eventId || eventId.length > 100) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (capiEnabled()) {
    after(async () => {
      const ctx = await requestContext();
      const user = await currentUser().catch(() => null);
      await sendEvent({ name, eventId, ctx, user: userFromAccount(user), customData: customData(params) });
    });
  }
  return NextResponse.json({ ok: true });
}
