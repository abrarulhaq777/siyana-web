import db, { plain } from "@/lib/db";
import { User } from "@/lib/models";
import { requirePageAccess, currentUser } from "@/lib/auth";
import { can, PERMISSIONS, GROUPS, PRESETS } from "@/lib/permissions";
import { Table, Row, Cell } from "../../_components/Table";
import { Badge } from "../../_components/ui";
import StaffForm from "./StaffForm";
import StatusToggle from "./StatusToggle";

export default async function Staff() {
  await requirePageAccess("staff:read");
  const me = await currentUser();
  const writable = can(me, "staff:write");

  await db();
  const team = plain(await User.find({ role: { $in: ["staff", "admin"] } }).sort({ role: 1, name: 1 }).lean());

  return (
    <>
      <header>
        <p className="text-[12px] uppercase tracking-brand text-muted">Access control</p>
        <h1 className="mt-2 font-display text-[2.4rem] font-light leading-none">Team</h1>
        <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted">
          Administrators hold every permission. Staff hold only what you tick — the sidebar hides
          what they cannot use, and every action re-checks on the server before it runs.
        </p>
      </header>

      <div className="mt-8">
        <Table head={["Name", "Email", "Role", "Permissions", "State", ""]} empty="No team members yet.">
          {team.map((u) => (
            <Row key={u._id}>
              <Cell className="text-ink">
                {u.name}
                {String(u._id) === String(me._id) && <span className="ml-2 text-[12px] text-muted">(you)</span>}
              </Cell>
              <Cell className="text-xs text-muted">{u.email}</Cell>
              <Cell>
                <Badge tone={u.role === "admin" ? "delivered" : undefined}>{u.role}</Badge>
              </Cell>
              <Cell className="text-xs text-muted">
                {u.role === "admin" ? "All permissions" : `${u.permissions.length} of ${Object.keys(PERMISSIONS).length}`}
              </Cell>
              <Cell><Badge tone={u.status}>{u.status}</Badge></Cell>
              <Cell className="text-right">
                {writable && String(u._id) !== String(me._id) && (
                  <StatusToggle id={u._id} status={u.status} scope="staff" />
                )}
              </Cell>
            </Row>
          ))}
        </Table>
      </div>

      {writable && (
        <StaffForm
          team={team}
          groups={GROUPS}
          labels={PERMISSIONS}
          presets={PRESETS}
          canMakeAdmin={me.role === "admin"}
          meId={String(me._id)}
        />
      )}
    </>
  );
}
