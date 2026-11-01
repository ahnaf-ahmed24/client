export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/#explore", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About Us" },
];
