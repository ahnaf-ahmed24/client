"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { LuMapPin, LuSearch } from "react-icons/lu";
import { STUDIO_CATEGORIES } from "@/lib/types";

export default function HomeSearchBar() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (location.trim()) params.set("q", location.trim());
    const query = params.toString();
    router.push(query ? `/studios?${query}` : "/studios");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-2 rounded-2xl bg-base-100 p-3 text-base-content shadow-2xl shadow-black/30 sm:grid-cols-[1.2fr_1fr_auto] sm:items-center"
    >
      <label className="flex items-center rounded-xl border border-base-300 bg-base-100 px-3 py-2.5">
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Studio category"
          className="w-full cursor-pointer bg-transparent text-sm outline-none"
        >
          <option value="" disabled hidden>
            All categories
          </option>
          {STUDIO_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center rounded-xl border border-base-300 bg-base-100 px-3 py-2.5">
        <LuMapPin aria-hidden className="mr-2 size-4 shrink-0 text-base-content/50" />
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="City, area or studio name"
          aria-label="Location"
          className="w-full bg-transparent text-sm outline-none placeholder:text-base-content/40"
        />
      </label>

      <button type="submit" className="btn btn-primary px-6 font-medium">
        <LuSearch aria-hidden className="size-4" />
        Find Studios
      </button>
    </form>
  );
}
