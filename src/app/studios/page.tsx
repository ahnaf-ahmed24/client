import { Suspense } from "react";
import type { Metadata } from "next";
import StudioBrowser from "@/components/studios/StudioBrowser";

export const metadata: Metadata = {
  title: "Explore Studios",
  description:
    "Browse creative studios, production stages and workshops — filter by category, price and amenities.",
};


export default function StudiosPage() {
  return (
    <section className="container-page pb-14 pt-10 sm:pt-14">
      <span className="eyebrow">Explore Studios</span>
      <h1 className="section-heading mt-2">Find your next creative space</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
        Filter by category, keyword and price — every listing shows its hourly
        rate and refundable deposit up front.
      </p>

      <div className="mt-8">
        <Suspense fallback={<StudioBrowserSkeleton />}>
          <StudioBrowser />
        </Suspense>
      </div>
    </section>
  );
}

function StudioBrowserSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="skeleton h-16 w-full rounded-2xl" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-base-300 bg-base-100"
          >
            <div className="skeleton aspect-[4/3] rounded-none" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
