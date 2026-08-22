// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

// // Mock WooCommerce Data Interface
// interface Reel {
//   id: string;
//   thumbnailUrl: string;
//   videoUrl?: string;
// }

// const mockReels: Reel[] = [
//   { id: "1", thumbnailUrl: "https://images.unsplash.com/photo-1599643478524-fb524c08c450?q=80&w=800&auto=format&fit=crop" },
//   { id: "2", thumbnailUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop" },
//   { id: "3", thumbnailUrl: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?q=80&w=800&auto=format&fit=crop" },
//   { id: "4", thumbnailUrl: "https://images.unsplash.com/photo-1573408301145-b961053b925b?q=80&w=800&auto=format&fit=crop" },
//   { id: "5", thumbnailUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop" },
// ];

// export default function GlowDiaryReels() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % mockReels.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev - 1 + mockReels.length) % mockReels.length);
//   };

//   // Calculates the 3D position of each card relative to the active index
//   const getCardStyles = (index: number) => {
//     let relativeIndex = index - currentIndex;
    
//     // Wrap around logic for infinite loop
//     if (relativeIndex < -Math.floor(mockReels.length / 2)) relativeIndex += mockReels.length;
//     if (relativeIndex > Math.floor(mockReels.length / 2)) relativeIndex -= mockReels.length;

//     if (relativeIndex === 0) {
//       // Center (Active)
//       return { x: 0, rotateY: 0, scale: 1, zIndex: 30, opacity: 1 };
//     } else if (relativeIndex === -1) {
//       // Left
//       return { x: "-85%", rotateY: 65, scale: 0.85, zIndex: 20, opacity: 1 };
//     } else if (relativeIndex === 1) {
//       // Right
//       return { x: "85%", rotateY: -65, scale: 0.85, zIndex: 20, opacity: 1 };
//     } else {
//       // Hidden behind
//       return { 
//         x: relativeIndex < 0 ? "-150%" : "150%", 
//         rotateY: relativeIndex < 0 ? 90 : -90, 
//         scale: 0.5, 
//         zIndex: 0, 
//         opacity: 0 
//       };
//     }
//   };

//   return (
//     <section className="bg-[#fafafa] py-20 overflow-hidden">
//       <div className="text-center mb-12">
//         <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-3 tracking-tight">
//           Glow Diary by Ridhira
//         </h2>
//         <p className="text-gray-500 text-[11px] tracking-[0.2em] uppercase">
//           Explore our collection in 3D
//         </p>
//       </div>

//       {/* 3D Carousel Container */}
//       {/* The perspective utility is strictly required to render the 3D depth */}
//       <div className="relative w-full max-w-5xl mx-auto h-[450px] lg:h-[550px] flex justify-center items-center" style={{ perspective: "1200px" }}>
//         {mockReels.map((reel, index) => {
//           const styles = getCardStyles(index);
//           const isActive = index === currentIndex;

//           return (
//             <motion.div
//               key={reel.id}
//               className="absolute w-[260px] h-[400px] lg:w-[300px] lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl bg-white cursor-pointer"
//               initial={false}
//               animate={{
//                 x: styles.x,
//                 rotateY: styles.rotateY,
//                 scale: styles.scale,
//                 zIndex: styles.zIndex,
//                 opacity: styles.opacity,
//               }}
//               transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
//               onClick={() => {
//                 if (styles.x === "-85%") prevSlide();
//                 if (styles.x === "85%") nextSlide();
//               }}
//               style={{ transformStyle: "preserve-3d" }}
//             >
//               <Image
//                 src={reel.thumbnailUrl}
//                 alt="Reel thumbnail"
//                 fill
//                 className="object-cover"
//                 sizes="(max-width: 768px) 100vw, 33vw"
//               />
              
//               {/* Play Button Overlay for Active Card */}
//               {isActive && (
//                 <div className="absolute inset-0 bg-black/5 flex items-center justify-center transition-colors hover:bg-black/20">
//                   <button className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform hover:scale-105">
//                     <Play className="w-5 h-5 text-gray-900 ml-1" fill="currentColor" />
//                   </button>
//                 </div>
//               )}

//               {/* Reel Badge Top Right */}
//               <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
//                  <Play className="w-2.5 h-2.5 text-red-500" fill="currentColor" />
//                  <span className="text-[11px] font-semibold text-gray-800">Reel</span>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Navigation Controls */}
//       <div className="flex justify-center items-center gap-5 mt-10">
//         <button onClick={prevSlide} className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition border border-gray-200">
//           <ChevronLeft className="w-5 h-5 text-gray-600 pr-0.5" />
//         </button>
//         <button className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition border border-gray-200">
//           <Pause className="w-4 h-4 text-gray-600" fill="currentColor" />
//         </button>
//         <button onClick={nextSlide} className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition border border-gray-200">
//           <ChevronRight className="w-5 h-5 text-gray-600 pl-0.5" />
//         </button>
//       </div>
//     </section>
//   );
// }


"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Instagram } from "lucide-react";

/**
 * Reel data shape. Swap `mockReels` for a real fetch from a headless CMS
 * or WordPress (e.g. a custom REST route or ACF/GraphQL field returning
 * reel media) — the carousel only needs `id`, `thumbnailUrl`, and `videoUrl`.
 */
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
    videoUrl: "/reels/reel-1.mp4",
    alt: "Model wearing gold rings, hands resting on fabric",
  },
  {
    id: 2,
    thumbnailUrl: "/reels/reel-2.jpg",
    videoUrl: "/reels/reel-2.mp4",
    alt: "Dried flowers styled on a neutral backdrop",
  },
  {
    id: 3,
    thumbnailUrl: "/reels/reel-3.jpg",
    videoUrl: "/reels/reel-3.mp4",
    alt: "Model wearing gold necklace and earrings",
  },
  {
    id: 4,
    thumbnailUrl: "/reels/reel-4.jpg",
    videoUrl: "/reels/reel-4.mp4",
    alt: "Perfume bottle styled with dried flowers",
  },
  {
    id: 5,
    thumbnailUrl: "/reels/reel-5.jpg",
    videoUrl: "/reels/reel-5.mp4",
    alt: "Warm-lit interior detail shot",
  },
];

// --- Cylinder math ---------------------------------------------------
// Every reel sits at a fixed angle around a ring. Rotating the ring
// (changing which reel is "active") spins reels into and out of the
// front face, rather than sliding them left/right.
//
// Rather than animating rotateY and translateZ on the SAME element (which
// depends on framer-motion composing them in a specific order — rotate,
// then translate along the newly-rotated axis — and is easy to get wrong),
// we split responsibilities across parent/child:
//   - the OUTER motion.div only animates rotateY (this rotates the local
//     3D coordinate space; completely standard, nothing fragile about it)
//   - the INNER plain div has a fixed, unanimated translateZ(radius)
// Because a child's transform always applies inside its parent's already-
// transformed coordinate space, nesting guarantees "rotate, then push out
// along the rotated axis" automatically — which is exactly what puts each
// reel on a circle, facing outward.
const angleStep = 360 / mockReels.length;
const radius = 250; // distance each reel sits from the ring's center; tune alongside card width

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

        {/* Perspective wrapper — this is what makes rotateY/translateZ read as real depth */}
        <div
          className="relative mx-auto mt-16 h-[340px] max-w-[520px] lg:h-[420px]"
          style={{ perspective: "1600px", transformStyle: "preserve-3d" }}
        >
          {/* Ring container: shares the same 3D space as its reel children */}
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
                // Plain centering wrapper — position only, never animated,
                // so it can't collide with the motion.div's own transform.
                <div
                  key={reel.id}
                  className="absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 lg:w-[260px]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Rotates the ring — the ONLY animated transform here */}
                  <motion.div
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "center center",
                    }}
                    animate={{ rotateY: targetRotation }}
                    transition={{ type: "spring", stiffness: 260, damping: 50 }}
                  >
                    {/* Pushes the reel outward along the now-rotated Z
                        axis. Fixed value, never animated — radius doesn't
                        change, only which reel is at the front does. */}
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
                          <Image
                            src={reel.thumbnailUrl}
                            alt={reel.alt ?? `Reel ${index + 1}`}
                            fill
                            sizes="(max-width: 1024px) 220px, 260px"
                            className="object-cover"
                            priority={isActive}
                          />

                          {isActive && (
                            <>
                              {/* Reel badge */}
                              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-rose-500 shadow-sm">
                                <Instagram
                                  className="h-3.5 w-3.5"
                                  strokeWidth={2}
                                />
                                Reel
                              </span>

                              {/* Center play button */}
                              <span className="absolute inset-0 flex items-center justify-center">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md">
                                  <Play
                                    className="ml-0.5 h-5 w-5 text-neutral-900"
                                    strokeWidth={2}
                                    fill="currentColor"
                                  />
                                </span>
                              </span>
                            </>
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