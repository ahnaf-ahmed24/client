"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LuRotateCcw, LuSearch, LuTriangleAlert } from "react-icons/lu";
import StudioCard from "./StudioCard";
import { apiGet } from "@/lib/api";
import type { Studio } from "@/lib/types";
import { STUDIO_CATEGORIES } from "@/lib/types";

type Source = "loading" | "ready" | "error";
type SortKey = "default" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export default function StudioBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [qInput, setQInput] = useState(searchParams.get("q") ?? "");
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState<SortKey>(
    (searchParams.get("sort") as SortKey) ?? "default"
  );

  const [items, setItems] = useState<Studio[]>([]);
  const [source, setSource] = useState<Source>("loading");
  const [error, setError] = useState("");

  const hasFilters = Boolean(category || q.trim() || sort !== "default");

  const load = useCallback(async () => {
    setSource("loading");
    setError("");
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (q.trim()) params.set("q", q.trim());
      if (sort !== "default") params.set("sort", sort);
      const query = params.toString();

      const { items: live } = await apiGet<{ items: Studio[] }>(
        `studios${query ? `?${query}` : ""}`
      );
      setItems(live);
      setSource("ready");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load studios from the server."
      );
      setSource("error");
    }
  }, [category, q, sort]);

  useEffect(() => {
    void load();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q.trim()) params.set("q", q.trim());
    if (sort !== "default") params.set("sort", sort);
    const query = params.toString();
    router.replace(query ? `/studios?${query}` : "/studios", { scroll: false });
  }, [category, q, sort, load, router]);

  const resetAll = () => {
    setCategory("");
    setQInput("");
    setQ("");
    setSort("default");
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setQ(qInput);
        }}
        className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.2fr_1fr_auto]">
          <label className="flex items-center rounded-xl border border-base-300 bg-base-100 px-3 py-2.5">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Studio category"
              className="w-full cursor-pointer bg-transparent text-sm outline-none"
            >
              <option value="">All categories</option>
              {STUDIO_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center rounded-xl border border-base-300 bg-base-100 px-3 py-2.5">
            <input
              type="text"
              value={qInput}
              onChange={(event) => setQInput(event.target.value)}
              placeholder="Search by title, city or keyword"
              aria-label="Search studios"
              className="w-full bg-transparent text-sm outline-none placeholder:text-base-content/40"
            />
          </label>

          <label className="flex items-center rounded-xl border border-base-300 bg-base-100 px-3 py-2.5">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              aria-label="Sort results"
              className="w-full cursor-pointer bg-transparent text-sm outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 px-5 font-medium lg:flex-none">
              <LuSearch aria-hidden className="size-4" />
              Apply
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="btn btn-ghost gap-1.5 px-3 text-base-content/60"
              aria-label="Reset filters"
            >
              <LuRotateCcw aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </form>

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
      ) : source === "error" ? (
        <div
          role="alert"
          className="mt-10 rounded-2xl border border-error/30 bg-error/5 px-6 py-16 text-center"
        >
          <LuTriangleAlert aria-hidden className="mx-auto size-8 text-error" />
          <h2 className="mt-3 font-heading text-xl font-semibold">
            Couldn&apos;t load studios from the server
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
            {error} — the Explore page reads live MongoDB data, so an API
            connection is required.
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
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-base-300 bg-base-200/40 px-6 py-16 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <LuSearch aria-hidden className="size-6" />
          </span>
          <h2 className="mt-4 font-heading text-xl font-semibold">
            No studios match those filters
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-base-content/60">
            {hasFilters
              ? "Try widening your search — every studio on the platform comes straight from the server."
              : "No studios have been listed yet — hosts publish new spaces weekly."}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={resetAll}
              className="btn btn-primary mt-6 rounded-full px-6 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-base-content/60">
            {items.length} {items.length === 1 ? "studio" : "studios"} found
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
