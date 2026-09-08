"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { User } from "@/lib/models";
import { login, destroySession, createSession, hashPassword, currentUser } from "@/lib/auth";

const fail = (error) => ({ ok: false, error });

export async function signIn(_prev, formData) {
  const next = formData.get("next") || "/account";
  try {
    await login(formData.get("email"), formData.get("password"), "storefront");
  } catch (e) {
    return fail(e.message);
  }
  redirect(next);
}

export async function signUp(_prev, formData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = formData.get("next") || "/account";

  if (!name) return fail("Please tell us your name.");
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Enter a valid email address.");
  if (password.length < 8) return fail("Choose a password of at least 8 characters.");

  await db();
  if (await User.findOne({ email }).lean()) return fail("That email already has an account. Sign in instead.");

  // Always role "customer" — staff accounts are only ever created from the admin.
  const user = await User.create({ name, email, passwordHash: await hashPassword(password), role: "customer" });
  await createSession(user._id, "storefront");
  redirect(next);
}

export async function signOut() {
  await destroySession();
  redirect("/signout");
}

export async function saveAddress(_prev, formData) {
  const user = await currentUser();
  if (!user) return fail("Sign in to save an address.");

  const address = {
    line1: String(formData.get("line1") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim(),
    pincode: String(formData.get("pincode") ?? "").trim(),
    isDefault: true,
  };
  if (!address.line1 || !address.city || !address.state) return fail("Complete every field.");
  if (!/^\d{6}$/.test(address.pincode)) return fail("Enter a 6-digit pincode.");

  await db();
  await User.findByIdAndUpdate(user._id, {
    $set: { "addresses.$[].isDefault": false, phone: String(formData.get("phone") ?? "").trim() },
  });
  await User.findByIdAndUpdate(user._id, { $push: { addresses: address } });

  revalidatePath("/account");
  return { ok: true, message: "Address saved." };
}
