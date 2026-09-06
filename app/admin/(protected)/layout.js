import { requireStaff } from "@/lib/auth";
import { ALL, can } from "@/lib/permissions";
import Nav from "../_components/Nav";

export const metadata = { title: "Siyana Admin" };
// Admin data is per-request and permission-scoped; nothing here is cacheable.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const user = await requireStaff();
  const allowed = ALL.filter((p) => can(user, p));

  return (
    <div className="min-h-screen bg-bone">
      <Nav user={user} allowed={allowed} />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-[1200px] px-6 py-8 pt-20 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
