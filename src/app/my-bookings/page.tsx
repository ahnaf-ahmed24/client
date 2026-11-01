import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import MyBookingsClient from "./MyBookingsClient";

export const metadata: Metadata = {
  title: "My Bookings",
  description:
    "Track your studio reservations — pending, confirmed, completed and cancelled.",
};


export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <section className="container-page pb-14 pt-10 sm:pt-14">
        <span className="eyebrow">Your reservations</span>
        <h1 className="section-heading mt-2">My bookings</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
          Every slot you&apos;ve reserved, with its live status — cancel pending
          hours any time before the host confirms.
        </p>

        <MyBookingsClient />
      </section>
    </RequireAuth>
  );
}
