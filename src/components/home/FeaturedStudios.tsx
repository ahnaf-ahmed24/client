"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LuArrowRight, LuRotateCcw, LuTriangleAlert } from "react-icons/lu";
import StudioCard from "@/components/studios/StudioCard";
import { apiGet } from "@/lib/api";
import type { Studio } from "@/lib/types";

type Source = "loading" | "live" | "error";

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [source, setSource] = useState<Source>("loading");

  const load = useCallback(async () => {
    setSource("loading");
    try {
      const { items } = await apiGet<{ items: Studio[] }>("studios/featured");
      setStudios(items);
      setSource("live");
    } catch {
      setSource("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section
      id="explore"
      data-nav-section
      className="container-page scroll-mt-20 py-12 sm:scroll-mt-24 sm:py-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Explore Studios</span>
          <h2 className="section-heading mt-2">Spaces our community loves</h2>
        </div>
        <Link
          href="/studios"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all hover:gap-2.5"
        >
          See all studios
          <LuArrowRight aria-hidden className="size-4" />
        </Link>
      </div>

      {source === "error" && (
        <div
          role="alert"
          className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm"
        >
          <LuTriangleAlert aria-hidden className="size-4 shrink-0 text-warning" />
          <p className="text-base-content/75">
            Featured studios couldn&apos;t load from the API right now.
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            <LuRotateCcw aria-hidden className="size-3.5" />
            Retry
          </button>
        </div>
      )}

      {source === "loading" ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
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
      ) : studios.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      ) : source === "live" && studios.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-base-300 bg-base-200/40 px-6 py-12 text-center text-sm text-base-content/60">
          No studios to feature yet —{" "}
          <Link href="/add-studio" className="font-semibold text-primary hover:underline">
            add the first studio
          </Link>
          .
        </div>
      ) : null}
    </section>
  );
}
