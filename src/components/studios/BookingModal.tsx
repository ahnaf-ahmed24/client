"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { LuCalendar, LuClock, LuInfo, LuLoader, LuUsers, LuWallet } from "react-icons/lu";
import Modal from "@/components/ui/Modal";
import { apiPost } from "@/lib/api";
import { formatMoney, minutesToTime, timeToMinutes } from "@/lib/format";
import type { Studio } from "@/lib/types";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  studio: Studio;
  signedIn: boolean;
  onBooked: () => void;
}

const START_OPTIONS: string[] = Array.from({ length: 34 }, (_, index) =>
  minutesToTime(6 * 60 + index * 30)
);

const todayISO = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};

export default function BookingModal({
  open,
  onClose,
  studio,
  signedIn,
  onBooked,
}: BookingModalProps) {
  const [date, setDate] = useState(todayISO());
  const [startTime, setStartTime] = useState("10:00");
  const [hours, setHours] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + hours * 60;
  const tooLate = endMinutes > 24 * 60;
  const endTime = minutesToTime(Math.min(endMinutes, 24 * 60));

  const total = useMemo(
    () => Math.round(studio.hourlyRate * hours + studio.deposit),
    [studio.hourlyRate, studio.deposit, hours]
  );

  const handleBook = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await apiPost<{ booking: { _id: string } }>("bookings", {
        studioId: studio._id,
        date,
        startTime,
        hours,
      });
      toast.success("Booking requested!", {
        description: `${formatMoney(total)} — waiting for the host to confirm your slot.`,
      });
      onBooked();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Booking failed. Please try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Book ${studio.title}`}
      size="md"
      busy={submitting}
    >
      {!signedIn ? (
        <div className="py-2 text-center">
          <p className="text-sm leading-6 text-base-content/70">
            Booking is a signed-in perk — log in to reserve{" "}
            <strong>{studio.title}</strong> and manage the reservation from{" "}
            <em>My Bookings</em>.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href={`/login?next=${encodeURIComponent(`/studios/${studio._id}`)}`}
              onClick={onClose}
              className="btn btn-primary rounded-full px-6 font-medium"
            >
              Log in to book
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="btn btn-ghost rounded-full px-6 text-base-content/70"
            >
              Create account
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <LuCalendar aria-hidden className="size-4 text-primary" />
                Shoot date
              </span>
              <input
                type="date"
                value={date}
                min={todayISO()}
                onChange={(event) => setDate(event.target.value)}
                className={`input input-bordered w-full bg-base-100 ${
                  date < todayISO() ? "input-error" : ""
                }`}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <LuClock aria-hidden className="size-4 text-primary" />
                Start time
              </span>
              <select
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="select select-bordered w-full cursor-pointer bg-base-100"
              >
                {START_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <LuUsers aria-hidden className="size-4 text-primary" />
                Shoot length (hours)
              </span>
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={hours}
                onChange={(event) => setHours(Number(event.target.value))}
                className="range range-primary range-xs"
                aria-label="Shoot length in hours"
              />
              <span className="mt-1.5 block text-xs text-base-content/50">
                {hours} {hours === 1 ? "hour" : "hours"} — {startTime} → {endTime}
                {tooLate && (
                  <span className="font-semibold text-error">
                    {" "}
                    (must end the same day)
                  </span>
                )}
              </span>
            </label>
          </div>

          <div className="mt-5 rounded-xl bg-base-200/70 p-4 text-sm">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/50">
              <LuWallet aria-hidden className="size-3.5" />
              Price breakdown
            </p>
            <div className="mt-2 space-y-1.5 text-base-content/70">
              <p className="flex justify-between">
                <span>
                  {formatMoney(studio.hourlyRate)}/hr × {hours}
                  {hours > 1 ? " hours" : " hour"}
                </span>
                <span>{formatMoney(studio.hourlyRate * hours)}</span>
              </p>
              <p className="flex justify-between">
                <span>
                  Security deposit
                  <span className="text-base-content/40"> (refundable)</span>
                </span>
                <span>{formatMoney(studio.deposit)}</span>
              </p>
              <p className="flex justify-between border-t border-base-300 pt-1.5 font-heading text-base font-bold text-base-content">
                <span>Total</span>
                <span className="text-primary">{formatMoney(total)}</span>
              </p>
            </div>
          </div>

          {tooLate && (
            <p className="mt-3 flex items-center gap-2 rounded-lg bg-error/10 px-3 py-2 text-xs font-medium text-error">
              <LuInfo aria-hidden className="size-4 shrink-0" />
              {endTime} would roll past midnight — shorten the shoot or start
              earlier.
            </p>
          )}

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-ghost rounded-full px-5"
            >
              Keep browsing
            </button>
            <button
              type="button"
              onClick={() => void handleBook()}
              disabled={submitting || tooLate || date < todayISO()}
              className="btn btn-primary gap-2 rounded-full px-6 font-semibold"
            >
              {submitting && <LuLoader aria-hidden className="size-4 animate-spin" />}
              {submitting ? "Reserving…" : "Book Workspace Now"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
