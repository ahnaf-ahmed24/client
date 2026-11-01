import { Suspense } from "react";
import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import EditStudioClient from "./EditStudioClient";

export const metadata: Metadata = {
  title: "Update Studio",
  description: "Edit your studio listing on StudioSpace.",
};


export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <RequireAuth>
      <section className="container-page pb-14 pt-10 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow">Host space</span>
          <h1 className="section-heading mt-2">Update your studio</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
            Adjust the pricing, capacity, amenities and photos — changes go live
            the moment you save.
          </p>

          <Suspense fallback={<EditSkeleton />}>
            <EditScope params={params} />
          </Suspense>
        </div>
      </section>
    </RequireAuth>
  );
}

async function EditScope({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  return <EditStudioClient id={id} />;
}

function EditSkeleton() {
  return (
    <div className="mt-8 space-y-4" aria-hidden>
      <div className="skeleton h-10 w-full max-w-3xl rounded-2xl" />
      <div className="skeleton h-56 w-full max-w-3xl rounded-2xl" />
      <div className="skeleton h-64 w-full max-w-3xl rounded-2xl" />
    </div>
  );
}
