import { Suspense } from "react";
import Link from "next/link";
import { LuCamera, LuClock } from "react-icons/lu";

export default function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <DetailsBody params={params} />
    </Suspense>
  );
}

async function DetailsBody({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; 

  return (
    <section className="container-page section-gap">
      <div className="panel-dark rise rounded-[2rem]">
        <div className="panel-grid absolute inset-0" aria-hidden />
        <span
          aria-hidden
          className="panel-glow absolute -top-24 right-10 size-96 rounded-full"
        />
        <LuCamera
          aria-hidden
          className="pointer-events-none absolute -left-8 bottom-0 hidden size-52 -rotate-12 text-primary/10 lg:block"
        />

        <div className="relative px-6 py-16 text-center sm:px-12">
          <span className="eyebrow">Studio details</span>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            The booking flow is coming next
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-neutral-content/75 sm:text-base">
            This studio&apos;s full profile — gallery, amenities breakdown and
            instant hourly booking — lands with the booking milestone.
          </p>
          <code className="mt-4 inline-block rounded bg-white/10 px-2 py-0.5 text-xs text-indigo-300">
            id: {id}
          </code>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studios"
              className="btn btn-primary rounded-full px-6 font-medium"
            >
              Back to Explore
            </Link>
            <Link
              href="/"
              className="btn btn-ghost rounded-full border border-white/15 px-6 font-medium text-neutral-content hover:bg-white/10"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-base-content/50">
        <LuClock aria-hidden className="size-3.5" />
        Hourly booking opens with the booking milestone — the API is already
        serving full studio records.
      </p>
    </section>
  );
}

function DetailsSkeleton() {
  return (
    <section className="container-page section-gap" aria-hidden>
      <div className="panel-dark relative overflow-hidden rounded-[2rem]">
        <div className="panel-grid absolute inset-0" />
        <div className="px-6 py-16 sm:px-12">
          <span className="eyebrow">Studio details</span>
          <div className="skeleton mt-4 h-10 w-72 max-w-full rounded-xl bg-white/10" />
          <div className="skeleton mt-3 h-6 w-96 max-w-full rounded-lg bg-white/10" />
        </div>
      </div>
    </section>
  );
}
