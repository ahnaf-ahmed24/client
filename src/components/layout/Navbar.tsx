"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LuSun, LuMoon, LuMenu, LuX, LuCamera, LuChevronDown } from "react-icons/lu";
import { useTheme } from "next-themes";
import { useAuth } from "@/providers/AuthProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#explore", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const { user, authLoading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/40 bg-base-100/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        
        {/* বামপাশে লোগো */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn btn-ghost btn-circle lg:hidden"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <LuX className="size-5" /> : <LuMenu className="size-5" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/30">
              <LuCamera className="size-6" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight text-base-content">
              Studio<span className="text-primary">Space</span>
            </span>
          </Link>
        </div>

        {/* মাঝখানে নেভিগেশন লিংকসমূহ (পিল স্টাইল) */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full bg-base-200/60 p-1.5 border border-base-300/50">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-base-100 text-primary shadow-sm"
                    : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ডানপাশে থিম টগল, লগইন ও রেজিস্টার বাটন (ছবির ক্রম অনুযায়ী) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(dark ? "light" : "dark")}
            className="grid size-11 place-items-center rounded-full bg-base-200 text-base-content hover:bg-base-300 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <LuSun className="size-5" /> : <LuMoon className="size-5" />}
          </button>

          {authLoading ? (
            <div className="skeleton h-11 w-28 rounded-full" />
          ) : user ? (
            <span className="text-sm font-semibold">Hi, {user.name}</span>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-base-content hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary rounded-full px-7 py-2.5 min-h-0 h-11 shadow-md shadow-primary/20 font-semibold">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {mobileOpen && (
        <div className="border-b border-base-300 bg-base-100 p-6 lg:hidden shadow-xl">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 text-base font-medium ${
                  pathname === link.href ? "bg-primary/10 text-primary" : "hover:bg-base-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-base-300 flex gap-3">
            <Link href="/login" onClick={() => setMobileOpen(false)} className="btn btn-ghost flex-1 rounded-full">
              Login
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary flex-1 rounded-full">
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}