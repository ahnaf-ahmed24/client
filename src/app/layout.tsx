import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "StudioSpace — Book Creative Studios & Production Spaces",
    template: "%s | StudioSpace",
  },
  description:
    "StudioSpace is a peer-to-peer marketplace for photographers, filmmakers, podcasters and musicians to discover, list and book creative studios with transparent hourly pricing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable}`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-base-100 font-sans text-base-content antialiased"
      >
        <AppProviders>

          <Suspense fallback={<NavbarSkeleton />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}

function NavbarSkeleton() {
  return (
    <div className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="skeleton size-10 rounded-xl" />
        <div className="skeleton h-6 w-36 rounded-lg" />
        <div className="ms-auto flex items-center gap-3">
          <div className="skeleton hidden size-9 rounded-full sm:block" />
          <div className="skeleton h-9 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
