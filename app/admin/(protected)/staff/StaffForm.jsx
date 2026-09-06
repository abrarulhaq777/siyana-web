"use client";

import { useActionState, useState } from "react";
import { saveStaff } from "@/app/admin/actions";
import { Field, Input, Select, Submit, Notice, Button } from "@/app/admin/_components/ui";

export default function StaffForm({ team, groups, labels, presets, canMakeAdmin, meId }) {
  const [state, action] = useActionState(saveStaff, null);
  const [editingId, setEditingId] = useState(null);
  const editing = team.find((t) => t._id === editingId);

  const [role, setRole] = useState("staff");
  const [checked, setChecked] = useState([]);

  const start = (member) => {
    setEditingId(member?._id ?? null);
    setRole(member?.role ?? "staff");
    setChecked(member?.permissions ?? []);
  };

  const toggle = (p) =>
    setChecked((c) => (c.includes(p) ? c.filter((x) => x !== p) : [...c, p]));

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[1.7rem] leading-none">
          {editing ? `Edit ${editing.name}` : "Add a team member"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {team.map((t) => (
            <button
              key={t._id}
              onClick={() => start(t)}
              className={`border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] transition ${
                editingId === t._id ? "border-ink bg-ink text-bone" : "border-line bg-paper text-muted hover:border-gold"
              }`}
            >
              {t.name.split(" ")[0]}
            </button>
          ))}
          {editing && (
            <Button variant="ghost" onClick={() => start(null)} className="!py-1.5">New</Button>
          )}
        </div>
      </div>

      <form key={editingId ?? "new"} action={action} className="mt-5 space-y-6 border border-line bg-paper p-6">
        <Notice state={state} />
        {editing && <input type="hidden" name="id" value={editing._id} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name"><Input name="name" defaultValue={editing?.name} required /></Field>
          <Field label="Email"><Input name="email" type="email" defaultValue={editing?.email} required /></Field>
          <Field label="Role">
            <Select name="role" value={role} onChange={(e) => setRole(e.target.value)} disabled={editing?._id === meId}>
              <option value="staff">Staff — only the permissions ticked below</option>
              {canMakeAdmin && <option value="admin">Administrator — full access</option>}
            </Select>
          </Field>
          <Field
            label={editing ? "New password" : "Password"}
            hint={editing ? "Leave blank to keep the current one." : "At least 8 characters."}
          >
            <Input name="password" type="password" autoComplete="new-password" minLength={8} required={!editing} />
          </Field>
        </div>

        {role === "staff" ? (
          <div className="space-y-5 border-t border-line pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted">Start from a preset</span>
              {Object.entries(presets).map(([name, perms]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setChecked(perms)}
                  className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-muted transition hover:border-gold hover:text-ink"
                >
                  {name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setChecked([])}
                className="px-2 py-1.5 text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink"
              >
                Clear
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {groups.map(([group, perms]) => (
                <fieldset key={group}>
                  <legend className="text-[10px] uppercase tracking-[0.16em] text-ink">{group}</legend>
                  <div className="mt-3 space-y-2.5">
                    {perms.map((p) => (
                      <label key={p} className="flex cursor-pointer items-start gap-2.5 text-xs">
                        <input
                          type="checkbox"
                          name="permissions"
                          value={p}
                          checked={checked.includes(p)}
                          onChange={() => toggle(p)}
                          className="mt-0.5 accent-ink"
                        />
                        <span>
                          <span className="block text-ink">{labels[p]}</span>
                          <span className="block font-mono text-[10px] text-muted">{p}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <p className="text-[11px] text-muted">
              {checked.length} of {Object.keys(labels).length} permissions granted.
            </p>
          </div>
        ) : (
          <p className="border-t border-line pt-6 text-xs text-muted">
            Administrators hold every permission, including creating other administrators.
          </p>
        )}

        <Submit>{editing ? "Save team member" : "Create team member"}</Submit>
      </form>
    </section>
  );
}
