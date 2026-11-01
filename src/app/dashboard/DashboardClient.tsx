"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  LuArrowRight,
  LuBuilding2,
  LuCalendar,
  LuCirclePlus,
  LuHeart,
  LuLayoutGrid,
  LuRotateCcw,
  LuTriangleAlert,
} from "react-icons/lu";
import PageLoader from "@/components/ui/PageLoader";
import { apiGet } from "@/lib/api";
import {
  bookingStatusMeta,
  formatDate,
  formatMoney,
  formatTime12,
} from "@/lib/format";
import type { Booking, Studio } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";

type Source = "loading" | "ready" | "error";

interface Stats {
  listings: number;
  guestBookings: number;
  hostIncoming: number;
  saved: number;
  recentMine: Booking[];
  recentIncoming: Booking[];
  latestListing: Studio | null;
}

export default function DashboardClient() {
  const { user } = useAuth();
  const [source, setSource] = useState<Source>("loading");
  const [stats, setStats] = useState<Stats | null>(null);

  const load = useCallback(async () => {
    setSource("loading");
    try {
      const [listings, mine, incoming, saved] = await Promise.all([
        apiGet<{ items: Studio[] }>("studios/mine").catch(() => ({ items: [] as Studio[] })),
        apiGet<{ items: Booking[] }>("bookings/mine"),
        apiGet<{ items: Booking[] }>("bookings/manage").catch(() => ({ items: [] as Booking[] })),
        apiGet<{ items: unknown[] }>("wishlist").catch(() => ({ items: [] as unknown[] })),
      ]);
      setStats({
        listings: listings.items.length,
        guestBookings: mine.items.length,
        hostIncoming: incoming.items.length,
        saved: saved.items.length,
        recentMine: mine.items.slice(0, 4),
        recentIncoming: incoming.items.slice(0, 4),
        latestListing: listings.items[0] ?? null,
      });
      setSource("ready");
    } catch {
      setSource("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (source === "loading") {
    return <PageLoader label="Summarising your studio activity…" />;
  }

  if (source === "error" || !stats) {
    return (
      <div
        role="alert"
        className="mt-8 rounded-2xl border border-error/30 bg-error/5 px-6 py-12 text-center"
      >
        <LuTriangleAlert aria-hidden className="mx-auto size-8 text-error" />
        <h2 className="mt-3 font-heading text-lg font-semibold">
          Couldn&apos;t load your dashboard
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
          Live session data couldn&apos;t be fetched — try again in a moment.
        </p>
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

  const welcome = user?.name ? `, ${user.name}` : "";

  const statCards = [
    {
      icon: LuBuilding2,
      label: "My listings",
      value: stats.listings,
      href: "/my-listings",
      hint: stats.latestListing
        ? `Latest: ${stats.latestListing.title}`
        : "Nothing published yet",
    },
    {
      icon: LuCalendar,
      label: "My bookings",
      value: stats.guestBookings,
      href: "/my-bookings",
      hint: stats.recentMine[0]
        ? `Next up: ${stats.recentMine[0].studioTitle}`
        : "No reservations yet",
    },
    {
      icon: LuLayoutGrid,
      label: "Incoming (host)",
      value: stats.hostIncoming,
      href: "/my-bookings",
      hint:
        stats.hostIncoming > 0
          ? "Reservations to confirm"
          : "Guests will appear here",
    },
    {
      icon: LuHeart,
      label: "Saved studios",
      value: stats.saved,
      href: "/wishlist",
      hint: stats.saved > 0 ? "Your shortlist" : "Heart a studio to save it",
    },
  ] as const;

  return (
    <>
      <p className="mt-4 text-sm text-base-content/70">
        {welcome && (
          <>
            Glad you&apos;re back, <strong>{user?.name}</strong> —{" "}
          </>
        )}
        here&apos;s how your spaces are doing.
      </p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value, href, hint }) => (
          <Link
            key={label}
            href={href}
            className="card-hover group rounded-2xl border border-base-300 bg-base-100 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon aria-hidden className="size-5" />
              </span>
              <LuArrowRight
                aria-hidden
                className="size-4 text-base-content/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </div>
            <p className="mt-3 font-heading text-3xl font-bold">{value}</p>
            <p className="text-sm font-semibold text-base-content/75">{label}</p>
            <p className="mt-1 truncate text-xs text-base-content/45">{hint}</p>
          </Link>
        ))}
      </div>

     
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/add-studio"
          className="btn btn-primary gap-2 rounded-full px-6 font-medium"
        >
          <LuCirclePlus aria-hidden className="size-4.5" />
          Add New Studio
        </Link>
        <Link
          href="/studios"
          className="btn btn-ghost gap-2 rounded-full border border-base-300 px-6 font-medium text-base-content/75"
        >
          <LuLayoutGrid aria-hidden className="size-4.5" />
          Explore Studios
        </Link>
        <Link
          href="/my-bookings"
          className="btn btn-ghost gap-2 rounded-full border border-base-300 px-6 font-medium text-base-content/75"
        >
          <LuCalendar aria-hidden className="size-4.5" />
          My Bookings
        </Link>
      </div>

      {/* Recent activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <BookingPanel title="My latest reservations" bookings={stats.recentMine} emptyText="Book a studio from Explore and it will show up here." />
        <BookingPanel title="Latest incoming (host)" bookings={stats.recentIncoming} emptyText="Guests who book your listings will appear here." />
      </div>
    </>
  );
}

function BookingPanel({
  title,
  bookings,
  emptyText,
}: {
  title: string;
  bookings: Booking[];
  emptyText: string;
}) {
  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-5">
      <h2 className="font-heading text-base font-semibold">{title}</h2>
      {bookings.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-base-300 bg-base-200/40 px-4 py-6 text-center text-sm text-base-content/55">
          {emptyText}
        </p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {bookings.map((booking) => {
            const meta = bookingStatusMeta[booking.status];
            return (
              <li
                key={booking._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-base-200 bg-base-200/40 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {booking.studioTitle}
                  </p>
                  <p className="truncate text-xs text-base-content/50">
                    {formatDate(booking.date)} ·{" "}
                    {formatTime12(booking.startTime)}–
                    {formatTime12(booking.endTime)} ·{" "}
                    {formatMoney(booking.total)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.badge}`}
                >
                  {meta.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
