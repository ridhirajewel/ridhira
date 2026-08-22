"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type {
  AddToCartHandler,
  CartItem,
  CartSession,
  OpenQuickViewHandler,
  Product,
} from "@/types/woocommerce";
import { products as catalog } from "@/lib/mock-data";

interface CartContextValue {
  cart: CartSession;
  isCartOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCart: AddToCartHandler;
  removeFromCart: (key: string) => void;
  quickViewProduct: Product | null;
  openQuickView: OpenQuickViewHandler;
  closeQuickView: () => void;
}

const emptyCart: CartSession = {
  itemsCount: 0,
  items: [],
  subtotal: { amount: "0", currencyCode: "INR", currencySymbol: "₹" },
  total: { amount: "0", currencyCode: "INR", currencySymbol: "₹" },
  currencyCode: "INR",
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function recalculate(items: CartItem[]): Pick<CartSession, "itemsCount" | "subtotal" | "total"> {
  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const amount = items
    .reduce((sum, i) => sum + Number(i.subtotal.amount), 0)
    .toFixed(2);
  const money = { amount, currencyCode: "INR", currencySymbol: "₹" };
  return { itemsCount, subtotal: money, total: money };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const addToCart: AddToCartHandler = useCallback(
    (productId, variationId, quantity = 1) => {
      const product = catalog.find((p) => p.databaseId === productId);
      if (!product) return;

      setItems((prev) => {
        const key = `${productId}-${variationId ?? "default"}`;
        const existing = prev.find((i) => i.key === key);

        if (existing) {
          return prev.map((i) =>
            i.key === key
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                  subtotal: {
                    ...i.price,
                    amount: (
                      Number(i.price.amount) *
                      (i.quantity + quantity)
                    ).toFixed(2),
                  },
                }
              : i
          );
        }

        const newItem: CartItem = {
          key,
          productId,
          variationId,
          name: product.name,
          slug: product.slug,
          image: product.images[0],
          quantity,
          price: product.price,
          subtotal: {
            ...product.price,
            amount: (Number(product.price.amount) * quantity).toFixed(2),
          },
        };
        return [...prev, newItem];
      });

      setCartOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const cart: CartSession = useMemo(
    () => ({ ...emptyCart, items, ...recalculate(items) }),
    [items]
  );

  const value: CartContextValue = {
    cart,
    isCartOpen,
    openCartDrawer: () => setCartOpen(true),
    closeCartDrawer: () => setCartOpen(false),
    addToCart,
    removeFromCart,
    quickViewProduct,
    openQuickView: (product) => setQuickViewProduct(product),
    closeQuickView: () => setQuickViewProduct(null),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
