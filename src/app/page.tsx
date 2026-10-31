import { Suspense } from "react";
import Link from "next/link";
import {
  LuAperture,
  LuArrowRight,
  LuBadgeCheck,
  LuHandshake,
  LuKeyRound,
  LuReceipt,
  LuSearch,
  LuShieldCheck,
  LuSparkles,
  LuTimer,
  LuVideo,
  LuZap,
} from "react-icons/lu";
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import type { IconType } from "react-icons";
import { STUDIO_CATEGORIES } from "@/lib/types";
import { CATEGORY_ICONS } from "@/components/studios/categoryIcons";

const BOOKING_STEPS: { icon: IconType; step: string; title: string; text: string }[] = [
  {
    icon: LuSearch,
    step: "1",
    title: "Discover Spaces",
    text: "Filter by category, capacity, location and amenities — every card shows transparent pricing up front.",
  },
  {
    icon: LuTimer,
    step: "2",
    title: "Select Shoot Hours",
    text: "Pick the date and exact hours you need. The total updates live — rate plus refundable deposit.",
  },
  {
    icon: LuZap,
    step: "3",
    title: "Book Instantly",
    text: "Confirm with one click. No calls, no emails — the host is notified and the slot is yours.",
  },
  {
    icon: LuVideo,
    step: "4",
    title: "Create & Produce",
    text: "Show up, unpack and get to work. Message your host any time about gear, access or setup.",
  },
];

const GUARANTEES: { icon: IconType; title: string; text: string }[] = [
  {
    icon: LuShieldCheck,
    title: "Liability protection",
    text: "Clear house rules and booking terms on every listing, so both sides know exactly where they stand.",
  },
  {
    icon: LuBadgeCheck,
    title: "Verified profiles",
    text: "Hosts and creators are tied to real, checkable identities — listings are reviewed before they go live.",
  },
  {
    icon: LuKeyRound,
    title: "Equipment safety",
    text: "Studios declare their gear and condition up front, with deposits protecting both props and people.",
  },
  {
    icon: LuReceipt,
    title: "24/7 host support",
    text: "Booking history, messages and help are always one screen away — before, during and after the shoot.",
  },
];

const VALUES: { icon: IconType; title: string; text: string }[] = [
  {
    icon: LuReceipt,
    title: "Fair & transparent",
    text: "Hourly rates, deposits and totals are on every card. No surprises at the door.",
  },
  {
    icon: LuHandshake,
    title: "Community first",
    text: "Creators support hosts; hosts reinvest in spaces. Good listings make good shoots.",
  },
  {
    icon: LuSparkles,
    title: "Craft matters",
    text: "Built by people who shoot, record and rehearse — the details are the product.",
  },
  {
    icon: LuShieldCheck,
    title: "Safe & reliable",
    text: "Verified profiles, reviewed listings and a full record of every booking.",
  },
];

export default function Home() {
  return (
    <>
      <section className="container-page pt-6 sm:pt-10">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSlider />
        </Suspense>
      </section>
      <FeaturedStudios />
      <section className="container-page py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Browse by category</span>
            <h2 className="section-heading mt-2">Every kind of creative space</h2>
          </div>
          <Link
            href="/studios"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all hover:gap-2.5"
          >
            Explore all studios
            <LuArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {STUDIO_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <Link
                key={category}
                href={`/studios?category=${encodeURIComponent(category)}`}
                className="card-hover group rounded-2xl border border-base-300 bg-base-100 p-5 hover:border-primary/50"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                  <Icon aria-hidden className="size-5" />
                </span>
                <h3 className="mt-3.5 font-heading text-sm font-semibold">
                  {category}
                </h3>
                <span className="mt-1 block text-xs text-base-content/50 transition-colors group-hover:text-primary">
                  Browse spaces
                </span>
              </Link>
            );
          })}
        </div>
      </section>


      <section
        id="how-it-works"
        data-nav-section
        className="container-page scroll-mt-20 py-12 sm:scroll-mt-24 sm:py-16"
      >
        <span className="eyebrow">How booking works</span>
        <h2 className="section-heading mt-2">
          From searching to shooting in four steps
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BOOKING_STEPS.map(({ icon: Icon, step, title, text }) => (
            <div key={step} className="card-hover rounded-2xl bg-base-200/50 p-6">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-content">
                  <Icon aria-hidden className="size-5" />
                </span>
                <span
                  aria-hidden
                  className="font-heading text-5xl font-bold text-primary/15"
                >
                  {step}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-base-content/65">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>


      <section className="container-page pb-12 sm:pb-16">
        <span className="eyebrow">Host guarantee &amp; creator support</span>
        <h2 className="section-heading mt-2">
          Confident bookings, protected on both sides
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="card-hover rounded-2xl border border-base-300 bg-base-100 p-6"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-base-content/65">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>


      <section
        id="about"
        data-nav-section
        className="container-page scroll-mt-20 py-12 sm:scroll-mt-24 sm:py-16"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="eyebrow">About Us</span>
            <h2 className="section-heading mt-3">
              Creativity deserves a <span className="text-gradient">place to happen</span>.
            </h2>
            <p className="mt-4 text-sm leading-7 text-base-content/65 sm:text-base">
              StudioSpace is the peer-to-peer marketplace connecting
              photographers, filmmakers, podcasters, musicians and makers with
              the studios and production spaces they need — by the hour, with
              transparent pricing on the table from the first click.
            </p>
            <p className="mt-3 text-sm leading-7 text-base-content/65 sm:text-base">
              Hosts list once and turn idle hours into steady income; creators
              stop hunting for spaces and start shooting in them.
            </p>
            <Link href="/register" className="btn btn-primary mt-6 rounded-full px-6 font-medium">
              Join the community
            </Link>
          </div>

          <div className="grid content-start grid-cols-1 gap-4 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="card-hover rounded-2xl border border-base-300 bg-base-100 p-5"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden className="size-5" />
                </span>
                <h3 className="mt-3.5 font-heading text-base font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-base-content/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="container-page pb-14 sm:pb-16">
        <div className="panel-dark rounded-[2rem]">
          <div className="panel-grid absolute inset-0" aria-hidden />
          <span
            aria-hidden
            className="panel-glow absolute -top-24 -right-24 size-96 rounded-full"
          />
          <LuAperture
            aria-hidden
            className="pointer-events-none absolute -right-10 bottom-0 hidden size-56 rotate-12 text-primary/10 lg:block"
          />

          <div className="relative flex flex-col items-start justify-between gap-8 px-6 py-14 sm:flex-row sm:items-center sm:px-12">
            <div className="max-w-xl">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Own a studio? Put those idle hours to work.
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-content/75">
                List your space on StudioSpace, set your hourly rate and manage
                bookings end-to-end — from first inquiry to final payment.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="btn btn-primary rounded-full px-6 font-medium"
              >
                List your studio
              </Link>
              <Link
                href="/studios"
                className="btn btn-ghost rounded-full border border-white/15 px-6 font-medium text-neutral-content hover:bg-white/10"
              >
                Browse studios
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


function HeroSkeleton() {
  return (
    <div
      aria-hidden
      className="panel-dark relative h-[30rem] overflow-hidden rounded-[2rem] shadow-xl shadow-base-300/60 sm:h-[34rem]"
    >
      <div className="panel-grid absolute inset-0" />
      <div className="container-page relative flex h-full items-center">
        <div className="max-w-2xl space-y-5 pb-16 pt-6 sm:pt-10">
          <div className="skeleton h-8 w-44 rounded-full bg-white/10" />
          <div className="skeleton h-12 w-[28rem] max-w-full rounded-xl bg-white/10" />
          <div className="skeleton h-20 w-[30rem] max-w-full rounded-xl bg-white/10" />
          <div className="flex gap-3">
            <div className="skeleton h-11 w-40 rounded-full bg-white/10" />
            <div className="skeleton h-11 w-40 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
