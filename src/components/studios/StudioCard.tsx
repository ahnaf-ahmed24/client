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
    <article className="card-hover group relative flex flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 hover:border-primary/40">
      <div className="relative aspect-[4/3] overflow-hidden bg-linear-to-br from-base-200 to-base-300">
        {studio.image ? (
          <Image
            src={studio.image}
            alt={studio.title}
            fill
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <PlaceholderIcon aria-hidden className="size-14 text-base-content/20" />
          </div>
        )}

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="rounded-full bg-base-100/90 px-3 py-1 text-xs font-semibold text-base-content shadow-sm backdrop-blur">
            {studio.category}
          </span>

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            aria-pressed={saved}
            className={`grid size-9 shrink-0 place-items-center rounded-full bg-base-100/90 shadow-sm backdrop-blur transition-colors ${
              saved ? "text-error" : "text-base-content/60 hover:text-error"
            }`}
          >
            <LuHeart aria-hidden className={`size-4.5 ${saved ? "scale-110" : ""}`} />
          </button>
        </div>

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-base-100/90 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur">
          <LuStar aria-hidden className="size-3.5 text-warning" />
          {studio.rating.toFixed(1)}
          <span className="font-normal text-base-content/60">({studio.reviewsCount})</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-semibold leading-snug transition-colors duration-300 group-hover:text-primary">
          {studio.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-base-content/55">
          <span className="inline-flex items-center gap-1.5">
            <LuMapPin aria-hidden className="size-3.5 shrink-0 text-primary/70" />
            {studio.location}
          </span>
          <span>{studio.capacity} guests max</span>
        </div>

        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {studio.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-base-200 px-2.5 py-0.5 text-[11px] text-base-content/70"
            >
              {amenity}
            </span>
          ))}
          {studio.amenities.length > 3 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              +{studio.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3 border-t border-base-200 pt-4">
            <div>
              <p className="font-heading text-xl font-bold text-primary">
                {formatHourlyRate(studio.hourlyRate)}
              </p>
              <p className="mt-0.5 text-[11px] text-base-content/50">
                + {formatMoney(studio.deposit)} refundable deposit
              </p>
            </div>
            <Link
              href={`/studios/${studio._id}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-base-200 px-4 py-2 text-xs font-semibold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content"
            >
              View Details
              <LuArrowRight
                aria-hidden
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
