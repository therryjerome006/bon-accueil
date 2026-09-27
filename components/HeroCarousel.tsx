"use client";

import { ImageCarousel } from "@/components/ImageCarousel";
import type { ImageSlide } from "@/lib/site-images";

type HeroCarouselProps = {
  slides: ImageSlide[];
  intervalMs?: number;
};

export function HeroCarousel({ slides, intervalMs = 6000 }: HeroCarouselProps) {
  return (
    <ImageCarousel
      slides={slides}
      variant="hero"
      intervalMs={intervalMs}
      label="Photos de Bon Accueil Hotel"
      priority
    />
  );
}
