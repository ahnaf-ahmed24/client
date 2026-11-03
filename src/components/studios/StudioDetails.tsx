"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  LuArrowLeft,
  LuBuilding2,
  LuCalendarCheck,
  LuCheck,
  LuMapPin,
  LuPencil,
  LuRotateCcw,
  LuShieldCheck,
  LuStar,
  LuTriangleAlert,
} from "react-icons/lu";
import PageLoader from "@/components/ui/PageLoader";
import BookingModal from "./BookingModal";
import ReviewsSection from "./ReviewsSection";
import StudioGallery from "./StudioGallery";
import { apiGet, ApiError } from "@/lib/api";
import { formatHourlyRate, formatMoney } from "@/lib/format";
import { useAuth } from "@/providers/AuthProvider";
import type { Studio, StudioCategory } from "@/lib/types";
import { CATEGORY_ICONS } from "./categoryIcons";

type DetailState =
  | { kind: "loading" }
  | { kind: "ready"; studio: Studio }
  | { kind: "error"; message: string };

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "H";

export default function StudioDetails({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [state, setState] = useState<DetailState>({ kind: "loading" });
  const [bookingOpen, setBookingOpen] = useState(false);

  const load = useMemo(
    () => async () => {
      setState({ kind: "loading" });
      try {
        const { studio } = await apiGet<{ studio: Studio }>(`studios/${id}`);
        setState({ kind: "ready", studio });
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          notFound();
          return;
        }
        setState({
          kind: "error",
          message:
            error instanceof Error
              ? error.message
              : "Could not load this studio.",
        });
      }
    },
    [id]
  );

  useEffect(() => {
    void load();
  }, [load]);

  if (state.kind === "loading") {
    return <PageLoader label="Opening the studio..." />;
  }

  if (state.kind === "error") {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-error/30 bg-error/5 px-6 py-16 text-center"
      >
        <LuTriangleAlert aria-hidden className="mx-auto size-8 text-error" />
        <h2 className="mt-3 font-heading text-xl font-semibold">
          Couldn&apos;t load this studio
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
          {state.message}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => void load()}
            className="btn btn-outline btn-primary gap-2 rounded-full px-6"
          >
            <LuRotateCcw aria-hidden className="size-4" />
            Try again
          </button>
          <Link
            href="/studios"
            className="btn btn-ghost rounded-full px-6 text-base-content/70"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const { studio } = state;

  const images = [...new Set([studio.image, ...(studio.gallery ?? [])])].filter(
    Boolean
  );
  const PlaceholderIcon =
    CATEGORY_ICONS[studio.category as StudioCategory] ?? LuBuilding2;
  const isOwnListing =
    Boolean(user) &&
    studio.ownerEmail.toLowerCase() === (user?.email ?? "").toLowerCase();

  return (
    <>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/studios"
          className="group inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-2 text-sm font-medium text-base-content/70 transition hover:border-primary/40 hover:text-primary"
        >
          <LuArrowLeft
            aria-hidden
            className="size-4 transition-transform group-hover:-translate-x-0.5"
          />
          Back to Explore
        </Link>
        {isOwnListing && (
          <Link
            href={`/studios/edit/${studio._id}`}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
          >
            <LuPencil aria-hidden className="size-4" />
            Edit this listing
          </Link>
        )}
      </div>

      <header className="mt-7">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {studio.category}
        </span>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {studio.title}
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-base-content/60">
          <LuMapPin aria-hidden className="size-4" />
          {studio.location}
        </p>
      </header>

      <div className="mt-6">
        <StudioGallery
          images={images}
          title={studio.title}
          fallbackIcon={PlaceholderIcon}
        />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-base-300 bg-base-100 px-6 py-5 sm:grid-cols-4">
        <div className="sm:border-l sm:border-base-300 sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
            Hourly rate
          </dt>
          <dd className="mt-1.5 font-heading text-xl font-bold text-primary">
            {formatHourlyRate(studio.hourlyRate)}
          </dd>
        </div>
        <div className="sm:border-l sm:border-base-300 sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
            Security deposit
          </dt>
          <dd className="mt-1.5 font-heading text-xl font-bold">
            {formatMoney(studio.deposit)}
          </dd>
        </div>
        <div className="sm:border-l sm:border-base-300 sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
            Max capacity
          </dt>
          <dd className="mt-1.5 font-heading text-xl font-bold">
            {studio.capacity} guests
          </dd>
        </div>
        <div className="sm:border-l sm:border-base-300 sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
            Client rating
          </dt>
          <dd className="mt-1.5 flex items-center gap-1.5 font-heading text-xl font-bold">
            <span className="flex items-center gap-1 text-warning">
              <LuStar aria-hidden className="size-4" />
              {studio.rating.toFixed(1)}
            </span>
            <span className="text-xs font-normal text-base-content/40">
              ({studio.reviewsCount})
            </span>
          </dd>
        </div>
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">

          <section
            aria-label="Workspace overview"
            className="rounded-2xl border border-base-300 bg-base-100 p-6"
          >
            <h2 className="font-heading text-xl font-bold">
              Workspace Overview
            </h2>
            <p className="mt-3 whitespace-pre-line leading-7 text-base-content/70">
              {studio.overview}
            </p>
          </section>

          <section
            aria-label="Equipment and amenities"
            className="rounded-2xl border border-base-300 bg-base-100 p-6"
          >
            <h2 className="font-heading text-xl font-bold">
              Equipment &amp; Amenities
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {studio.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                    <LuCheck aria-hidden className="size-3" />
                  </span>
                  <span className="text-sm text-base-content/85">
                    {amenity}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-label="Host details"
            className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                {initialsOf(studio.ownerName)}
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-heading font-bold">
                  Hosted by {studio.ownerName}
                  <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                    Verified Host
                  </span>
                </p>
                <a
                  href={`mailto:${studio.ownerEmail}?subject=${encodeURIComponent(
                    `StudioSpace — question about ${studio.title}`
                  )}`}
                  className="mt-0.5 text-sm text-base-content/60 transition hover:text-primary hover:underline"
                >
                  Contact: {studio.ownerEmail}
                </a>
              </div>
              <p className="ml-auto flex items-center gap-1.5 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 text-xs text-base-content/70">
                <LuShieldCheck aria-hidden className="size-4 text-success" />
                Protected by StudioSpace Host Guarantee
              </p>
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <section
            aria-label="Book this studio"
            className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-md shadow-base-300/40"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="flex items-baseline gap-2">
                <span className="font-heading text-3xl font-bold text-primary">
                  {formatMoney(studio.hourlyRate)}
                </span>
                <span className="text-sm text-base-content/50">/ hour</span>
              </p>
              <p className="flex items-center gap-1 pt-1 text-sm font-semibold">
                <LuStar aria-hidden className="size-4 text-warning" />
                {studio.rating.toFixed(1)}
                <span className="text-xs font-normal text-base-content/40">
                  ({studio.reviewsCount})
                </span>
              </p>
            </div>

            <dl className="mt-4 space-y-3 border-t border-base-300 pt-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-base-content/55">Security Deposit</dt>
                <dd className="font-semibold">
                  {formatMoney(studio.deposit)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-base-content/55">Cancellation Policy</dt>
                <dd className="font-semibold text-success">
                  Free before shoot confirmation
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-base-content/55">Availability</dt>
                <dd className="text-right font-semibold">
                  Instant Request Slots
                </dd>
              </div>
            </dl>

            {isOwnListing ? (
              <div className="mt-5 rounded-xl bg-base-200/60 px-4 py-4 text-center text-sm text-base-content/60">
                This is your own listing — bookings aren&apos;t needed.
                <Link
                  href={`/studios/edit/${studio._id}`}
                  className="mt-2 block font-semibold text-primary hover:underline"
                >
                  Update it instead →
                </Link>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setBookingOpen(true)}
                  className="btn btn-primary mt-5 w-full gap-2 rounded-full px-6 font-semibold"
                >
                  <LuCalendarCheck aria-hidden className="size-5" />
                  Book Workspace Now
                </button>
                <p className="mt-3 text-center text-[11px] leading-relaxed text-base-content/40">
                  You won&apos;t be charged immediately. Your reservation will
                  enter Pending status for host approval.
                </p>
              </>
            )}
          </section>
        </div>
      </div>

      <div className="mt-10">
        <ReviewsSection
          studioId={studio._id}
          userEmail={user?.email ?? null}
          ownerEmail={studio.ownerEmail}
        />
      </div>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        studio={studio}
        signedIn={Boolean(user)}
        onBooked={() => {
          setBookingOpen(false);
          router.push("/my-bookings");
        }}
      />
    </>
  );
}
