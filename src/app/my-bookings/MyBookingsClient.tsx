"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  LuCalendar,
  LuCircleCheck,
  LuClock,
  LuLoader,
  LuRotateCcw,
  LuSearch,
  LuTrash2,
  LuTriangleAlert,
} from "react-icons/lu";
import Modal from "@/components/ui/Modal";
import { apiGet, apiPatch } from "@/lib/api";
import {
  bookingStatusMeta,
  formatDate,
  formatMoney,
  formatTime12,
} from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";

type Source = "loading" | "ready" | "error";

export default function MyBookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [source, setSource] = useState<Source>("loading");
  const [error, setError] = useState("");

  // Cancel flow
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setSource("loading");
    setError("");
    try {
      const { items } = await apiGet<{ items: Booking[] }>("bookings/mine");
      setBookings(items);
      setSource("ready");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load your bookings. Please try again."
      );
      setSource("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmCancel = async () => {
    if (!cancelTarget || cancelling) return;
    setCancelling(true);
    try {
      await apiPatch<{ status: BookingStatus }>(`bookings/${cancelTarget._id}/status`, {
        status: "Cancelled",
      });
      toast.success(
        `Your reservation for "${cancelTarget.studioTitle}" was cancelled — the slot is free again.`
      );
      setBookings((current) =>
        current.map((b) =>
          b._id === cancelTarget._id ? { ...b, status: "Cancelled" } : b
        )
      );
      setCancelTarget(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not cancel. Please try again."
      );
    } finally {
      setCancelling(false);
    }
  };



  if (source === "loading") {
    return (
      <div className="mt-8 grid gap-4" aria-hidden>
        {[0, 1, 2].map((index) => (
          <div key={index} className="skeleton h-36 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (source === "error") {
    return (
      <div
        role="alert"
        className="mt-8 rounded-2xl border border-error/30 bg-error/5 px-6 py-12 text-center"
      >
        <LuTriangleAlert aria-hidden className="mx-auto size-8 text-error" />
        <h2 className="mt-3 font-heading text-lg font-semibold">
          Couldn&apos;t load your bookings
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="btn btn-outline btn-primary mt-6 gap-2 rounded-full px-6"
        >
          <LuRotateCcw aria-hidden className="size-4" />
          Try again
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-base-300 bg-base-200/40 px-6 py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <LuCalendar aria-hidden className="size-7" />
        </span>
        <h2 className="mt-4 font-heading text-xl font-semibold">
          No bookings yet
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-base-content/60">
          When you reserve a studio slot it shows up here with its live status.
        </p>
        <Link
          href="/studios"
          className="btn btn-primary mt-6 gap-2 rounded-full px-6 font-medium"
        >
          <LuSearch aria-hidden className="size-4.5" />
          Explore Studios
        </Link>
      </div>
    );
  }



  const totals = {
    pending: bookings.filter((b) => b.status === "Pending").length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
  };

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-base-content/60">
        <span>
          {bookings.length} {bookings.length === 1 ? "reservation" : "reservations"}
        </span>
        {totals.pending > 0 && (
          <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
            {totals.pending} pending host confirmation
          </span>
        )}
        {totals.confirmed > 0 && (
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            {totals.confirmed} confirmed
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-4">
        {bookings.map((booking) => {
          const meta = bookingStatusMeta[booking.status];
          return (
            <article
              key={booking._id}
              className="card-hover flex flex-col gap-4 overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-3 sm:flex-row sm:items-center"
            >
              {/* Thumbnail */}
              <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-base-200 sm:h-24 sm:w-36">
                {booking.studioImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={booking.studioImage}
                    alt={booking.studioTitle}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-base-content/30">
                    <LuCalendar aria-hidden className="size-6" />
                  </div>
                )}
              </div>

              {/* Core */}
              <div className="min-w-0 flex-1 px-1 sm:px-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {booking.studioCategory ?? "Studio"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.badge}`}
                  >
                    {booking.status === "Confirmed" && (
                      <LuCircleCheck aria-hidden className="size-3" />
                    )}
                    {meta.label}
                  </span>
                </div>

                <h3 className="mt-1.5 truncate font-heading text-lg font-semibold">
                  {booking.studioTitle}
                </h3>

                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-base-content/60">
                  <span className="inline-flex items-center gap-1.5">
                    <LuCalendar aria-hidden className="size-3.5" />
                    {formatDate(booking.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <LuClock aria-hidden className="size-3.5" />
                    {formatTime12(booking.startTime)} – {formatTime12(booking.endTime)}
                    <span className="text-base-content/40">
                      ({booking.hours}h)
                    </span>
                  </span>
                </p>
              </div>

             
              <div className="flex shrink-0 items-center justify-between gap-4 px-1 sm:flex-col sm:items-end sm:p-0 md:pr-4">
                <div className="text-right">
                  <p className="font-heading text-lg font-bold text-primary">
                    {formatMoney(booking.total)}
                  </p>
                  <p className="text-[11px] text-base-content/50">
                    {formatMoney(booking.hourlyRate)}/hr × {booking.hours}h
                    {booking.deposit > 0 &&
                      ` + ${formatMoney(booking.deposit)} deposit`}
                  </p>
                </div>

                {booking.status === "Pending" ? (
                  <button
                    type="button"
                    onClick={() => setCancelTarget(booking)}
                    className="btn btn-outline btn-sm gap-1.5 px-3 text-error hover:border-error hover:bg-error/10"
                  >
                    <LuTrash2 aria-hidden className="size-4" />
                    Cancel Booking
                  </button>
                ) : (
                  <span className="text-[11px] text-base-content/40">
                    {booking.status === "Cancelled"
                      ? "Cancelled — the slot was released."
                      : booking.status === "Completed"
                        ? "Thanks for creating with us!"
                        : "Waiting for your shoot day."}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      
      <Modal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title="Cancel this booking?"
        size="sm"
        busy={cancelling}
      >
        <p className="text-sm leading-6 text-base-content/70">
          Your <strong>{cancelTarget?.hours}h</strong> reservation at{" "}
          <strong>{cancelTarget?.studioTitle}</strong> on{" "}
          {cancelTarget ? formatDate(cancelTarget.date) : ""} (
          {cancelTarget ? formatTime12(cancelTarget.startTime) : ""}) will be
          cancelled and the slot released.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setCancelTarget(null)}
            disabled={cancelling}
            className="btn btn-ghost rounded-full px-5"
          >
            Keep booking
          </button>
          <button
            type="button"
            onClick={() => void confirmCancel()}
            disabled={cancelling}
            className="btn btn-error gap-2 rounded-full px-5 font-semibold"
          >
            {cancelling && <LuLoader aria-hidden className="size-4 animate-spin" />}
            {cancelling ? "Cancelling…" : "Yes, cancel it"}
          </button>
        </div>
      </Modal>
    </>
  );
}
