import { Suspense } from "react";
import { notFound } from "next/navigation";
import StudioDetails from "@/components/studios/StudioDetails";


export default function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <DetailsBody params={params} />
    </Suspense>
  );
}

async function DetailsBody({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; 
  if (!id) notFound();

  return (
    <section className="container-page pb-16 pt-10 sm:pt-14">
      <StudioDetails id={id} />
    </section>
  );
}

function DetailsSkeleton() {
  return (
    <section className="container-page pb-16 pt-10 sm:pt-14" aria-hidden>
      <div className="flex items-center justify-between">
        <div className="skeleton h-10 w-40 rounded-full" />
        <div className="skeleton size-10 rounded-full" />
      </div>
      <div className="mt-7 space-y-3">
        <div className="skeleton h-6 w-28 rounded-full" />
        <div className="skeleton h-9 w-80 max-w-full rounded-xl" />
        <div className="skeleton h-4 w-44" />
      </div>
      <div className="skeleton mt-6 aspect-[4/3] w-full rounded-[1.75rem] sm:aspect-[16/9] lg:aspect-[16/7]" />
      <div className="mt-6 grid grid-cols-2 gap-6 rounded-2xl border border-base-300 bg-base-100 px-6 py-5 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-6 w-24 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="skeleton h-44 rounded-2xl" />
          <div className="skeleton h-52 rounded-2xl" />
          <div className="skeleton h-24 rounded-2xl" />
        </div>
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    </section>
  );
}
