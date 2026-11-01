import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your StudioSpace overview — listings, bookings, incoming reservations and saved studios.",
};

export default function DashboardPage() {
  return (
    <RequireAuth>
      <section className="container-page pb-14 pt-10 sm:pt-14">
        <span className="eyebrow">Welcome back</span>
        <h1 className="section-heading mt-2">Dashboard</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
          Everything you host, book and saved — in one place.
        </p>

        <DashboardClient />
      </section>
    </RequireAuth>
  );
}
