"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
}

interface HeroSliderProps {
  desktopSlides: Slide[];
  mobileSlides: Slide[];
  link: string;
}

export default function HeroSlider({ desktopSlides, mobileSlides, link }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (desktopSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % desktopSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [desktopSlides.length]);

  return (
    <section className="relative isolate w-full overflow-hidden bg-ink">
      
      {/* ── MOBILE VIEW (Hidden on screens larger than 'sm') ── */}
      <div className="relative aspect-[4/5] w-full sm:hidden">
        {mobileSlides.map((slide, index) => (
          <a
            key={index}
            href={link}
            tabIndex={index === currentIndex ? 0 : -1}
            aria-hidden={index !== currentIndex}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-0" : "pointer-events-none opacity-0 -z-10"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={90}
              className="object-cover"
            />
          </a>
        ))}
      </div>

      {/* ── DESKTOP VIEW (Hidden on mobile screens) ── */}
      <div className="relative hidden w-full sm:block sm:aspect-[3/1]">
        {desktopSlides.map((slide, index) => (
          <a
            key={index}
            href={link}
            tabIndex={index === currentIndex ? 0 : -1}
            aria-hidden={index !== currentIndex}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-0" : "pointer-events-none opacity-0 -z-10"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={90}
              className="object-cover"
            />
          </a>
        ))}
      </div>

      {/* ── DOT INDICATORS (Shared across both views) ── */}
      {desktopSlides.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2 sm:bottom-4">
          {desktopSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all sm:h-2 ${
                index === currentIndex ? "w-5 bg-gold sm:w-6" : "w-1.5 bg-ivory/60 sm:w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
    </section>
  );
}