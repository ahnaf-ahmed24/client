import Link from "next/link";
import { LuAperture } from "react-icons/lu";

interface LogoProps {

  variant?: "light" | "dark";
  className?: string;
}

export default function Logo({ variant = "light", className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="StudioSpace — go to homepage"
      className={`group flex items-center gap-2.5 ${className}`}
    >
      
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary via-indigo-500 to-indigo-400 text-primary-content shadow-md shadow-primary/25 transition-transform duration-300 group-hover:rotate-90">
        <LuAperture aria-hidden className="size-[22px]" />
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
