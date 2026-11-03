"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { LuLoader, LuMessageCircle, LuStar, LuTriangleAlert } from "react-icons/lu";
import { apiGet, apiPost } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Review } from "@/lib/types";

interface ReviewsSectionProps {
  studioId: string;
  userEmail: string | null;
  ownerEmail: string;
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

function Stars({ value, size = "size-3.5" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-warning" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <LuStar
          key={star}
          aria-hidden
          className={size}
          fill={star <= value ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

export default function ReviewsSection({
  studioId,
  userEmail,
  ownerEmail,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const { items } = await apiGet<{ items: Review[] }>(`studios/${studioId}/reviews`);
      setReviews(items);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [studioId]);

  useEffect(() => {
    void load();
  }, [load]);

  const isOwner = Boolean(
    userEmail && ownerEmail.toLowerCase() === userEmail.toLowerCase()
  );

  const submitReview = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await apiPost(`studios/${studioId}/reviews`, { rating, comment: comment.trim() });
      toast.success("Review posted — thanks for helping other creators!");
      setComment("");
      setRating(5);
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not post the review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-label="Reviews">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold">Reviews</h2>
          <p className="mt-1 text-sm text-base-content/60">
            {reviews.length === 0
              ? "No reviews yet."
              : `${reviews.length} ${reviews.length === 1 ? "creator" : "creators"} shared their experience.`}
          </p>
        </div>
      </div>


      {userEmail === null ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-base-300 bg-base-200/40 px-4 py-5">
          <p className="text-sm text-base-content/70">
            Worked in this studio? <strong>Log in</strong> to leave a review for
            other creators.
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(`/studios/${studioId}`)}`}
            className="btn btn-outline btn-primary btn-sm gap-1.5 rounded-full px-4"
          >
            Log in to review
          </Link>
        </div>
      ) : isOwner ? (
        <div className="mt-5 rounded-xl border border-base-300 bg-base-200/40 px-4 py-5 text-sm text-base-content/70">
          You host this studio — reviews are for guests only.
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-base-300 bg-base-100 p-4">
          <p className="text-sm font-semibold">Rate your experience</p>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                aria-pressed={rating === star}
                className="text-warning transition-transform hover:scale-110"
              >
                <LuStar
                  aria-hidden
                  className="size-6"
                  fill={star <= rating ? "currentColor" : "none"}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-medium text-base-content/50">
              {rating}/5
            </span>
          </div>
          <textarea
            rows={3}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What worked (or didn't) about the space, gear or host? (min. 5 characters)"
            className="textarea textarea-bordered mt-3 w-full bg-base-100"
            maxLength={600}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-base-content/40">
              One review per creator per studio · {600 - comment.length} chars left
            </span>
            <button
              type="button"
              onClick={() => void submitReview()}
              disabled={submitting || comment.trim().length < 5}
              className="btn btn-primary btn-sm gap-1.5 rounded-full px-5"
            >
              {submitting && <LuLoader aria-hidden className="size-3.5 animate-spin" />}
              Post review
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-3" aria-hidden>
          {[0, 1].map((index) => (
            <div key={index} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      ) : failed ? (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          <LuTriangleAlert aria-hidden className="shrink-0 text-warning" />
          <p>Reviews couldn&apos;t load just now.</p>
          <button
            type="button"
            onClick={() => void load()}
            className="font-semibold text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-dashed border-base-300 bg-base-200/40 px-6 py-10 text-center">
          <LuMessageCircle aria-hidden className="size-6 text-base-content/30" />
          <p className="text-sm text-base-content/60">
            Be the first guest to share how the space played.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {reviews.map((review) => (
            <li
              key={review._id}
              className="rounded-2xl border border-base-300 bg-base-100 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {initialsOf(review.userName)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{review.userName}</p>
                  <Stars value={review.rating} />
                </div>
                <span className="text-[11px] text-base-content/40">
                  {review.createdAt ? formatDate(review.createdAt) : ""}
                </span>
              </div>
              <p className="mt-2.5 whitespace-pre-line text-sm leading-6 text-base-content/75">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
