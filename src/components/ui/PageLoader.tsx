"use client";

// import { useEffect } from "react";
import { LuLoader } from "react-icons/lu";


export default function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-[46vh] w-full place-items-center px-4"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="relative grid size-14 place-items-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-primary/10"
          />
          <LuLoader
            aria-hidden
            className="relative size-7 animate-spin text-primary"
          />
        </span>
        <p className="text-sm font-medium text-base-content/60">{label}</p>
      </div>
    </div>
  );
}
