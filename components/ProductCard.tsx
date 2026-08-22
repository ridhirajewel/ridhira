"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, Search, Star } from "lucide-react";
import type { Product } from "@/types/woocommerce";
import { calculateDiscountPercent, formatMoney } from "@/lib/format";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const LENS_SIZE = 96;
const ZOOM = 2.2;

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openQuickView } = useCart();
  const frameRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [bgPos, setBgPos] = useState("50% 50%");

  const discount = calculateDiscountPercent(product.regularPrice, product.salePrice);
  const secondaryImage = product.images[1] ?? product.images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setLens({
      x: Math.min(Math.max(x - LENS_SIZE / 2, 0), rect.width - LENS_SIZE),
      y: Math.min(Math.max(y - LENS_SIZE / 2, 0), rect.height - LENS_SIZE),
    });
    setBgPos(`${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`);
  };

  return (
    <div className="group flex flex-col">
      <div
        ref={frameRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setLens(null)}
        className="relative aspect-[4/5] w-full cursor-crosshair overflow-hidden bg-white"
      >
        <Image
          src={product.images[0].sourceUrl}
          alt={product.images[0].altText}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <Image
          src={secondaryImage.sourceUrl}
          alt={secondaryImage.altText}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Loupe reveal — jeweler's-loupe styled magnifier, desktop only */}
        {lens && (
          <div
            className="pointer-events-none absolute z-10 hidden rounded-full border-2 border-gold shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.25)] lg:block"
            style={{
              width: LENS_SIZE,
              height: LENS_SIZE,
              left: lens.x,
              top: lens.y,
              backgroundImage: `url(${product.images[0].sourceUrl})`,
              backgroundSize: `${ZOOM * 100}%`,
              backgroundPosition: bgPos,
              backgroundRepeat: "no-repeat",
            }}
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-bottle px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-ivory">
              New
            </span>
          )}
          {discount && (
            <span className="bg-oxblood px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-ivory">
              -{discount}%
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => openQuickView(product)}
            aria-label={`Quick view ${product.name}`}
            className="rounded-full bg-ivory/95 p-2 text-ink shadow-sm transition hover:bg-gold hover:text-ivory"
          >
            <Search size={15} strokeWidth={1.5} />
          </button>
        </div>

        <button
          onClick={() => addToCart(product.databaseId)}
          className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 bg-ink py-2.5 text-[12px] uppercase tracking-[0.1em] text-ivory opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-gold"
        >
          <Plus size={14} strokeWidth={2} />
          Quick Add
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <p className="text-[11px] uppercase tracking-[0.1em] text-bark/50">
          {product.categories[0]?.name}
        </p>
        <a
          href={`/products/${product.slug}`}
          className="text-[15px] text-ink transition hover:text-gold"
        >
          {product.name}
        </a>
        <div className="flex items-center gap-2">
          <span className="text-[15px] text-ink">{formatMoney(product.price)}</span>
          {product.onSale && (
            <span className="text-sm text-bark/40 line-through">
              {formatMoney(product.regularPrice)}
            </span>
          )}
        </div>
        {product.averageRating && (
          <div className="mt-0.5 flex items-center gap-1">
            <Star size={12} className="fill-gold text-gold" />
            <span className="text-xs text-bark/60">
              {product.averageRating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
