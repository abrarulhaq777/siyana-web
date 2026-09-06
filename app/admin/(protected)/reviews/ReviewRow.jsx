"use client";

import { useActionState, useState } from "react";
import { moderateReview, replyToReview } from "@/app/admin/actions";
import { Button, Submit, Notice, Textarea } from "@/app/admin/_components/ui";

export default function ReviewRow({ review }) {
  const [modState, modAction] = useActionState(moderateReview, null);
  const [replyState, replyAction] = useActionState(replyToReview, null);
  const [replying, setReplying] = useState(false);

  return (
    <div className="w-full shrink-0 space-y-3 sm:w-56">
      <Notice state={modState} />

      <div className="flex flex-wrap gap-2">
        {review.status !== "published" && (
          <form action={modAction}>
            <input type="hidden" name="id" value={review._id} />
            <input type="hidden" name="status" value="published" />
            <Submit>Publish</Submit>
          </form>
        )}
        {review.status !== "rejected" && (
          <form action={modAction}>
            <input type="hidden" name="id" value={review._id} />
            <input type="hidden" name="status" value="rejected" />
            <Submit variant="danger">Reject</Submit>
          </form>
        )}
        {review.status !== "pending" && (
          <form action={modAction}>
            <input type="hidden" name="id" value={review._id} />
            <input type="hidden" name="status" value="pending" />
            <Submit variant="ghost">Unpublish</Submit>
          </form>
        )}
      </div>

      <Button variant="ghost" onClick={() => setReplying((r) => !r)} className="w-full">
        {replying ? "Cancel reply" : review.reply?.body ? "Edit reply" : "Reply"}
      </Button>

      {replying && (
        <form action={replyAction} className="space-y-2">
          <Notice state={replyState} />
          <input type="hidden" name="id" value={review._id} />
          <Textarea name="body" rows={4} required defaultValue={review.reply?.body}
            placeholder="Thank you for the note…" />
          <Submit className="w-full">Post reply</Submit>
        </form>
      )}
    </div>
  );
}
