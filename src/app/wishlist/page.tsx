import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Saved Wishlist",
  description: "The studios you hearted, ready to book when you are.",
};


export default function WishlistPage() {
  return (
    <RequireAuth>
      <section className="container-page pb-14 pt-10 sm:pt-14">
        <span className="eyebrow">Your shortlist</span>
        <h1 className="section-heading mt-2">Saved Wishlist</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
          Studios you hearted while browsing — compare your favourites side by
          side, then book the one that fits.
        </p>

        <WishlistClient />
      </section>
    </RequireAuth>
  );
}
