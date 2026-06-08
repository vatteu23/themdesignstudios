"use client";

import Image from "next/image";

export function isValidImageSrc(src?: string): boolean {
  if (!src?.trim()) return false;
  if (src.startsWith("/")) return true;
  try {
    const parsed = new URL(src);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

interface SafeImageProps {
  src?: string;
  alt: string;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
}

export default function SafeImage({
  src,
  alt,
  fill,
  className = "object-cover",
  containerClassName,
}: SafeImageProps) {
  if (!src || !isValidImageSrc(src)) {
    return (
      <div
        className={`flex items-center justify-center bg-stone-100 text-xs text-stone-400 ${
          fill ? "absolute inset-0" : "h-full w-full"
        } ${containerClassName ?? ""}`}
      >
        {src?.trim() ? "Invalid image URL" : "No image"}
      </div>
    );
  }

  const imageSrc = src;
  const useNextImage =
    imageSrc.startsWith("/") ||
    imageSrc.includes("firebasestorage.googleapis.com");

  if (useNextImage && fill) {
    return (
      <Image src={imageSrc} alt={alt} fill className={className} unoptimized />
    );
  }

  if (useNextImage && !fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        width={400}
        height={300}
        className={className}
        unoptimized
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full ${className}` : className}
    />
  );
}
