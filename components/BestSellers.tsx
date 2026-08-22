"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { products } from "@/lib/mock-data";
import ProductCard from "./ProductCard";

export default function BestSellers() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">
              As worn, as reordered
            </p>
            <h2 className="font-serif text-[32px] text-ink lg:text-[40px]">
              Best Sellers
            </h2>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="rounded-full border border-hairline p-2.5 text-ink transition hover:border-gold hover:text-gold"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="rounded-full border border-hairline p-2.5 text-ink transition hover:border-gold hover:text-gold"
            >
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Mobile: horizontal snap scroller. Desktop: static grid. */}
        <div
          ref={scrollerRef}
          className="grid grid-flow-col auto-cols-[75%] gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] snap-x snap-mandatory sm:auto-cols-[42%] sm:[&::-webkit-scrollbar]:hidden lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-4 lg:overflow-visible"
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start lg:snap-none">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="/best-sellers"
            className="border border-ink px-8 py-3.5 text-[13px] uppercase tracking-[0.12em] text-ink transition hover:bg-ink hover:text-ivory"
          >
            View All Best Sellers
          </a>
        </div>
      </div>
    </section>
  );
}
