"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LuHeart, LuRotateCcw, LuSearch, LuTriangleAlert } from "react-icons/lu";
import StudioCard from "@/components/studios/StudioCard";
import { apiGet } from "@/lib/api";
import type { WishlistItem } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";

type Source = "loading" | "ready" | "error";

export default function WishlistClient() {
  const { wishlistIds } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [source, setSource] = useState<Source>("loading");

  const load = async () => {
    setSource("loading");
    try {
      const { items: fresh } = await apiGet<{ items: WishlistItem[] }>("wishlist");
      setItems(fresh);
      setSource("ready");
    } catch {
      setSource("error");
    }
  };

  useEffect(() => {
    void load();
  }, []);


  const visible = useMemo(
    () => items.filter((item) => wishlistIds.includes(item.studioId)),
    [items, wishlistIds]
  );

  if (source === "loading") {
    return (
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
        {Array.from({ length: 3 }).map((_, index) => (
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
          Couldn&apos;t load your wishlist
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
          The saved-studios list comes from the server — check your connection
          and try again.
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

  if (visible.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-base-300 bg-base-200/40 px-6 py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-error/10 text-error">
          <LuHeart aria-hidden className="size-7" />
        </span>
        <h2 className="mt-4 font-heading text-xl font-semibold">
          Nothing saved yet
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-base-content/60">
          Tap the heart on any studio you love — your shortlist lives here so
          you can come back and book it later.
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

  return (
    <>
      <p className="mt-6 text-sm text-base-content/60">
        {visible.length} saved {visible.length === 1 ? "studio" : "studios"} —
        tap a heart to remove it
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <StudioCard key={item.studioId} studio={item.studio} />
        ))}
      </div>
    </>
  );
}
