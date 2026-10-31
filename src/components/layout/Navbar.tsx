"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  LuBuilding2,
  LuCalendar,
  LuChevronDown,
  LuCirclePlus,
  LuHeart,
  LuLogOut,
  LuMenu,
  LuMoon,
  LuSun,
  LuX,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import Logo from "./Logo";
import { NAV_LINKS } from "./navLinks";
import { useAuth } from "@/providers/AuthProvider";

interface AccountLink {
  href: string;
  label: string;
  icon: IconType;
  /** "Add New Studio" is highlighted in brand accent, per the design mock. */
  accent?: boolean;
}

const ACCOUNT_LINKS: AccountLink[] = [
  { href: "/dashboard/add-studio", label: "Add New Studio", icon: LuCirclePlus, accent: true },
  { href: "/dashboard/my-studios", label: "My Studio Listings", icon: LuBuilding2 },
  { href: "/dashboard/my-bookings", label: "My Bookings", icon: LuCalendar },
  // TODO(API): wishlist page lands with the wishlist feature; route reserved now.
  { href: "/dashboard/wishlist", label: "Saved Wishlist", icon: LuHeart },
];

/** Plain-route match, used for the dashboard account links. */
const isRouteActive = (href: string, pathname: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Home anchors ("/#explore", …) are active together with whichever home
 * section is currently in view (tracked by the scroll-spy below).
 */
const isLinkActive = (href: string, pathname: string, activeSection: string | null) => {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) {
    return pathname === href && activeSection === null;
  }
  return (
    pathname === href.slice(0, hashIndex) && activeSection === href.slice(hashIndex + 1)
  );
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

/** Dark charcoal circle with a moon/sun swap — matches the design mock. */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Resolve the theme only after hydration to avoid an SSR markup mismatch;
  // the moon is shown until then (matching the server render).
  useEffect(() => setMounted(true), []);

  const dark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral text-neutral-content transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      {dark ? (
        <LuSun aria-hidden className="size-4.5" />
      ) : (
        <LuMoon aria-hidden className="size-4.5" />
      )}
    </button>
  );
}

export default function Navbar() {
  const { user, authLoading, logout } = useAuth();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement | null>(null);

  // Elevate the header once the page scrolls past the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the home section currently in the viewport.
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    let frame = 0;
    const update = () => {
      // The section whose top has passed the upper third of the viewport is
      // the "current" one; before the first section that's the hero (Home).
      const marker = window.innerHeight * 0.35;
      let current: string | null = null;
      document.querySelectorAll<HTMLElement>("[data-nav-section]").forEach((section) => {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      });
      setActiveSection((previous) => (previous === current ? previous : current));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Re-evaluate after the browser's initial anchor scroll settles when
    // landing on urls like /#how-it-works from another page.
    const settle = window.setTimeout(update, 450);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Close any open menu when the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Close menus on outside click or Escape.
  useEffect(() => {
    if (!mobileOpen && !userMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
        setUserMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, userMenuOpen]);

  const closeAllMenus = () => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    closeAllMenus();
    setLoggingOut(true);
    try {
      await logout();
      toast.success("You have been signed out. See you soon!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Sign out failed. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-shadow duration-300 ${
        scrolled
          ? "border-base-300 bg-base-100/95 shadow-md shadow-base-300/30"
          : "border-base-300/70 bg-base-100/85"
      }`}
    >
      <div className="container-page flex h-16 items-center gap-4">
        {/* Left: mobile menu toggle + logo */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="btn btn-ghost btn-circle lg:hidden"
          >
            {mobileOpen ? (
              <LuX aria-hidden className="size-5" />
            ) : (
              <LuMenu aria-hidden className="size-5" />
            )}
          </button>
          <Logo />
        </div>

        {/* Center: desktop navigation links */}
        <nav
          className="hidden flex-1 justify-center lg:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href, pathname, activeSection);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: theme toggle + authentication actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {authLoading ? (
            <div className="skeleton h-10 w-24 rounded-full" aria-hidden />
          ) : user ? (
            /* ------- Authenticated: avatar + initials chip + dropdown ------- */
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                aria-controls="user-menu"
                aria-label={`Account menu for ${user.name}`}
                className="group flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-base-200 pr-2.5"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-10 place-items-center rounded-full bg-neutral text-sm font-semibold text-neutral-content">
                    {initialsOf(user.name)}
                  </span>
                )}
                <span className="flex items-center gap-1.5 rounded-full bg-base-200/80 px-3 py-1.5 text-xs font-semibold text-base-content transition-colors group-hover:bg-base-300">
                  {initialsOf(user.name)}
                  <LuChevronDown
                    aria-hidden
                    className={`size-3.5 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {userMenuOpen && (
                <div
                  id="user-menu"
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute end-0 top-full z-50 mt-3 w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-base-300/70 bg-base-100 p-3 shadow-xl shadow-base-300/50"
                >
                  {/* Signed in as — identity header */}
                  <div className="px-2.5 pb-3 pt-1.5">
                    <p className="text-xs text-base-content/50">Signed in as</p>
                    <p className="mt-1 truncate font-heading text-lg font-bold">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-base-content/50">
                      {user.email}
                    </p>
                  </div>

                  <div className="mx-1 h-px bg-base-200" role="presentation" />

                  {/* Account links */}
                  <ul role="none" className="mt-1.5 space-y-0.5">
                    {ACCOUNT_LINKS.map(({ href, label, icon: Icon, accent }) => {
                      const active = isRouteActive(href, pathname);
                      return (
                        <li key={href} role="none">
                          <Link
                            href={href}
                            role="menuitem"
                            aria-current={active ? "page" : undefined}
                            onClick={closeAllMenus}
                            className={`flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm transition-colors ${
                              accent
                                ? "font-semibold text-primary hover:bg-primary/10"
                                : active
                                  ? "bg-primary/10 text-primary"
                                  : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                            }`}
                          >
                            <Icon
                              aria-hidden
                              className={`size-4.5 shrink-0 ${
                                accent ? "text-primary" : "text-base-content/70"
                              }`}
                            />
                            {label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mx-1 my-1.5 h-px bg-base-200" role="presentation" />

                  {/* Sign out */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/10 disabled:opacity-60"
                  >
                    <LuLogOut aria-hidden className="size-4.5 shrink-0" />
                    {loggingOut ? "Signing out…" : "Sign Out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ---------- Unauthenticated: Login & Register ---------- */
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn btn-ghost rounded-full px-4 font-medium">
                Login
              </Link>
              <Link
                href="/register"
                className="btn btn-primary rounded-full px-5 font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-base-300/70 bg-base-100 shadow-xl lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="container-page py-4"
          >
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href, pathname, activeSection);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={closeAllMenus}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-base-content/80 hover:bg-base-200"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`size-1.5 shrink-0 rounded-full ${
                          active ? "bg-primary" : "bg-base-300"
                        }`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="my-3 h-px bg-base-300" role="presentation" />

            {authLoading ? (
              <div className="space-y-2" aria-hidden>
                <div className="skeleton h-10 w-full rounded-lg" />
                <div className="skeleton h-10 w-full rounded-lg" />
              </div>
            ) : user ? (
              <div className="space-y-0.5">
                {/* User identity */}
                <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-10 place-items-center rounded-full bg-neutral text-sm font-semibold text-neutral-content">
                      {initialsOf(user.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-xs text-base-content/50">
                      Signed in as
                    </p>
                    <p className="truncate font-heading text-base font-bold">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-base-content/50">
                      {user.email}
                    </p>
                  </div>
                </div>
                <ul className="space-y-0.5">
                  {ACCOUNT_LINKS.map(({ href, label, icon: Icon, accent }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={closeAllMenus}
                        aria-current={isRouteActive(href, pathname) ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          accent
                            ? "font-semibold text-primary hover:bg-primary/10"
                            : isRouteActive(href, pathname)
                              ? "bg-primary/10 text-primary"
                              : "text-base-content/80 hover:bg-base-200"
                        }`}
                      >
                        <Icon
                          aria-hidden
                          className={`size-4.5 shrink-0 ${
                            accent ? "text-primary" : "text-base-content/70"
                          }`}
                        />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="my-2 h-px bg-base-300" role="presentation" />
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/10"
                >
                  <LuLogOut aria-hidden className="size-4.5" />
                  {loggingOut ? "Signing out…" : "Sign Out"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={closeAllMenus}
                  className="btn btn-ghost"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeAllMenus}
                  className="btn btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
