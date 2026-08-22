"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/format";

export default function QuickView() {
  const { quickViewProduct, closeQuickView, addToCart } = useCart();
  const isOpen = Boolean(quickViewProduct);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!quickViewProduct) return null;
  const product = quickViewProduct;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        onClick={closeQuickView}
        className="absolute inset-0 bg-ink/50"
        aria-hidden
      />
      <div className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden bg-ivory shadow-2xl sm:grid-cols-2">
        <button
          onClick={closeQuickView}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 rounded-full bg-ivory/90 p-1.5 text-ink transition hover:bg-gold hover:text-ivory"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="relative aspect-square sm:aspect-auto">
          <Image
            src={product.images[0].sourceUrl}
            alt={product.images[0].altText}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center p-8">
          <p className="text-[11px] uppercase tracking-[0.1em] text-bark/50">
            {product.categories[0]?.name}
          </p>
          <h3 className="mt-2 font-serif text-2xl text-ink">{product.name}</h3>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg text-ink">{formatMoney(product.price)}</span>
            {product.onSale && (
              <span className="text-sm text-bark/40 line-through">
                {formatMoney(product.regularPrice)}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-bark/70">
            {product.shortDescription}
          </p>

          {product.attributes.length > 0 && (
            <div className="mt-5">
              {product.attributes.map((attr) => (
                <div key={attr.id}>
                  <p className="mb-2 text-xs uppercase tracking-wide text-bark/50">
                    {attr.name}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {attr.options.map((opt) => (
                      <button
                        key={opt}
                        className="border border-hairline px-3 py-1.5 text-sm text-ink transition hover:border-gold hover:text-gold"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              addToCart(product.databaseId);
              closeQuickView();
            }}
            className="mt-7 bg-ink py-3.5 text-sm uppercase tracking-[0.14em] text-ivory transition hover:bg-gold"
          >
            Add to Cart
          </button>
          <a
            href={`/products/${product.slug}`}
            className="mt-3 text-center text-xs uppercase tracking-wide text-bark/60 underline-offset-4 hover:underline"
          >
            View Full Details
          </a>
        </div>
      </div>
    </div>
  );
}
