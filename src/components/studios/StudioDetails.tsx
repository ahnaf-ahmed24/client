"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import {
  LuArrowLeft,
  LuBuilding2,
  LuCalendarCheck,
  LuCheck,
  LuMail,
  LuMapPin,
  LuPencil,
  LuRotateCcw,
  LuStar,
  LuTriangleAlert,
  LuUsers,
  LuWallet,
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
    return <PageLoader label="Opening the studio…" />;
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
          <LuArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-0.5" />
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

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <StudioGallery
            images={images}
            title={studio.title}
            fallbackIcon={PlaceholderIcon}
          />

          <section className="mt-6" aria-label="Workspace specifications">
            <h2 className="font-heading text-lg font-bold">
              Workspace specifications
            </h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-base-300 bg-base-100 p-3.5">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
                  <LuWallet aria-hidden className="size-3.5 text-primary" />
                  Hourly rate
                </dt>
                <dd className="mt-1 font-heading text-lg font-bold text-primary">
                  {formatHourlyRate(studio.hourlyRate)}
                </dd>
              </div>
              <div className="rounded-xl border border-base-300 bg-base-100 p-3.5">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
                  <LuWallet aria-hidden className="size-3.5 text-primary" />
                  Security deposit
                </dt>
                <dd className="mt-1 font-heading text-lg font-bold">
                  {formatMoney(studio.deposit)}
                  <span className="ml-1 text-xs font-normal text-base-content/40">
                    refundable
                  </span>
                </dd>
              </div>
              <div className="rounded-xl border border-base-300 bg-base-100 p-3.5">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
                  <LuUsers aria-hidden className="size-3.5 text-primary" />
                  Max capacity
                </dt>
                <dd className="mt-1 font-heading text-lg font-bold">
                  {studio.capacity} guests
                </dd>
              </div>
              <div className="rounded-xl border border-base-300 bg-base-100 p-3.5">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
                  <LuStar aria-hidden className="size-3.5 text-warning" />
                  Rating
                </dt>
                <dd className="mt-1 font-heading text-lg font-bold text-warning">
                  {studio.rating.toFixed(1)}
                  <span className="ml-1 text-xs font-normal text-base-content/40">
                    ({studio.reviewsCount} reviews)
                  </span>
                </dd>
              </div>
              <div className="rounded-xl border border-base-300 bg-base-100 p-3.5 sm:col-span-2">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
                  <LuMapPin aria-hidden className="size-3.5 text-primary" />
                  Location
                </dt>
                <dd className="mt-1 text-sm font-medium">{studio.location}</dd>
              </div>
            </dl>

            <h3 className="mt-6 font-heading text-lg font-bold">
              Detailed overview
            </h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-base-content/75">
              {studio.overview}
            </p>
          </section>

    
          <section className="mt-7" aria-label="Amenities">
            <h2 className="font-heading text-lg font-bold">
              Amenities <span className="text-sm font-normal text-base-content/40">({studio.amenities.length})</span>
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {studio.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 py-2.5 text-sm"
                >
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                    <LuCheck aria-hidden className="size-3" />
                  </span>
                  {amenity}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          {/* Booking panel */}
          <section
            aria-label="Book this studio"
            className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-md shadow-base-300/40"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {studio.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
                <LuStar aria-hidden className="size-3.5" />
                {studio.rating.toFixed(1)}
                <span className="font-normal opacity-80">({studio.reviewsCount})</span>
              </span>
            </div>

            <h1 className="mt-3 font-heading text-2xl font-bold leading-snug">
              {studio.title}
            </h1>
            <p className="mt-1.5 flex items-start gap-1.5 text-sm text-base-content/60">
              <LuMapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
              {studio.location}
            </p>

            <div className="mt-4 rounded-xl bg-base-200/60 p-3.5">
              <p className="flex items-baseline gap-1.5">
                <span className="font-heading text-2xl font-bold text-primary">
                  {formatHourlyRate(studio.hourlyRate)}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-base-content/50">
                + {formatMoney(studio.deposit)} refundable deposit · {studio.capacity} guests max
              </p>
            </div>

            {isOwnListing ? (
              <div className="mt-4 rounded-xl bg-base-200/60 px-4 py-3 text-center text-sm text-base-content/60">
                This is your own listing — bookings aren&apos;t needed.
                <Link
                  href={`/studios/edit/${studio._id}`}
                  className="mt-2 block font-semibold text-primary hover:underline"
                >
                  Update it instead →
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="btn btn-primary mt-4 w-full gap-2 rounded-full px-6 font-semibold"
              >
                <LuCalendarCheck aria-hidden className="size-5" />
                Book Workspace Now
              </button>
            )}
            <p className="mt-2.5 text-center text-[11px] text-base-content/40">
              Instant request — status stays “Pending” until the host confirms.
            </p>
          </section>

  
          <section
            aria-label="Host details"
            className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
              Your host
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                {initialsOf(studio.ownerName)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading font-bold">{studio.ownerName}</p>
                <p className="truncate text-xs text-base-content/50">
                  {studio.category} host · StudioSpace
                </p>
              </div>
            </div>
            <a
              href={`mailto:${studio.ownerEmail}?subject=${encodeURIComponent(
                `StudioSpace — question about ${studio.title}`
              )}`}
              className="btn btn-outline btn-sm mt-3.5 w-full gap-2 rounded-full normal-case"
            >
              <LuMail aria-hidden className="size-4" />
              {studio.ownerEmail}
            </a>
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
