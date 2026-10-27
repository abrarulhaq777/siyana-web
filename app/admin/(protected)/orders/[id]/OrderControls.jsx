"use client";

import { useActionState } from "react";
import { setOrderStatus, refundOrder, markOrderPaid } from "@/app/admin/actions";
import { Field, Input, Textarea, Select, Submit, Notice } from "@/app/admin/_components/ui";
import { inr } from "@/lib/products";

export default function OrderControls({ order, statuses, canWrite, canRefund, refunded }) {
  const [statusState, statusAction] = useActionState(setOrderStatus, null);
  const [refundState, refundAction] = useActionState(refundOrder, null);
  const [paidState, paidAction] = useActionState(markOrderPaid, null);

  const remaining = order.amounts.total - refunded;
  const refundable = canRefund && ["paid", "partially_refunded"].includes(order.payment.status) && remaining > 0;
  const needsManualCapture = canRefund && order.payment.status === "pending" && order.payment.method !== "cod";

  if (!canWrite && !canRefund) {
    return (
      <section className="border border-line bg-paper p-5 text-xs text-muted">
        You have read-only access to orders.
      </section>
    );
  }

  return (
    <div className="space-y-5">
      {canWrite && (
        <form action={statusAction} className="space-y-4 border border-line bg-paper p-5">
          <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Update status</h2>
          <Notice state={statusState} />
          <input type="hidden" name="id" value={order._id} />
          <Field label="Status">
            <Select name="status" defaultValue={order.status}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Internal note" hint="Only on the order history — the customer never sees it.">
            <Textarea name="note" rows={2} placeholder="Packed by…, reason for cancellation…" />
          </Field>
          <Field label="Message to the customer" hint="Optional. Included in their email — e.g. courier and tracking number.">
            <Textarea name="message" rows={2} placeholder="Shipped with Delhivery · AWB 1234567890" />
          </Field>
          <label className="flex items-center gap-2.5 text-[13px] text-ink">
            <input type="checkbox" name="notify" defaultChecked className="accent-ink" />
            Email the customer about this update
          </label>
          <Submit className="w-full">Update order</Submit>
        </form>
      )}

      {needsManualCapture && (
        <form action={paidAction} className="space-y-3 border border-line bg-paper p-5">
          <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Record payment</h2>
          <Notice state={paidState} />
          <p className="text-xs text-muted">
            Use this when money arrived outside the gateway — a bank transfer or a manual capture.
          </p>
          <input type="hidden" name="id" value={order._id} />
          <Submit variant="ghost" className="w-full">Mark as paid</Submit>
        </form>
      )}

      {refundable && (
        <form action={refundAction} className="space-y-4 border border-line bg-paper p-5">
          <h2 className="text-[12px] uppercase tracking-[0.16em] text-muted">Refund</h2>
          <Notice state={refundState} />
          <input type="hidden" name="id" value={order._id} />
          <Field label="Amount" hint={`Up to ${inr(remaining)} remaining.`}>
            <Input name="amount" type="number" min="1" max={remaining} defaultValue={remaining} required />
          </Field>
          <Field label="Reason">
            <Input name="note" placeholder="Returned, damaged, cancelled…" />
          </Field>
          <label className="flex items-center gap-2.5 text-[13px] text-ink">
            <input type="checkbox" name="notify" defaultChecked className="accent-ink" />
            Email the customer that the refund was issued
          </label>
          <Submit variant="danger" className="w-full">Issue refund</Submit>
        </form>
      )}
    </div>
  );
}
