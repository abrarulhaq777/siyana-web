# Siyana — The Daily Modesty

Modest-wear storefront and admin. Next.js 16 (App Router, JavaScript), Tailwind v4,
MongoDB via Mongoose, Razorpay for payments.

```bash
npm install
cp .env.example .env.local     # then fill in the Razorpay keys
npm run seed                   # catalogue, CMS defaults, owner account
npm run dev                    # storefront at /, admin at /admin
npm run check                  # cart, permission and money-path checks
```

MongoDB must be running. Locally: `mongod --dbpath /usr/local/var/mongodb --fork
--logpath /usr/local/var/log/mongodb/mongo.log`. For production, put an Atlas SRV
string in `MONGODB_URI` — nothing else changes.

`npm run seed` is idempotent. It upserts products and collections, inserts CMS
defaults **only where a key is missing** (so it never overwrites edited copy), and
creates the owner account from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
**Change that password on first sign-in.**

## Layout

| Path | What |
|---|---|
| `app/(shop)/` | Storefront. Its layout owns the header, footer and intro. |
| `app/admin/` | Admin. `login/` is public; everything in `(protected)/` is guarded. |
| `app/api/products` | Slug lookup for the cart and wishlist (client-side). |
| `app/api/razorpay/webhook` | Razorpay's server-to-server confirmation. |
| `lib/models.js` | Every Mongoose schema. |
| `lib/auth.js` | Sessions, password hashing, the permission guards. |
| `lib/permissions.js` | The permission list, presets and `can()`. |
| `lib/orders.js` | Order creation: server-side pricing and stock claiming. |
| `lib/content.js` + `content-defaults.js` | The CMS surface and its defaults. |
| `lib/catalog.js` | Server-side catalogue reads. |

## Admin

`/admin` — dashboard, orders, payments, catalogue, customers, storefront CMS, team.

**Permissions.** An `admin` implicitly holds everything. A `staff` account holds
exactly what is ticked for them under Team, from twelve permissions grouped into
Orders & Payments, Catalogue, Customers, Storefront and Team. Four presets (Order
desk, Catalogue manager, Support, Read only) cover the common shapes.

Enforcement is in three layers, and the last one is the one that counts:

1. The sidebar only lists sections the account can open.
2. Page loads call `requirePageAccess(permission)` and redirect to `/admin/denied`.
3. Every server action calls `requirePermission(permission)` and throws.

So a staff member who types a URL they lack gets a proper "not your desk" screen,
and a hand-crafted POST still fails. Two escalation paths are closed explicitly:
only an admin can create or edit another admin, and nobody can change their own
role or disable their own account. Every mutation is written to an audit log,
shown on the dashboard.

## The CMS

Storefront → the twelve editable keys. Layout stays in code, so an editor fills a
fixed frame and cannot break the design. Editable: hero copy/image/CTAs/spec
strip, announcement ticker, assurances, category heading, the products in each
edit (ordered), the celebration capsule, prayer sanctuary, ethos, gifting,
testimonials, newsletter, and store settings (shipping thresholds, COD, support
details). Section order and visibility are editable too — the fabric guide,
silhouette standard and craft notes keep their copy in code but can still be
reordered or hidden.

Category tiles come from Catalogue → Collections, not the CMS.

## Payments

Razorpay. `placeOrder` creates the order from **server-side prices** and a matching
Razorpay order; the browser opens checkout; `confirmPayment` verifies the HMAC
signature before anything is marked paid. The webhook at
`/api/razorpay/webhook` is the real source of truth — a shopper whose browser dies
mid-payment still gets a confirmed order. Dismissing the modal releases the claimed
stock. Refunds are issued from the order detail screen and go through Razorpay when
a payment id is present, otherwise they are recorded as manual.

Without Razorpay keys the store still works: checkout falls back to cash on
delivery, and the payments screen says so.

## What the browser is not trusted with

The cart holds only slugs, sizes and quantities. Names, prices and availability are
re-read from the database on every mount and **re-read again server-side when the
order is placed** — a bag edited in devtools cannot change what is charged. Stock is
claimed with a conditional `$inc`, so two shoppers racing for the last unit cannot
both win, and a multi-line order that fails partway rolls back what it already took.
`npm run check` proves each of these.

## Still open

- **Product images** are public paths typed into the admin; there is no upload
  pipeline yet (S3/Cloudinary + a signed-upload action would slot into the product form).
- **Email** — no order confirmations are sent. Orders and status changes are recorded,
  nothing is delivered.
- **Storefront rendering** is `force-dynamic`; every page reads Mongo per request.
  If traffic makes that matter, switch to `revalidate` plus the `revalidatePath`
  calls already present in the admin actions.
- **Discounts** are modelled on the order (`amounts.discount`) but there is no coupon UI.
- `/help/*` and `/about` are linked from the footer and do not exist yet.
