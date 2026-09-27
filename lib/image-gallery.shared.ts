export type ImageSlide = {
  src: string;
  alt: string;
};

/** @deprecated alias */
export type HeroSlide = ImageSlide;

export function firstImage(slides: ImageSlide[], fallback = ""): string {
  return slides[0]?.src ?? fallback;
}

export function imageUrls(slides: ImageSlide[]): string[] {
  return slides.map((s) => s.src);
}

export function urlsToSlides(urls: string[], alt: string): ImageSlide[] {
  return urls.map((src) => ({ src, alt }));
}
