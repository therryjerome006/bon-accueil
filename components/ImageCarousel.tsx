"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppMedia } from "@/components/AppMedia";
import { isVideoMediaUrl } from "@/lib/image-url";
import type { ImageSlide } from "@/lib/site-images";

type ImageCarouselProps = {
  slides: ImageSlide[];
  /** hero = plein écran | section = bloc contenu | card = carte compacte */
  variant?: "hero" | "section" | "card";
  intervalMs?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  label?: string;
};

export function ImageCarousel({
  slides,
  variant = "section",
  intervalMs = 5000,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  label = "Galerie photos",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const count = slides.length;
  const hasMultiple = count > 1;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (!hasMultiple) return;
      setIndex((next + count) % count);
    },
    [count, hasMultiple],
  );

  useEffect(() => {
    if (!hasMultiple || paused || reduceMotion) return;
    const id = window.setInterval(() => goTo(index + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [goTo, hasMultiple, index, intervalMs, paused, reduceMotion]);

  if (count === 0) return null;

  const isHero = variant === "hero";
  const isCard = variant === "card";

  const navBtnClass = isHero
    ? "bg-palm-deep/50 text-linen hover:bg-palm-deep/70"
    : "bg-white/80 text-palm-deep hover:bg-white shadow-sm";

  const dotActive = isHero ? "bg-linen" : "bg-palm-deep";
  const dotIdle = isHero ? "bg-linen/50 hover:bg-linen/80" : "bg-palm-deep/30 hover:bg-palm-deep/50";

  return (
    <div
      className={`overflow-hidden ${isHero ? "absolute inset-0 z-0" : "relative w-full h-full"} ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={label}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={`${slide.src}-${i}`}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
              active ? "opacity-100 z-[1]" : "opacity-0 z-0"
            }`}
            aria-hidden={!active}
          >
            {isVideoMediaUrl(slide.src) ? (
              <AppMedia
                src={slide.src}
                alt={slide.alt}
                fill
                priority={priority && i === 0}
                className="object-cover"
                playing={active}
              />
            ) : (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={priority && i === 0}
                sizes={isHero ? "100vw" : sizes}
                className={`object-cover ${
                  active && !reduceMotion && (isHero || variant === "section") ? "hero-ken-burns" : ""
                }`}
              />
            )}
          </div>
        );
      })}

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className={`absolute left-2 md:left-4 top-1/2 z-[2] -translate-y-1/2 rounded-full p-1.5 md:p-2 backdrop-blur-sm transition-colors ${navBtnClass}`}
            aria-label="Photo précédente"
          >
            <ChevronLeft size={isCard ? 18 : 22} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className={`absolute right-2 md:right-4 top-1/2 z-[2] -translate-y-1/2 rounded-full p-1.5 md:p-2 backdrop-blur-sm transition-colors ${navBtnClass}`}
            aria-label="Photo suivante"
          >
            <ChevronRight size={isCard ? 18 : 22} />
          </button>

          <div
            className={`absolute left-1/2 z-[2] flex -translate-x-1/2 gap-1.5 ${
              isHero ? "bottom-8" : isCard ? "bottom-2" : "bottom-3"
            }`}
          >
            {slides.map((slide, i) => (
              <button
                key={`dot-${slide.src}-${i}`}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? `w-5 ${dotActive}` : `w-1.5 ${dotIdle}`
                }`}
                aria-label={`Photo ${i + 1} sur ${count}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
