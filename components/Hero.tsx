"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const slides: Slide[] = [
  {
    id: "slide-1",
    eyebrow: "The Winter Edit",
    title: "Weight that feels\nlike intention.",
    subtitle:
      "Solid gold pieces, cast and finished by hand in small batches — nothing plated, nothing rushed.",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1800&auto=format&fit=crop",
    alt: "Model wearing layered gold jewellery",
    primaryCta: { label: "Shop the Edit", href: "/new-arrivals" },
    secondaryCta: { label: "Our Story", href: "/our-story" },
  },
  {
    id: "slide-2",
    eyebrow: "Bridal 2026",
    title: "Set once,\nworn for life.",
    subtitle:
      "Bespoke bridal sets built around a stone you already own, or one we source together.",
    image:
      "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?q=80&w=1800&auto=format&fit=crop",
    alt: "Bridal jewellery set close-up",
    primaryCta: { label: "View Bridal", href: "/collections/bridal" },
    secondaryCta: { label: "Book a Consult", href: "/contact" },
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const next = useCallback(() => setActive((i) => (i + 1) % slides.length), []);
  const prev = useCallback(
    () => setActive((i) => (i - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [isPlaying, next]);

  const slide = slides[active];

  return (
    <section className="relative h-[560px] w-full overflow-hidden sm:h-[620px] lg:h-[720px]">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt={s.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/20 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-center px-5 lg:px-10">
        <div className="max-w-xl">
          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.2em] text-gold-light">
            {slide.eyebrow}
          </p>
          <h1 className="whitespace-pre-line font-serif text-[38px] leading-[1.08] text-ivory sm:text-[48px] lg:text-[58px]">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ivory/85">
            {slide.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={slide.primaryCta.href}
              className="bg-ivory px-7 py-3.5 text-[13px] uppercase tracking-[0.12em] text-ink transition hover:bg-gold hover:text-ivory"
            >
              {slide.primaryCta.label}
            </a>
            <a
              href={slide.secondaryCta.href}
              className="border border-ivory/60 px-7 py-3.5 text-[13px] uppercase tracking-[0.12em] text-ivory transition hover:border-ivory hover:bg-ivory/10"
            >
              {slide.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-ivory/30 p-2.5 text-ivory transition hover:bg-ivory/10 sm:flex"
      >
        <ArrowLeft size={18} strokeWidth={1.5} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-ivory/30 p-2.5 text-ivory transition hover:bg-ivory/10 sm:flex"
      >
        <ArrowRight size={18} strokeWidth={1.5} />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        <button
          onClick={() => setIsPlaying((v) => !v)}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          className="text-ivory/80 transition hover:text-ivory"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-ivory" : "w-1.5 bg-ivory/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
