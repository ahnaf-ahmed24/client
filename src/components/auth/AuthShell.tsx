import Link from "next/link";
import { LuCircleCheck } from "react-icons/lu";
import Logo, { BrandMark } from "@/components/layout/Logo";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const PERKS = ["Hourly, transparent pricing", "Verified hosts & creators", "Instant booking confirmation"];


export default function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
  return (
    <main className="container-page py-10 sm:py-14">
      <div className="grid overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 shadow-xl shadow-base-300/40 lg:grid-cols-2">
       
        <div className="panel-dark relative hidden lg:block">
          <div className="panel-grid absolute inset-0" aria-hidden />
          <span aria-hidden className="panel-glow absolute -top-24 -right-16 size-80 rounded-full" />
          <BrandMark
            className="pointer-events-none absolute -bottom-10 -left-6 size-48 -rotate-12 opacity-10"
          />

          <div className="relative flex h-full flex-col justify-between p-10">
            <Logo variant="dark" />

            <div>
              <p className="max-w-xs font-heading text-2xl font-bold leading-snug">
                Every creative deserves a{" "}
                <span className="text-gradient">space to create</span>.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-neutral-content/75">
                {PERKS.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5">
                    <LuCircleCheck aria-hidden className="size-4 shrink-0 text-primary" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-neutral-content/50">
              Peer-to-peer creative workspace &amp; production studio marketplace.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14">
          <div className="mx-auto w-full max-w-md">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-base-content/60">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
