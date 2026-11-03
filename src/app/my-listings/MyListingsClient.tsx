"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  LuBuilding2,
  LuCirclePlus,
  LuLoader,
  LuMapPin,
  LuPencil,
  LuRotateCcw,
  LuStar,
  LuTrash2,
  LuTriangleAlert,
  LuUsers,
} from "react-icons/lu";
import Modal from "@/components/ui/Modal";
import { apiDelete, apiGet } from "@/lib/api";
import { formatHourlyRate, formatMoney } from "@/lib/format";
import type { Studio } from "@/lib/types";
import Image from "next/image";

type Source = "loading" | "ready" | "error";

export default function MyListingsClient() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [source, setSource] = useState<Source>("loading");
  const [error, setError] = useState("");


  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setSource("loading");
    setError("");
    try {
      const { items } = await apiGet<{ items: Studio[] }>("studios/mine");
      setStudios(items);
      setSource("ready");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load your listings. Please try again."
      );
      setSource("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await apiDelete<{ deleted: boolean }>(`studios/${deleteTarget._id}`);
      toast.success(
        `"${deleteTarget.title}" was deleted along with its bookings and reviews.`
      );
      setStudios((current) => current.filter((s) => s._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Delete failed. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };



  if (source === "loading") {
    return (
      <div className="mt-8 space-y-4" aria-hidden>
        <div className="skeleton h-12 w-full max-w-3xl rounded-2xl" />
        {[0, 1, 2].map((index) => (
          <div key={index} className="skeleton h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (source === "error") {
    return (
      <div
        role="alert"
        className="mt-8 rounded-2xl border border-error/30 bg-error/5 px-6 py-12 text-center"
      >
        <LuTriangleAlert aria-hidden className="mx-auto size-8 text-error" />
        <h2 className="mt-3 font-heading text-lg font-semibold">
          Couldn&apos;t load your listings
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="btn btn-outline btn-primary mt-6 gap-2 rounded-full px-6"
        >
          <LuRotateCcw aria-hidden className="size-4" />
          Try again
        </button>
      </div>
    );
  }

  if (studios.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-base-300 bg-base-200/40 px-6 py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <LuBuilding2 aria-hidden className="size-7" />
        </span>
        <h2 className="mt-4 font-heading text-xl font-semibold">
          You haven&apos;t listed any studios yet
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-base-content/60">
          Turn your creative space into income — add your first studio and it
          goes live on the Explore page right away.
        </p>
        <Link
          href="/add-studio"
          className="btn btn-primary mt-6 gap-2 rounded-full px-6 font-medium"
        >
          <LuCirclePlus aria-hidden className="size-4.5" />
          Add your first studio
        </Link>
      </div>
    );
  }



  return (
    <>
      <p className="mt-6 text-sm text-base-content/60">
        {studios.length} {studios.length === 1 ? "listing" : "listings"} — host
        bookings arrive in{" "}
        <Link href="/my-bookings" className="font-semibold text-primary hover:underline">
          My Bookings
        </Link>
      </p>


      <div className="mt-4 hidden overflow-hidden rounded-2xl border border-base-300 bg-base-100 md:block">
        <table className="table">
          <thead className="bg-base-200/60 text-xs uppercase tracking-wider text-base-content/60">
            <tr>
              <th className="w-[38%]">Studio</th>
              <th>Category</th>
              <th>Rate</th>
              <th>Capacity</th>
              <th>Rating</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {studios.map((studio) => (
              <tr key={studio._id} className="border-b border-base-200 hover:bg-base-200/40">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-base-200">
                      {studio.image ? (

                        <img
                          src={studio.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-base-content/30">
                          <LuBuilding2 aria-hidden className="size-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-heading font-semibold">
                        {studio.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-base-content/50">
                        <LuMapPin aria-hidden className="size-3" />
                        <span className="truncate">{studio.location}</span>
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {studio.category}
                  </span>
                </td>
                <td className="whitespace-nowrap font-semibold text-primary">
                  {formatHourlyRate(studio.hourlyRate)}
                </td>
                <td className="whitespace-nowrap text-base-content/70">
                  <span className="inline-flex items-center gap-1.5">
                    <LuUsers aria-hidden className="size-3.5" />
                    {studio.capacity}
                  </span>
                </td>
                <td className="whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-warning">
                    <LuStar aria-hidden className="size-3.5" />
                    {studio.rating.toFixed(1)}
                    <span className="font-normal text-base-content/40">
                      ({studio.reviewsCount})
                    </span>
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className="btn btn-ghost btn-sm gap-1.5 px-3 text-primary hover:bg-primary/10"
                    >
                      <LuPencil aria-hidden className="size-4" />
                      Update
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(studio)}
                      className="btn btn-ghost btn-sm gap-1.5 px-3 text-error hover:bg-error/10"
                    >
                      <LuTrash2 aria-hidden className="size-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="mt-4 grid gap-4 md:hidden">
        {studios.map((studio) => (
          <article
            key={studio._id}
            className="overflow-hidden rounded-2xl border border-base-300 bg-base-100"
          >
            <div className="flex gap-3 p-4">
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-base-200">
                {studio.image ? (

                  <Image
                    src={studio.image}
                    alt=""
                    fill
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-base-content/30">
                    <LuBuilding2 aria-hidden className="size-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  {studio.category}
                </span>
                <h3 className="mt-1.5 truncate font-heading font-semibold">
                  {studio.title}
                </h3>
                <p className="mt-0.5 truncate text-xs text-base-content/50">
                  {studio.location}
                </p>
                <p className="mt-1.5 text-sm font-bold text-primary">
                  {formatHourlyRate(studio.hourlyRate)}
                  <span className="ml-2 text-xs font-normal text-base-content/50">
                    + {formatMoney(studio.deposit)} deposit
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-2 border-t border-base-200 p-3">
              <Link
                href={`/studios/edit/${studio._id}`}
                className="btn btn-ghost btn-sm flex-1 gap-1.5 text-primary"
              >
                <LuPencil aria-hidden className="size-4" />
                Update
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(studio)}
                className="btn btn-ghost btn-sm flex-1 gap-1.5 text-error"
              >
                <LuTrash2 aria-hidden className="size-4" />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>


      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete this studio?"
        size="sm"
        busy={deleting}
      >
        <p className="text-sm leading-6 text-base-content/70">
          <strong>{deleteTarget?.title}</strong> will be permanently removed from
          MongoDB, along with its bookings and reviews. This can&apos;t be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
            className="btn btn-ghost rounded-full px-5"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={() => void confirmDelete()}
            disabled={deleting}
            className="btn btn-error gap-2 rounded-full px-5 font-semibold"
          >
            {deleting && <LuLoader aria-hidden className="size-4 animate-spin" />}
            {deleting ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}
