import mongoose from "mongoose";

// Mongoose is CommonJS — destructure the default so plain Node ESM (the seed
// script) resolves it the same way the Next bundler does.
const { Schema, model, models } = mongoose;

const opts = { timestamps: true };

/* ─────────────────────────────────────────────────────────────── people */

const AddressSchema = new Schema(
  {
    label: String,
    name: String,
    phone: String,
    line1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true, match: /^\d{6}$/ },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, match: /^$|^\d{10}$/ },
    role: { type: String, enum: ["customer", "staff", "admin"], default: "customer", index: true },
    permissions: { type: [String], default: [] },
    status: { type: String, enum: ["active", "disabled"], default: "active", index: true },
    addresses: [AddressSchema],
    lastLoginAt: Date,
  },
  opts
);

// Only staff carry granular permissions; customers and admins never do.
UserSchema.pre("save", function () {
  if (this.role !== "staff") this.permissions = [];
});

const SessionSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  expiresAt: { type: Date, required: true },
  userAgent: String,
  createdAt: { type: Date, default: Date.now },
});
// Mongo evicts the row itself once it expires — no cleanup job to forget.
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/* ──────────────────────────────────────────────────────────── catalogue */

const CategorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    blurb: String,
    image: String,
    tone: String,
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  opts
);

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true }, // category slug
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0, default: null },
    color: String,
    colorName: String,
    fabric: String,
    tag: String,
    image: String,
    images: { type: [String], default: [] }, // gallery; image is the cover
    opacity: String,
    wuduFriendly: { type: Boolean, default: false },
    silhouette: String,
    story: String,
    details: { type: [String], default: [] },
    stock: {
      type: [{ size: String, qty: { type: Number, default: 0, min: 0 } }],
      default: [],
    },
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },      // rolled up from approved reviews
    reviewCount: { type: Number, default: 0 },
  },
  opts
);

ProductSchema.virtual("inStock").get(function () {
  return this.stock.some((s) => s.qty > 0);
});

/* ─────────────────────────────────────────────────────────────── orders */

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    slug: String,
    name: String,
    image: String,
    size: String,
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }, // price at the time of sale
  },
  { _id: false }
);

const RefundSchema = new Schema(
  {
    amount: { type: Number, required: true, min: 1 },
    reference: String,
    note: String,
    by: { type: Schema.Types.ObjectId, ref: "User" },
    at: { type: Date, default: Date.now },
  },
  { _id: true }
);

export const ORDER_STATUSES = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];
export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded", "partially_refunded"];

const OrderSchema = new Schema(
  {
    orderNo: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      phone: { type: String, required: true },
    },
    items: { type: [OrderItemSchema], required: true, validate: (v) => v.length > 0 },
    amounts: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    address: { type: AddressSchema, required: true },
    coupon: {
      code: { type: String, uppercase: true, index: true },
      discount: Number,
    },
    status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },
    payment: {
      method: { type: String, enum: ["upi", "card", "netbanking", "wallet", "cod"], required: true },
      status: { type: String, enum: PAYMENT_STATUSES, default: "pending", index: true },
      razorpayOrderId: { type: String, index: true },
      razorpayPaymentId: String,
      paidAt: Date,
      refunds: [RefundSchema],
    },
    timeline: [
      {
        at: { type: Date, default: Date.now },
        label: String,
        note: String,
        by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    note: String,
  },
  opts
);

OrderSchema.virtual("refunded").get(function () {
  return (this.payment?.refunds ?? []).reduce((s, r) => s + r.amount, 0);
});

/* ─────────────────────────────────────────────────────────────── coupons */

export const COUPON_SCOPES = ["all", "collections", "products"];

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: String,
    type: { type: String, enum: ["percent", "fixed"], default: "percent" },
    value: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, default: null },   // caps a percentage coupon
    minOrder: { type: Number, default: 0 },

    // What the discount may be applied to. "all" ignores both id lists.
    scope: { type: String, enum: COUPON_SCOPES, default: "all" },
    collections: { type: [String], default: [] },   // category slugs
    products: { type: [String], default: [] },      // product slugs

    validFrom: { type: Date, default: Date.now },
    validTo: { type: Date, default: null },         // null = no end date

    maxUses: { type: Number, default: null },       // across all customers
    maxUsesPerCustomer: { type: Number, default: 1 },
    repeatUse: { type: Boolean, default: false },   // true ignores the per-customer cap
    firstOrderOnly: { type: Boolean, default: false },

    uses: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  opts
);

/* ─────────────────────────────────────────────────────────────── reviews */

const ReviewSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    productSlug: { type: String, required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 120 },
    body: { type: String, required: true, maxlength: 2000 },
    size: String,
    verified: { type: Boolean, default: false },   // set when the buyer owns an order
    status: { type: String, enum: ["pending", "published", "rejected"], default: "pending", index: true },
    reply: { body: String, at: Date, by: { type: Schema.Types.ObjectId, ref: "User" } },
  },
  opts
);

// One review per person per product.
ReviewSchema.index({ productSlug: 1, user: 1 }, { unique: true, sparse: true });

/* ───────────────────────────────────────────────────── content & audit */

// One document per home-page section, plus a "settings" key. Shape lives in lib/content.js.
const ContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, default: {} },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  opts
);

const AuditSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", index: true },
  userName: String,
  action: { type: String, required: true },
  entity: String,
  entityId: String,
  meta: Schema.Types.Mixed,
  at: { type: Date, default: Date.now, index: true },
});

/* `models.X ??` keeps hot reload from redefining a compiled model. */
export const User = models.User || model("User", UserSchema);
export const Session = models.Session || model("Session", SessionSchema);
export const Category = models.Category || model("Category", CategorySchema);
export const Product = models.Product || model("Product", ProductSchema);
export const Order = models.Order || model("Order", OrderSchema);
export const Coupon = models.Coupon || model("Coupon", CouponSchema);
export const Review = models.Review || model("Review", ReviewSchema);
export const Content = models.Content || model("Content", ContentSchema);
export const Audit = models.Audit || model("Audit", AuditSchema);

export { mongoose };
