"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Instagram } from "lucide-react";

interface Reel {
  id: number;
  thumbnailUrl: string;
  videoUrl: string;
  alt?: string;
}

const mockReels: Reel[] = [
  {
    id: 1,
    thumbnailUrl: "/reels/reel-1.jpg",
    videoUrl: "https://wp.ridhira.in/wp-content/uploads/2026/09/WhatsApp-Video-2026-09-12-at-13.00.16.mp4",
    alt: "Model wearing gold rings, hands resting on fabric",
  },
  {
    id: 2,
    thumbnailUrl: "/reels/reel-2.jpg",
    videoUrl: "https://wp.ridhira.in/wp-content/uploads/2026/09/WhatsApp-Video-2026-09-12-at-13.00.15.mp4",
    alt: "Dried flowers styled on a neutral backdrop",
  },
  {
    id: 3,
    thumbnailUrl: "/reels/reel-3.jpg",
    videoUrl: "https://wp.ridhira.in/wp-content/uploads/2026/09/WhatsApp-Video-2026-09-12-at-12.59.55.mp4",
    alt: "Model wearing gold necklace and earrings",
  },
  // Ensure these local files actually exist in your Next.js public folder, 
  // or replace them with live WP URLs
  {
    id: 4,
    thumbnailUrl: "/reels/reel-4.jpg",
    videoUrl: "https://wp.ridhira.in/wp-content/uploads/2026/09/WhatsApp-Video-2026-09-12-at-13.00.15.mp4",
    alt: "Perfume bottle styled with dried flowers",
  },
  {
    id: 5,
    thumbnailUrl: "/reels/reel-5.jpg",
    videoUrl: "https://wp.ridhira.in/wp-content/uploads/2026/09/WhatsApp-Video-2026-09-12-at-12.59.55.mp4",
    alt: "Warm-lit interior detail shot",
  },
];

const angleStep = 360 / mockReels.length;
const radius = 250; 
const AUTOPLAY_INTERVAL_MS = 4000;

export default function GlowDiaryReels() {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const length = mockReels.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => setActive(((index % length) + length) % length),
    [length]
  );
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, length]);

  return (
    <section className="bg-neutral-50 py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6">
        <h2 className="text-center font-serif text-4xl font-bold tracking-tight text-neutral-900 lg:text-5xl">
          Glow Diary by Ridhira
        </h2>
        <p className="mt-3 text-center text-sm text-neutral-500 lg:text-base">
          Explore our collection in 3D
        </p>

        <div
          className="relative mx-auto mt-16 h-[340px] max-w-[520px] lg:h-[420px]"
          style={{ perspective: "1600px", transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {mockReels.map((reel, index) => {
              const targetRotation = (index - active) * angleStep;
              const normalized = ((targetRotation % 360) + 360) % 360;
              const isActive = normalized === 0;
              const angularDistance = Math.min(normalized, 360 - normalized);
              const opacity = isActive
                ? 1
                : Math.max(0.2, 1 - angularDistance / 180);

              return (
                <div
                  key={reel.id}
                  className="absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 lg:w-[260px]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "center center",
                    }}
                    animate={{ rotateY: targetRotation }}
                    transition={{ type: "spring", stiffness: 260, damping: 50 }}
                  >
                    <div
                      style={{
                        transform: `translateZ(${radius}px)`,
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <button
                        type="button"
                        aria-label={`Show reel ${index + 1}`}
                        onClick={() => goTo(index)}
                        className="block w-full"
                      >
                        <div
                          className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-200 ${
                            isActive
                              ? "shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)]"
                              : "shadow-none"
                          }`}
                          style={{ opacity }}
                        >
                          {/* If the reel is at the front, play the video. Otherwise, just show the image thumbnail. */}
                          {isActive ? (
                            <video
                              src={reel.videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <Image
                              src={reel.thumbnailUrl}
                              alt={reel.alt ?? `Reel ${index + 1}`}
                              fill
                              sizes="(max-width: 1024px) 220px, 260px"
                              className="object-cover"
                              priority={false}
                            />
                          )}

                          {isActive && (
                            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-rose-500 shadow-sm">
                              <Instagram
                                className="h-3.5 w-3.5"
                                strokeWidth={2}
                              />
                              Reel
                            </span>
                          )}
                        </div>
                      </button>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center justify-center gap-3">
          {/* Previous, Play/Pause, and Next buttons remain unchanged */}
          <button
            type="button"
            aria-label="Previous reel"
            onClick={goPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-100"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
            onClick={() => setIsPlaying((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-sm transition hover:bg-neutral-100"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" strokeWidth={2} />
            ) : (
              <Play className="ml-0.5 h-4 w-4" strokeWidth={2} />
            )}
          </button>
          <button
            type="button"
            aria-label="Next reel"
            onClick={goNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-100"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}