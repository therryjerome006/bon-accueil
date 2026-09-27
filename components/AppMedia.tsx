"use client";

import { useEffect, useRef } from "react";
import { AppImage } from "@/components/AppImage";
import { isVideoMediaUrl, normalizeImageUrl } from "@/lib/image-url";

type AppMediaProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
  /** Lecture auto pour les vidéos (muette, en boucle) */
  autoPlay?: boolean;
  /** Force lecture / pause (carrousels) */
  playing?: boolean;
};

export function AppMedia({
  src,
  alt,
  fill,
  sizes,
  priority,
  className,
  width,
  height,
  autoPlay = true,
  playing,
}: AppMediaProps) {
  const normalized = normalizeImageUrl(src);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = isVideoMediaUrl(normalized);

  useEffect(() => {
    if (!isVideo) return;
    const el = videoRef.current;
    if (!el) return;
    const shouldPlay = playing ?? autoPlay;
    if (shouldPlay) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isVideo, autoPlay, playing, normalized]);

  if (!normalized) return null;

  if (isVideo) {
    const videoClass = fill
      ? `absolute inset-0 h-full w-full object-cover ${className ?? ""}`
      : className;

    return (
      <video
        ref={videoRef}
        src={normalized}
        className={videoClass}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-label={alt}
      />
    );
  }

  return (
    <AppImage
      src={normalized}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      width={width}
      height={height}
    />
  );
}
