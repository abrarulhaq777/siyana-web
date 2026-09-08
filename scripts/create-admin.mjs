/*
 * Create or update an admin user in the database.
 *
 * Usage:
 *   node scripts/create-admin.mjs
 *   node scripts/create-admin.mjs <email> <password> [name]
 */
import fs from "node:fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Load environment variables from .env.local or .env
if (fs.existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
} else if (fs.existsSync(".env")) {
  process.loadEnvFile(".env");
}

const args = process.argv.slice(2);
const email = (args[0] || process.env.ADMIN_EMAIL || "admin@siyana.com").toLowerCase().trim();
const password = args[1] || process.env.ADMIN_PASSWORD || "Admin@Siyana2026!";
const name = args[2] || process.env.ADMIN_NAME || "Admin";

const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/siyana";

async function main() {
  console.log(`Connecting to database...`);
  await mongoose.connect(URI);

  const { User } = await import("../lib/models.js");

  const passwordHash = await bcrypt.hash(password, 12);

  let user = await User.findOne({ email }).select("+passwordHash");

  if (user) {
    user.name = name;
    user.passwordHash = passwordHash;
    user.role = "admin";
    user.status = "active";
    user.permissions = [];
    await user.save();
    console.log(`\n✔ Admin account updated successfully!`);
  } else {
    user = await User.create({
      name,
      email,
      passwordHash,
      role: "admin",
      status: "active",
      permissions: [],
    });
    console.log(`\n✔ Admin account created successfully!`);
  }

  console.log(`-------------------------------------------`);
  console.log(`Email / Username : ${email}`);
  console.log(`Password         : ${password}`);
  console.log(`Role             : admin`);
  console.log(`Status           : active`);
  console.log(`-------------------------------------------`);
  console.log(`You can now sign in at /admin/login\n`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error creating admin account:", err);
  process.exit(1);
});
