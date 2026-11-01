import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import MyListingsClient from "./MyListingsClient";

export const metadata: Metadata = {
  title: "My Studio Listings",
  description: "Update or remove the studios you host on StudioSpace.",
};


export default function MyListingsPage() {
  return (
    <RequireAuth>
      <section className="container-page pb-14 pt-10 sm:pt-14">
        <span className="eyebrow">Host space</span>
        <h1 className="section-heading mt-2">My studio listings</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
          Everything you publish lives here — update rates, amenities and
          photos any time, or remove a listing altogether.
        </p>

        <MyListingsClient />
      </section>
    </RequireAuth>
  );
}
