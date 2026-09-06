/*
 * One flat permission list. `admin` implicitly holds every permission;
 * `staff` hold exactly what the admin grants them.
 */
export const PERMISSIONS = {
  "orders:read": "View orders",
  "orders:write": "Change order status, add notes, cancel",
  "payments:read": "View payments and settlements",
  "payments:refund": "Issue refunds",
  "products:read": "View products and stock",
  "products:write": "Create, edit and archive products",
  "customers:read": "View customer accounts",
  "customers:write": "Edit or disable customer accounts",
  "content:read": "View storefront content",
  "content:write": "Edit the home page, banners and settings",
  "staff:read": "View staff accounts",
  "staff:write": "Create staff and change their permissions",
};

export const GROUPS = [
  ["Orders & Payments", ["orders:read", "orders:write", "payments:read", "payments:refund"]],
  ["Catalogue", ["products:read", "products:write"]],
  ["Customers", ["customers:read", "customers:write"]],
  ["Storefront", ["content:read", "content:write"]],
  ["Team", ["staff:read", "staff:write"]],
];

export const ALL = Object.keys(PERMISSIONS);

/** Presets so an admin doesn't have to tick twelve boxes for a common role. */
export const PRESETS = {
  "Order desk": ["orders:read", "orders:write", "payments:read", "customers:read"],
  "Catalogue manager": ["products:read", "products:write", "content:read", "content:write"],
  "Support": ["orders:read", "customers:read", "customers:write", "payments:read"],
  "Read only": ALL.filter((p) => p.endsWith(":read")),
};

export function can(user, permission) {
  if (!user || user.status !== "active") return false;
  if (user.role === "admin") return true;
  return user.role === "staff" && user.permissions?.includes(permission);
}

/** True for anyone who may open /admin at all. */
export const isStaff = (user) =>
  !!user && user.status === "active" && (user.role === "admin" || user.role === "staff");
