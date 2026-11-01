"use client";

import Link from "next/link";
import { toast } from "sonner";
import { LuArrowRight, LuCamera, LuHeart, LuMapPin, LuStar } from "react-icons/lu";
import { useAuth } from "@/providers/AuthProvider";
import type { Studio, StudioCategory } from "@/lib/types";
import { formatHourlyRate, formatMoney } from "@/lib/format";
import { CATEGORY_ICONS } from "./categoryIcons";
import Image from "next/image";

interface StudioCardProps {
  studio: Studio;
}

export default function StudioCard({ studio }: StudioCardProps) {
  const { wishlistIds, toggleWishlist } = useAuth();
  const saved = wishlistIds.includes(studio._id);

  const PlaceholderIcon =
    CATEGORY_ICONS[studio.category as StudioCategory] ?? LuCamera;

  const handleWishlist = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      const added = await toggleWishlist(studio);
      toast.success(added ? "Saved to your wishlist." : "Removed from your wishlist.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update your wishlist. Try again."
      );
    }
  };

  return (
    <article className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100">
      <div className="relative aspect-[4/3] overflow-hidden bg-linear-to-br from-base-200 to-base-300">
        {studio.image ? (
          <Image
            src={studio.image}
            alt={studio.title}
            fill
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <PlaceholderIcon aria-hidden className="size-14 text-base-content/20" />
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-content shadow-sm">
          {studio.category}
        </span>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-base-100/90 shadow-sm backdrop-blur transition-colors ${
            saved ? "text-error" : "text-base-content/60 hover:text-error"
          }`}
        >
          <LuHeart aria-hidden className={`size-4.5 ${saved ? "scale-110" : ""}`} />
        </button>
      </div>

  
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
            <LuStar aria-hidden className="size-3.5" />
            {studio.rating.toFixed(1)}
            <span className="font-normal opacity-80">({studio.reviewsCount})</span>
          </span>
          <span className="truncate text-xs text-base-content/50">
            {studio.capacity} guests max
          </span>
        </div>

        <h3 className="font-heading text-lg font-semibold leading-snug">
          {studio.title}
        </h3>

        <p className="flex items-start gap-1.5 text-xs leading-5 text-base-content/60">
          <LuMapPin aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {studio.location}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {studio.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="rounded-md bg-base-200 px-2 py-0.5 text-[11px] text-base-content/70"
            >
              {amenity}
            </span>
          ))}
          {studio.amenities.length > 3 && (
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              +{studio.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-base-200 pt-4">
          <div>
            <span className="font-heading text-xl font-bold text-primary">
              {formatHourlyRate(studio.hourlyRate)}
            </span>
            <span className="block text-[11px] text-base-content/50">
              + {formatMoney(studio.deposit)} refundable deposit
            </span>
          </div>
          <Link
            href={`/studios/${studio._id}`}
            className="btn btn-ghost btn-sm gap-1.5 rounded-full px-3 font-medium text-primary hover:bg-primary/10"
          >
            View Details
            <LuArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
