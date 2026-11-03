import Link from "next/link";
import type { Metadata } from "next";
import { LuArrowLeft, LuCamera, LuSearch } from "react-icons/lu";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page didn't make it into the shot.",
};


export default function NotFound() {
  return (
    <section className="container-page section-gap">
      <div className="panel-dark rise relative overflow-hidden rounded-[2rem]">
        <div className="panel-grid absolute inset-0" aria-hidden />
        <span
          aria-hidden
          className="panel-glow absolute -top-24 left-1/4 size-96 rounded-full"
        />
        <span
          aria-hidden
          className="panel-glow-soft absolute -bottom-28 right-0 size-80 rounded-full"
        />


        <svg
          aria-hidden
          viewBox="0 0 420 260"
          role="img"
          className="mx-auto mt-10 hidden w-full max-w-md sm:block"
        >

          <defs>
            <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="70,0 165,0 120,215 30,215" fill="url(#beam)" />
          <polygon points="255,0 350,0 390,215 300,215" fill="url(#beam)" />

          <rect x="88" y="8" width="52" height="34" rx="8" fill="#312e81" />
          <rect x="286" y="8" width="52" height="34" rx="8" fill="#312e81" />

          <ellipse cx="210" cy="222" rx="180" ry="14" fill="#0f121b" />

          <g stroke="#a5b4fc" strokeWidth="5" strokeLinecap="round">
            <line x1="210" y1="118" x2="176" y2="218" />
            <line x1="210" y1="118" x2="244" y2="218" />
            <line x1="210" y1="118" x2="210" y2="205" />
          </g>

          <g>
            <rect
              x="168"
              y="76"
              width="84"
              height="52"
              rx="10"
              fill="#4f46e5"
            />
            <rect x="196" y="64" width="28" height="14" rx="4" fill="#4338ca" />
            <circle cx="210" cy="102" r="17" fill="#1e1b4b" />
            <circle cx="210" cy="102" r="9" fill="#818cf8" />
            <circle cx="205" cy="97" r="3" fill="#e0e7ff" />
          </g>

          <g transform="rotate(-8 332 196)">
            <rect x="296" y="182" width="72" height="30" rx="5" fill="#312e81" />
            <rect x="290" y="170" width="90" height="14" rx="4" fill="#4f46e5" />
            <line x1="306" y1="183" x2="316" y2="169" stroke="#e0e7ff" strokeWidth="5" />
            <line x1="324" y1="183" x2="334" y2="169" stroke="#e0e7ff" strokeWidth="5" />
            <line x1="342" y1="183" x2="352" y2="169" stroke="#e0e7ff" strokeWidth="5" />
          </g>

          <g fill="none" stroke="#4f46e5" strokeWidth="3" opacity="0.55">
            <rect x="122" y="52" width="30" height="24" rx="4" transform="rotate(-12 137 64)" />
            <rect x="268" y="44" width="26" height="20" rx="4" transform="rotate(10 281 54)" />
          </g>
        </svg>

        <div className="relative px-6 pb-16 pt-8 text-center sm:px-12">
          <span className="eyebrow">404 — Take two</span>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            This page didn&apos;t make it <span className="text-gradient">into the shot</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-neutral-content/75 sm:text-base">
            The address went off-script — the backdrop, page or studio you were
            looking for isn&apos;t here. Let&apos;s get you back on set.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="btn btn-primary gap-2 rounded-full px-7 font-medium"
            >
              <LuArrowLeft aria-hidden className="size-4.5" />
              Return to Home
            </Link>
            <Link
              href="/studios"
              className="btn btn-ghost gap-2 rounded-full border border-white/20 px-7 font-medium text-white hover:bg-white/10"
            >
              <LuCamera aria-hidden className="size-4.5" />
              Explore Studios
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-base-content/50">
        <LuSearch aria-hidden className="size-3.5" />
        Try the Explore page — every studio listing lives there.
      </p>
    </section>
  );
}
