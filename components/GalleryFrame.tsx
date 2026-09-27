import { ImageCarousel } from "@/components/ImageCarousel";
import type { ImageSlide } from "@/lib/site-images";

type GalleryFrameProps = {
  slides: ImageSlide[];
  className?: string;
  variant?: "section" | "card";
  label?: string;
  priority?: boolean;
};

/** Conteneur dimensionné + carrousel */
export function GalleryFrame({
  slides,
  className = "relative w-full h-full min-h-[240px]",
  variant = "section",
  label,
  priority,
}: GalleryFrameProps) {
  if (slides.length === 0) return null;

  return (
    <div className={`rounded-sm overflow-hidden ${className}`}>
      <ImageCarousel
        slides={slides}
        variant={variant}
        label={label ?? slides[0]?.alt ?? "Galerie"}
        priority={priority}
      />
    </div>
  );
}
