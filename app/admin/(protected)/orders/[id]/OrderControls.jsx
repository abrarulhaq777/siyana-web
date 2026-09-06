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
          <Field label="Note" hint="Recorded on the order history.">
            <Textarea name="note" rows={2} placeholder="Courier, AWB, reason for cancellation…" />
          </Field>
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
          <Submit variant="danger" className="w-full">Issue refund</Submit>
        </form>
      )}
    </div>
  );
}
