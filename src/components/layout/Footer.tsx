import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import CurrentYear from "./CurrentYear";
import { NAV_LINKS } from "./navLinks";
import { SITE_NAME } from "@/lib/config";
import { STUDIO_CATEGORIES } from "@/lib/types";

interface SocialLink {
  label: string;
  href: string;
  icon: IconType;
}


const SOCIAL_LINKS: SocialLink[] = [
  { label: "X (formerly Twitter)", href: "#", icon: FaXTwitter }, // new X logo, NOT the old Twitter bird
  { label: "Instagram", href: "#", icon: FaInstagram },
  { label: "Facebook", href: "#", icon: FaFacebookF },
  { label: "YouTube", href: "#", icon: FaYoutube },
  { label: "LinkedIn", href: "#", icon: FaLinkedinIn },
];

const headingClass =
  "font-heading text-sm font-semibold uppercase tracking-widest text-neutral-content";

export default function Footer() {
  return (
    <footer className="border-t border-base-300/60 bg-neutral text-neutral-content">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
          
          <div>
            <Logo variant="dark" />
            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-content/70">
              The peer-to-peer marketplace where photographers, filmmakers,
              podcasters and musicians discover, list and book creative studios
              &amp; production spaces — with transparent hourly pricing.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`StudioSpace on ${label}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-neutral-content/80 transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-content"
                >
                  <Icon aria-hidden className="size-4" />
                </a>
              ))}
            </div>
          </div>


          <nav aria-label="Quick links">
            <h3 className={headingClass}>Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-content/70">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>


          <nav aria-label="Popular studio categories">
            <h3 className={headingClass}>Popular Categories</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-content/70">
              {STUDIO_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category)}`}
                    className="transition-colors hover:text-primary"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>


          <div>
            <h3 className={headingClass}>Stay in the Loop</h3>
            <p className="mt-4 text-sm leading-6 text-neutral-content/70">
              New studios, opening offers and creator stories — straight to your
              inbox.
            </p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-neutral-content/50">
              No spam — unsubscribe anytime.
            </p>
          </div>
        </div>


        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-neutral-content/60 sm:flex-row">
          <p>
            © <CurrentYear /> {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
