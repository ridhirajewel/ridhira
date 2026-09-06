"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  sourceUrl: string;
  altText?: string;
}

interface ProductGalleryProps {
  mainImage: string;
  mainImageAlt: string;
  galleryImages: GalleryImage[];
}

export default function ProductGallery({
  mainImage,
  mainImageAlt,
  galleryImages,
}: ProductGalleryProps) {
  // Combine main image + gallery images into one list so clicking a thumbnail
  // (including the "main" one) is consistent.
  const allImages: GalleryImage[] = [
    { sourceUrl: mainImage, altText: mainImageAlt },
    ...galleryImages,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = allImages[activeIndex] ?? allImages[0];

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-hairline bg-white">
        <Image
          src={activeImage.sourceUrl}
          alt={activeImage.altText || mainImageAlt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {allImages.map((img, index) => (
            <button
              key={`${img.sourceUrl}-${index}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`relative aspect-square overflow-hidden border transition ${
                activeIndex === index
                  ? "border-gold"
                  : "border-hairline hover:border-gold/50"
              }`}
            >
              <Image
                src={img.sourceUrl}
                alt={img.altText || `${mainImageAlt} thumbnail ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}