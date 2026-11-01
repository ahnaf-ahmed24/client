"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Keyboard, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import type { IconType } from "react-icons";
import { LuCamera, LuMic, LuRocket } from "react-icons/lu";
import Image from "next/image";


interface HeroSlide {
  icon: IconType;
  badge: string;
  headline: React.ReactNode;
  text: string;
  image: string;
  alt: string;
}

const unsplash = (id: string, size = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${size}&q=80`;

const SLIDES: HeroSlide[] = [
  {
    icon: LuCamera,
    badge: "For photographers",
    headline: (
      <>
        Shoot in lofts <span className="text-gradient">built for light</span>.
      </>
    ),
    text: "Cyc walls, layered backdrops and pro lighting — booked by the hour, ready the moment you walk in.",
    image: unsplash("1516035069371-29a1b244cc32"), 
    alt: "A professional camera with three prime lenses laid out on a dark table",
  },
  {
    icon: LuMic,
    badge: "For podcasters & musicians",
    headline: (
      <>
        Rooms that sound <span className="text-gradient">as good as they look</span>.
      </>
    ),
    text: "Soundproofed booths, live rooms and mixing consoles — press record in total comfort.",
    image: unsplash("1478737270239-2f02b77fc618"), 
    alt: "A studio condenser microphone in a dimly lit recording live room",
  },
  {
    icon: LuRocket,
    badge: "For studio owners",
    headline: (
      <>
        Your space. Every hour, <span className="text-gradient">earning</span>.
      </>
    ),
    text: "List once, set your own rate, and turn idle hours into steady, stress-free income.",
    image: unsplash("1500462918059-b1a0cb512f1d"), 
    alt: "A studio corridor glowing with pink and blue neon stage lighting",
  },
];

export default function HeroSlider() {
  return (
    <div className="panel-dark relative h-[30rem] overflow-hidden rounded-[2rem] shadow-xl shadow-base-300/60 sm:h-[34rem]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Keyboard]}
        className="h-full w-full"
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        keyboard={{ enabled: true }}
        autoplay={{ delay: 5200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
      >
        {SLIDES.map(({ icon: Icon, badge, headline, text, image, alt }) => (
          <SwiperSlide key={badge}>
            {/* High-res visual + overlay for text legibility */}
            <Image
              src={image}
              alt={alt}
              fill
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="hero-overlay absolute inset-0" aria-hidden />
            <div className="panel-grid absolute inset-0 opacity-60" aria-hidden />

            <div className="container-page relative flex h-full items-center">
              <div className="max-w-2xl pb-16 pt-6 sm:pt-10">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                  <Icon aria-hidden className="size-4" />
                  {badge}
                </span>

                <h2 className="mt-6 font-heading text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {headline}
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                  {text}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/studios"
                    className="btn btn-primary rounded-full px-7 font-medium"
                  >
                    Explore Studios
                  </Link>
                  <Link
                    href="/studios"
                    className="btn btn-ghost rounded-full border border-white/20 px-7 font-medium text-white hover:bg-white/10"
                  >
                    Host Your Space
                  </Link>
                </div>
              </div>

              <Icon
                aria-hidden
                className="pointer-events-none absolute right-0 top-1/2 hidden size-72 -translate-y-1/2 rotate-12 text-white/10 lg:block"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
