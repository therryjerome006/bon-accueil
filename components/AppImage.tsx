import NextImage from "next/image";
import { isExternalImageUrl, normalizeImageUrl } from "@/lib/image-url";

type AppImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
};

/**
 * Affiche une image locale (/public) ou une URL publique externe (https://…).
 * Les URLs externes utilisent <img> natif pour éviter la whitelist Next/Image.
 */
export function AppImage({
  src,
  alt,
  fill,
  sizes,
  priority,
  className,
  width,
  height,
}: AppImageProps) {
  const normalized = normalizeImageUrl(src);

  if (!normalized) return null;

  if (isExternalImageUrl(normalized)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={normalized}
          alt={alt}
          className={className}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={normalized}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <NextImage
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
