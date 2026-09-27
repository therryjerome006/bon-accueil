"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageCarousel } from "@/components/ImageCarousel";
import type { ImageSlide } from "@/lib/site-images";

type PageHeroBannerProps = {
  eyebrow: string;
  title: string;
  description?: string;
  slides: ImageSlide[];
};

export function PageHeroBanner({ eyebrow, title, description, slides }: PageHeroBannerProps) {
  return (
    <section className="relative h-[52vh] min-h-[360px] max-h-[520px] flex items-end overflow-hidden">
      <ImageCarousel slides={slides} variant="hero" intervalMs={5500} label={title} priority />
      <div className="absolute inset-0 bg-gradient-to-t from-palm-deep/90 via-palm-deep/45 to-palm-deep/25 z-[1]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-12 md:pb-16 w-full text-linen">
        <Eyebrow inverted>{eyebrow}</Eyebrow>
        <h1 className="font-display text-3xl md:text-5xl mb-3 md:mb-5">{title}</h1>
        {description && <p className="text-palm-soft max-w-2xl leading-relaxed text-sm md:text-base">{description}</p>}
      </div>
    </section>
  );
}
