import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import AddStudioClient from "./AddStudioClient";

export const metadata: Metadata = {
  title: "Add New Studio",
  description:
    "List your creative workspace on StudioSpace — pricing, amenities and photos in one form.",
};


export default function AddStudioPage() {
  return (
    <RequireAuth>
      <section className="container-page pb-14 pt-10 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow">Host a space</span>
          <h1 className="section-heading mt-2">Add a new studio</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
            List your creative workspace — set the hourly rate, deposit and
            capacity, tick the amenities and publish. Your listing lands on the
            Explore page instantly.
          </p>

          <AddStudioClient />
        </div>
      </section>
    </RequireAuth>
  );
}
