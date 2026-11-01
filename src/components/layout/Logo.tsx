import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M9.3 7.5 21.2 15.6 18.6 19.7 6.8 9.6Z" fill="#ffffff" opacity="0.32" />
      <circle cx="7.4" cy="5.7" r="2.2" fill="#ffffff" />
      <circle cx="15.9" cy="16.6" r="4.6" fill="#ffffff" />
      <circle cx="15.9" cy="14.25" r="1.02" fill="#4f46e5" />
      <circle cx="18.55" cy="16.6" r="1.02" fill="#4f46e5" />
      <circle cx="15.9" cy="18.95" r="1.02" fill="#4f46e5" />
      <circle cx="13.25" cy="16.6" r="1.02" fill="#4f46e5" />
      <circle cx="15.9" cy="16.6" r="0.8" fill="#4f46e5" />
    </svg>
  );
}

export default function Logo({ variant = "light", className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="StudioSpace — go to homepage"
      className={`group flex items-center gap-2.5 ${className}`}
    >

      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary via-indigo-500 to-indigo-400 shadow-md shadow-primary/25 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <BrandMark className="size-[23px]" />
      </span>
      <span
        className={`font-heading text-xl font-bold leading-none tracking-tight ${
          variant === "dark" ? "text-neutral-content" : "text-base-content"
        }`}
      >
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  );
}

export { BrandMark };
