"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AddToCartHandler,
  CartItem,
  CartSession,
  OpenQuickViewHandler,
  Product,
  ProductVariation,
  ProductImage,
  MoneyAmount,
} from "@/types/woocommerce";
import { products as catalog } from "@/lib/mock-data";

const WP_GRAPHQL_ENDPOINT = "https://wp.ridhira.in/graphql";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface CartContextValue {
  cart: CartSession;
  isCartOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCart: AddToCartHandler;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  quickViewProduct: Product | null;
  openQuickView: OpenQuickViewHandler;
  closeQuickView: () => void;
  toasts: Toast[];
  dismissToast: (id: string) => void;
}

const emptyCart: CartSession = {
  itemsCount: 0,
  items: [],
  subtotal: { amount: "0", currencyCode: "INR", currencySymbol: "₹" },
  total: { amount: "0", currencyCode: "INR", currencySymbol: "₹" },
  currencyCode: "INR",
};

const STORAGE_KEY = "luxe-atelier-cart";

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    return [];
  }
  return [];
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Silently fail if storage is full/unavailable
  }
}

function recalculate(
  items: CartItem[]
): Pick<CartSession, "itemsCount" | "subtotal" | "total"> {
  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const amount = items
    .reduce((sum, i) => sum + Number(i.subtotal.amount), 0)
    .toFixed(2);
  const money = { amount, currencyCode: "INR", currencySymbol: "₹" };
  return { itemsCount, subtotal: money, total: money };
}

function generateKey(productId: number, variationId?: number): string {
  return `${productId}-${variationId ?? "default"}`;
}

function findProductById(databaseId: number): Product | undefined {
  return catalog.find((p) => p.databaseId === databaseId);
}

function findVariation(
  product: Product,
  variationId: number
): ProductVariation | undefined {
  return product.variations?.find((v) => v.databaseId === variationId);
}

interface WPProductFragment {
  databaseId: number;
  name: string;
  slug: string;
  type: string;
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  onSale: boolean;
  stockStatus: string;
  images: { nodes: ProductImage[] };
  attributes: { nodes: { name: string; slug: string; options: string[]; variation: boolean }[] };
  variations?: { nodes: ProductVariation[] };
}

async function fetchProductFromAPI(databaseId: number): Promise<Product | null> {
  const query = `
    query GetProductById($id: ID!) {
      product(id: $id, idType: DATABASE_ID) {
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          onSale
          stockStatus
          image { id sourceUrl altText }
          attributes { nodes { name options variation } }
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          onSale
          stockStatus
          image { id sourceUrl altText }
          attributes { nodes { name options variation } }
          variations {
            nodes {
              databaseId
              name
              price
              regularPrice
              salePrice
              stockStatus
              attributes { nodes { name value } }
              image { id sourceUrl altText }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(WP_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { id: String(databaseId) },
      }),
    });

    if (!res.ok) return null;

    const json = await res.json();

    if (json.errors) {
      console.error("GraphQL errors:", json.errors);
      return null;
    }

    const data = json.data?.product;
    if (!data) return null;

    const priceAmount = data.price ?? data.regularPrice ?? "0";
    const regularPriceAmount = data.regularPrice ?? data.price ?? "0";
    const salePriceAmount = data.salePrice && data.onSale ? data.salePrice : undefined;

    const moneyAmount = (amount: string): MoneyAmount => ({
      amount,
      currencyCode: "INR",
      currencySymbol: "₹",
    });

    // Safely map the main image into the array format your context expects
    const images: ProductImage[] = data.image
      ? [data.image]
      : [{ id: "", sourceUrl: "/placeholder-product.jpg", altText: data.name }];

    const product: Product = {
      id: `product-${data.databaseId}`,
      databaseId: data.databaseId,
      name: data.name,
      slug: data.slug,
      type: data.type as "SIMPLE" | "VARIABLE",
      price: moneyAmount(priceAmount),
      regularPrice: moneyAmount(regularPriceAmount),
      salePrice: salePriceAmount ? moneyAmount(salePriceAmount) : undefined,
      onSale: data.onSale ?? false,
      stockStatus: data.stockStatus as "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER",
      images,
      categories: [],
      // Create a slug manually from the name since it's not queryable here
      attributes: data.attributes?.nodes?.map((a: { name: string; options: string[]; variation: boolean }) => ({
        id: a.name.toLowerCase().replace(/\s+/g, '-'),
        name: a.name,
        slug: a.name.toLowerCase().replace(/\s+/g, '-'),
        options: a.options || [],
        variation: a.variation || false,
      })) ?? [],
      variations: data.variations?.nodes?.map((v: { databaseId: number; name: string; price: string; regularPrice: string; salePrice?: string; stockStatus: string; attributes: { nodes: { name: string; value: string }[] }; image?: ProductImage }) => ({
        id: `variation-${v.databaseId}`,
        databaseId: v.databaseId,
        name: v.name,
        price: moneyAmount(v.price),
        regularPrice: moneyAmount(v.regularPrice),
        salePrice: v.salePrice ? moneyAmount(v.salePrice) : undefined,
        stockStatus: v.stockStatus as "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER",
        attributes: v.attributes?.nodes || [],
        image: v.image,
      })) ?? undefined,
    };

    return product;
  } catch (err) {
    console.error("Failed to fetch product:", err);
    return null;
  }
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveCartToStorage(items);
    }
  }, [items, hydrated]);

  const showToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToCart: AddToCartHandler = useCallback(
    async (productId, variationId, quantity = 1) => {
      let product = findProductById(productId);

      // If not in mock catalog, fetch from WPGraphQL
      if (!product) {
        product = (await fetchProductFromAPI(productId)) ?? undefined;
      }

      if (!product) {
        showToast("Product not found", "error");
        return;
      }

      let variation: ProductVariation | undefined;
      let price = product.price;
      let image = product.images[0];
      let name = product.name;

      if (variationId && product.type === "VARIABLE") {
        variation = findVariation(product, variationId);
        if (!variation) {
          showToast("Selected variation not available", "error");
          return;
        }
        price = variation.price;
        name = `${product.name} - ${variation.attributes.map((a) => a.value).join(", ")}`;
        image = variation.image ?? product.images[0];
      }

      if (variation?.stockStatus === "OUT_OF_STOCK") {
        showToast("Selected variation is out of stock", "error");
        return;
      }

      if (product.stockStatus === "OUT_OF_STOCK" && !variationId) {
        showToast("This product is out of stock", "error");
        return;
      }

      setItems((prev) => {
        const key = generateKey(productId, variationId);
        const existing = prev.find((i) => i.key === key);

        if (existing) {
          const newQuantity = existing.quantity + quantity;
          return prev.map((i) =>
            i.key === key
              ? {
                ...i,
                quantity: newQuantity,
                subtotal: {
                  ...i.price,
                  amount: (Number(i.price.amount) * newQuantity).toFixed(2),
                },
              }
              : i
          );
        }

        const newItem: CartItem = {
          key,
          productId,
          variationId,
          name,
          slug: product.slug,
          image,
          quantity,
          price,
          subtotal: {
            ...price,
            amount: (Number(price.amount) * quantity).toFixed(2),
          },
          attributes: variation?.attributes,
        };
        return [...prev, newItem];
      });

      showToast(`${product.name} added to cart`, "success");
      setCartOpen(true);
    },
    [showToast]
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.key !== key));
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (!existing) return prev;

      return prev.map((i) =>
        i.key === key
          ? {
            ...i,
            quantity,
            subtotal: {
              ...i.price,
              amount: (Number(i.price.amount) * quantity).toFixed(2),
            },
          }
          : i
      );
    });
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
    showToast("Item removed from cart", "info");
  }, [showToast]);

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
    updateQuantity,
    removeFromCart,
    quickViewProduct,
    openQuickView: (product) => setQuickViewProduct(product),
    closeQuickView: () => setQuickViewProduct(null),
    toasts,
    dismissToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}