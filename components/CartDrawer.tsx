"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/format";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCartDrawer, removeFromCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <div
      className={`fixed inset-0 z-[70] ${isCartOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isCartOpen}
    >
      <div
        onClick={closeCartDrawer}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2 className="font-serif text-xl text-ink">
            Your Selection{" "}
            <span className="text-sm font-sans text-bark/60">
              ({cart.itemsCount})
            </span>
          </h2>
          <button
            onClick={closeCartDrawer}
            aria-label="Close cart"
            className="rounded-full p-1.5 text-ink/70 transition hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <p className="font-serif text-lg text-ink">Your selection is empty</p>
              <p className="text-sm text-bark/60">
                Pieces you add will gather here, ready when you are.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-hairline">
              {cart.items.map((item) => (
                <li key={item.key} className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-white">
                    <Image
                      src={item.image.sourceUrl}
                      alt={item.image.altText}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-[15px] text-ink">{item.name}</p>
                      <p className="mt-0.5 text-sm text-bark/60">
                        Qty {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink">
                        {formatMoney(item.subtotal)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="flex items-center gap-1 text-xs uppercase tracking-wide text-bark/60 transition hover:text-oxblood"
                      >
                        <Minus size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-hairline px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-[15px] text-ink">
              <span>Subtotal</span>
              <span className="font-serif text-lg">
                {formatMoney(cart.subtotal)}
              </span>
            </div>
            <button className="w-full bg-ink py-3.5 text-sm uppercase tracking-[0.14em] text-ivory transition hover:bg-gold">
              Proceed to Checkout
            </button>
            <p className="mt-3 text-center text-xs text-bark/50">
              Shipping and taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
