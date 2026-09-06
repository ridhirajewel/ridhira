"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductActionsProps {
  databaseId: number;
}

type ButtonStatus = "idle" | "loading" | "success" | "error";

export default function ProductActions({ databaseId }: ProductActionsProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [cartStatus, setCartStatus] = useState<ButtonStatus>("idle");
  const [buyStatus, setBuyStatus] = useState<ButtonStatus>("idle");

  const resetAfterDelay = (
    setter: React.Dispatch<React.SetStateAction<ButtonStatus>>
  ) => {
    setTimeout(() => setter("idle"), 2000);
  };

  const handleAddToCart = async () => {
    if (cartStatus === "loading") return;

    setCartStatus("loading");
    try {
      if (typeof addToCart !== "function") {
        throw new Error("addToCart is not available from CartContext");
      }
      await addToCart(databaseId);
      setCartStatus("success");
    } catch (err) {
      console.error("Add to cart failed:", err);
      setCartStatus("error");
    } finally {
      resetAfterDelay(setCartStatus);
    }
  };

  const handleBuyNow = async () => {
    if (buyStatus === "loading") return;

    setBuyStatus("loading");
    try {
      if (typeof addToCart !== "function") {
        throw new Error("addToCart is not available from CartContext");
      }

      await addToCart(databaseId);

      // A hard navigation (window.location.href) reloads the document before
      // React has a chance to flush state, wiping whatever addToCart just wrote
      // to localStorage. A tiny delay plus a client-side router.push avoids the
      // reload entirely, so the cart write survives the navigation.
      await new Promise((resolve) => setTimeout(resolve, 150));
      router.push("/checkout");
    } catch (err) {
      console.error("Buy now failed:", err);
      setBuyStatus("error");
      resetAfterDelay(setBuyStatus);
    }
  };

  const cartLabel =
    cartStatus === "loading"
      ? "Adding..."
      : cartStatus === "success"
      ? "Added!"
      : cartStatus === "error"
      ? "Try Again"
      : "Add to Cart";

  const buyLabel =
    buyStatus === "loading"
      ? "Processing..."
      : buyStatus === "error"
      ? "Try Again"
      : "Buy Now";

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Add to Cart — outlined */}
      <button
        onClick={handleAddToCart}
        disabled={cartStatus === "loading"}
        className="
          flex flex-1 items-center justify-center gap-2 border border-ink
          bg-transparent px-6 py-4 text-[12px] font-medium uppercase tracking-[0.2em]
          text-ink transition hover:bg-ink hover:text-white
          disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        {cartStatus === "loading" && (
          <Loader2 size={14} className="animate-spin" strokeWidth={2} />
        )}
        {cartStatus === "success" && <Check size={14} strokeWidth={2} />}
        {cartLabel}
      </button>

      {/* Buy Now — solid */}
      <button
        onClick={handleBuyNow}
        disabled={buyStatus === "loading"}
        className="
          flex flex-1 items-center justify-center gap-2 border border-ink
          bg-ink px-6 py-4 text-[12px] font-medium uppercase tracking-[0.2em]
          text-white transition hover:bg-gold hover:border-gold
          disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        {buyStatus === "loading" && (
          <Loader2 size={14} className="animate-spin" strokeWidth={2} />
        )}
        {buyLabel}
      </button>
    </div>
  );
}