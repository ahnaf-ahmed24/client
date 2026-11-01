"use client";

import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { IconType } from "react-icons";
import Image from "next/image";

interface StudioGalleryProps {
  images: string[];
  title: string;
  fallbackIcon: IconType;
}


export default function StudioGallery({
  images,
  title,
  fallbackIcon: Placeholder,
}: StudioGalleryProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  if (count === 0) {
    return (
      <div className="grid aspect-[16/10] w-full place-items-center overflow-hidden rounded-[1.75rem] border border-base-300 bg-base-200">
        <Placeholder aria-hidden className="size-16 text-base-content/20" />
      </div>
    );
  }

  const step = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <figure className="overflow-hidden rounded-[1.75rem] border border-base-300 bg-base-200">
      <div
        className="relative aspect-[16/10] w-full overflow-hidden"
        tabIndex={count > 1 ? 0 : undefined}
        role={count > 1 ? "region" : undefined}
        aria-label={count > 1 ? `${title} photo gallery` : undefined}
        onKeyDown={(event) => {
          if (count < 2) return;
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
        }}
      >
        <Image
          key={images[index]}
          src={images[index]}
          fill
          alt={`${title} — photo ${index + 1} of ${count}`}
          className="h-full w-full object-cover"
          loading={index === 0 ? "eager" : "lazy"}
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="gallery-arrow gallery-arrow-prev"
            >
              <LuChevronLeft aria-hidden className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="gallery-arrow gallery-arrow-next"
            >
              <LuChevronRight aria-hidden className="size-5" />
            </button>
            <span className="absolute bottom-3 right-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul
          className="flex gap-2 overflow-x-auto border-t border-base-300 bg-base-100 p-2"
          aria-label="Photo thumbnails"
        >
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                aria-label={`${title} — thumbnail ${i + 1}`}
                className={`gallery-thumb block aspect-video w-20 overflow-hidden rounded-lg border-2 border-transparent transition ${
                  i === index ? "opacity-100" : "opacity-55 hover:opacity-90"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
