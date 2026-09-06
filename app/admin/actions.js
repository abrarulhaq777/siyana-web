"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { User, Product, Category, Order } from "@/lib/models";
import { login, destroySession, requirePermission, hashPassword, log } from "@/lib/auth";
import { ALL } from "@/lib/permissions";
import { setKey } from "@/lib/content";
import { razorpay } from "@/lib/razorpay";
import { isStaff } from "@/lib/permissions";
import { currentUser } from "@/lib/auth";

const ok = (message) => ({ ok: true, message });
const fail = (error) => ({ ok: false, error });

/* ─────────────────────────────────────────────────────────────── session */

export async function adminSignIn(_prev, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (!email || !password) return fail("Enter your email and password.");

  let user;
  try {
    user = await login(email, password, "admin");
  } catch (e) {
    return fail(e.message);
  }
  if (!isStaff(user)) {
    await destroySession();
    return fail("This account does not have admin access.");
  }
  redirect("/admin");
}

export async function adminSignOut() {
  await destroySession();
  redirect("/admin/login");
}

/* ──────────────────────────────────────────────────────────────── orders */

export async function setOrderStatus(_prev, formData) {
  const user = await requirePermission("orders:write");
  const id = formData.get("id");
  const status = formData.get("status");
  const note = formData.get("note")?.trim();

  await db();
  const order = await Order.findById(id);
  if (!order) return fail("Order not found.");
  if (order.status === status && !note) return fail("Nothing changed.");

  order.status = status;
  order.timeline.push({ label: `Status → ${status}`, note, by: user._id });

  // Cash on delivery settles when the parcel lands.
  if (status === "delivered" && order.payment.method === "cod" && order.payment.status === "pending") {
    order.payment.status = "paid";
    order.payment.paidAt = new Date();
  }
  await order.save();

  await log(user, "order.status", { entity: "Order", entityId: id, meta: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return ok(`Order marked ${status}.`);
}

export async function markOrderPaid(_prev, formData) {
  const user = await requirePermission("payments:refund");
  const id = formData.get("id");
  await db();
  const order = await Order.findById(id);
  if (!order) return fail("Order not found.");
  if (order.payment.status === "paid") return fail("Already marked paid.");

  order.payment.status = "paid";
  order.payment.paidAt = new Date();
  order.timeline.push({ label: "Payment marked paid manually", by: user._id });
  await order.save();

  await log(user, "payment.manual_paid", { entity: "Order", entityId: id });
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/payments");
  return ok("Payment recorded.");
}

export async function refundOrder(_prev, formData) {
  const user = await requirePermission("payments:refund");
  const id = formData.get("id");
  const amount = Number(formData.get("amount"));
  const note = formData.get("note")?.trim();

  await db();
  const order = await Order.findById(id);
  if (!order) return fail("Order not found.");
  if (order.payment.status !== "paid" && order.payment.status !== "partially_refunded")
    return fail("Only a paid order can be refunded.");

  const already = order.payment.refunds.reduce((s, r) => s + r.amount, 0);
  const remaining = order.amounts.total - already;
  if (!(amount > 0) || amount > remaining) return fail(`Enter an amount between ₹1 and ₹${remaining}.`);

  let reference = "manual";
  if (razorpay && order.payment.razorpayPaymentId) {
    try {
      const r = await razorpay.payments.refund(order.payment.razorpayPaymentId, {
        amount: Math.round(amount * 100),
      });
      reference = r.id;
    } catch (e) {
      return fail(`Razorpay refused the refund: ${e?.error?.description ?? e.message}`);
    }
  }

  order.payment.refunds.push({ amount, reference, note, by: user._id });
  const total = already + amount;
  order.payment.status = total >= order.amounts.total ? "refunded" : "partially_refunded";
  order.timeline.push({ label: `Refunded ₹${amount}`, note, by: user._id });
  await order.save();

  await log(user, "payment.refund", { entity: "Order", entityId: id, meta: { amount, reference } });
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/payments");
  return ok(`₹${amount} refunded.`);
}

/* ────────────────────────────────────────────────────────────── products */

const num = (v, d = 0) => (v === "" || v == null ? d : Number(v));

export async function saveProduct(_prev, formData) {
  const user = await requirePermission("products:write");
  const id = formData.get("id");

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (!/^[a-z0-9-]{3,}$/.test(slug)) return fail("Slug must be lowercase letters, numbers and hyphens.");

  const price = num(formData.get("price"));
  const mrp = formData.get("mrp") ? num(formData.get("mrp")) : null;
  if (!(price > 0)) return fail("Price must be greater than zero.");
  if (mrp !== null && mrp < price) return fail("MRP cannot be lower than the selling price.");

  const doc = {
    slug,
    name: String(formData.get("name") ?? "").trim(),
    category: formData.get("category"),
    price,
    mrp,
    color: formData.get("color"),
    colorName: formData.get("colorName"),
    fabric: formData.get("fabric"),
    tag: formData.get("tag") || null,
    image: formData.get("image"),
    opacity: formData.get("opacity"),
    silhouette: formData.get("silhouette"),
    story: formData.get("story"),
    wuduFriendly: formData.get("wuduFriendly") === "on",
    active: formData.get("active") === "on",
    details: String(formData.get("details") ?? "").split("\n").map((s) => s.trim()).filter(Boolean),
    stock: formData.getAll("stockSize").map((size, i) => ({
      size,
      qty: Math.max(0, num(formData.getAll("stockQty")[i])),
    })),
  };
  if (!doc.name) return fail("Name is required.");

  await db();
  const clash = await Product.findOne({ slug, _id: { $ne: id || null } }).lean();
  if (clash) return fail("Another product already uses that slug.");

  if (id) {
    await Product.findByIdAndUpdate(id, doc, { runValidators: true });
  } else {
    await Product.create(doc);
  }

  await log(user, id ? "product.update" : "product.create", { entity: "Product", entityId: id ?? slug });
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath(`/product/${slug}`);
  return ok("Product saved.");
}

export async function toggleProduct(_prev, formData) {
  const user = await requirePermission("products:write");
  const id = formData.get("id");
  await db();
  const p = await Product.findById(id);
  if (!p) return fail("Product not found.");
  p.active = !p.active;
  await p.save();

  await log(user, "product.toggle", { entity: "Product", entityId: id, meta: { active: p.active } });
  revalidatePath("/admin/products");
  revalidatePath("/");
  return ok(p.active ? "Product is live." : "Product hidden from the storefront.");
}

export async function saveCategory(_prev, formData) {
  const user = await requirePermission("products:write");
  const id = formData.get("id");
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (!/^[a-z0-9-]{2,}$/.test(slug)) return fail("Slug must be lowercase letters, numbers and hyphens.");

  const doc = {
    slug,
    name: String(formData.get("name") ?? "").trim(),
    blurb: formData.get("blurb"),
    image: formData.get("image"),
    tone: formData.get("tone"),
    order: num(formData.get("order")),
    active: formData.get("active") === "on",
  };
  if (!doc.name) return fail("Name is required.");

  await db();
  if (id) await Category.findByIdAndUpdate(id, doc, { runValidators: true });
  else await Category.create(doc);

  await log(user, id ? "category.update" : "category.create", { entity: "Category", entityId: id ?? slug });
  revalidatePath("/admin/products");
  revalidatePath("/");
  return ok("Collection saved.");
}

/* ───────────────────────────────────────────────────────────── customers */

export async function setUserStatus(_prev, formData) {
  const target = formData.get("id");
  const status = formData.get("status");
  const staffAction = formData.get("scope") === "staff";
  const user = await requirePermission(staffAction ? "staff:write" : "customers:write");

  if (String(target) === String(user._id)) return fail("You cannot disable your own account.");

  await db();
  const found = await User.findById(target);
  if (!found) return fail("Account not found.");
  if (found.role === "admin" && user.role !== "admin") return fail("Only an admin can change an admin account.");

  found.status = status;
  await found.save();

  await log(user, "user.status", { entity: "User", entityId: target, meta: { status } });
  revalidatePath("/admin/customers");
  revalidatePath("/admin/staff");
  return ok(`Account ${status === "active" ? "re-enabled" : "disabled"}.`);
}

/* ───────────────────────────────────────────────────────────────── staff */

export async function saveStaff(_prev, formData) {
  const user = await requirePermission("staff:write");
  const id = formData.get("id");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const role = formData.get("role") === "admin" ? "admin" : "staff";
  const password = formData.get("password");

  if (!name) return fail("Name is required.");
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Enter a valid email address.");

  // Only an admin may mint another admin — staff cannot escalate.
  if (role === "admin" && user.role !== "admin") return fail("Only an admin can grant admin access.");

  const permissions = role === "staff" ? formData.getAll("permissions").filter((p) => ALL.includes(p)) : [];

  await db();
  const clash = await User.findOne({ email, _id: { $ne: id || null } }).lean();
  if (clash) return fail("That email is already registered.");

  if (id) {
    const target = await User.findById(id);
    if (!target) return fail("Account not found.");
    if (target.role === "admin" && user.role !== "admin") return fail("Only an admin can edit an admin.");
    if (String(target._id) === String(user._id) && role !== target.role)
      return fail("You cannot change your own role.");

    Object.assign(target, { name, email, role, permissions });
    if (password) {
      if (String(password).length < 8) return fail("Password must be at least 8 characters.");
      target.passwordHash = await hashPassword(password);
    }
    await target.save();
  } else {
    if (String(password ?? "").length < 8) return fail("Set a password of at least 8 characters.");
    await User.create({ name, email, role, permissions, passwordHash: await hashPassword(password) });
  }

  await log(user, id ? "staff.update" : "staff.create", { entity: "User", entityId: id ?? email, meta: { role, permissions } });
  revalidatePath("/admin/staff");
  return ok("Team member saved.");
}

/* ─────────────────────────────────────────────────────────────── content */

export async function saveContent(_prev, formData) {
  const user = await requirePermission("content:write");
  const key = formData.get("__key");
  const payload = formData.get("__json");

  let data;
  try {
    data = JSON.parse(payload);
  } catch {
    return fail("Could not read the form. Reload and try again.");
  }

  await setKey(key, data, user._id);
  await log(user, "content.update", { entity: "Content", entityId: key });

  revalidatePath("/");
  revalidatePath("/admin/content");
  return ok("Storefront updated.");
}

/* ───────────────────────────────────────────────────── account (own) */

export async function changeOwnPassword(_prev, formData) {
  const user = await currentUser();
  if (!user) return fail("Sign in again.");

  const next = String(formData.get("password") ?? "");
  if (next.length < 8) return fail("Password must be at least 8 characters.");

  await db();
  await User.findByIdAndUpdate(user._id, { passwordHash: await hashPassword(next) });
  await log(user, "account.password");
  return ok("Password changed.");
}
