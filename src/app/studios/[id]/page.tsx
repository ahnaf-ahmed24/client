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
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="skeleton aspect-[16/10] w-full rounded-[1.75rem]" />
          <div className="skeleton mt-6 h-7 w-56 rounded-xl" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="skeleton h-20 rounded-xl" />
            <div className="skeleton h-20 rounded-xl" />
            <div className="skeleton h-20 rounded-xl sm:col-span-2" />
          </div>
        </div>
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    </section>
  );
}
