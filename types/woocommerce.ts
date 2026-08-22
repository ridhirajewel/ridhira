/**
 * WooCommerce / WPGraphQL & Store API data contracts.
 *
 * These interfaces mirror the shapes returned by:
 *  - WPGraphQL for WooCommerce (`wp-graphql-woocommerce`) for catalog reads
 *  - WooCommerce Store API (`/wp-json/wc/store/v1`) for cart/checkout mutations
 *
 * Keep this file framework-agnostic — no React imports — so it can be shared
 * between server queries, client components, and any future edge functions.
 */

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";

export type ProductType = "SIMPLE" | "VARIABLE" | "EXTERNAL" | "GROUPED";

export interface MoneyAmount {
  /** Minor-unit-free decimal string, e.g. "24500.00" — matches WooCommerce's string price fields. */
  amount: string;
  currencyCode: string;
  /** ISO currency symbol, e.g. "₹", "$" — pre-resolved so components never hardcode symbols. */
  currencySymbol: string;
}

export interface ProductImage {
  id: string;
  sourceUrl: string;
  altText: string;
  width?: number;
  height?: number;
}

export interface ProductAttribute {
  id: string;
  name: string; // e.g. "Metal", "Ring Size", "Gemstone"
  slug: string;
  options: string[];
  variation: boolean;
}

export interface ProductVariation {
  id: string;
  databaseId: number;
  name: string;
  price: MoneyAmount;
  regularPrice: MoneyAmount;
  salePrice?: MoneyAmount;
  stockStatus: StockStatus;
  attributes: { name: string; value: string }[];
  image?: ProductImage;
}

export interface Category {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description?: string;
  image?: ProductImage;
  count: number;
}

export interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  type: ProductType;
  sku?: string;
  description?: string;
  shortDescription?: string;
  price: MoneyAmount;
  regularPrice: MoneyAmount;
  salePrice?: MoneyAmount;
  onSale: boolean;
  isNew?: boolean;
  averageRating?: number;
  reviewCount?: number;
  stockStatus: StockStatus;
  images: ProductImage[];
  categories: Pick<Category, "id" | "name" | "slug">[];
  attributes: ProductAttribute[];
  variations?: ProductVariation[];
}

export interface CartItem {
  key: string; // WooCommerce Store API cart item key
  productId: number;
  variationId?: number;
  name: string;
  slug: string;
  image: ProductImage;
  quantity: number;
  price: MoneyAmount;
  subtotal: MoneyAmount;
  attributes?: { name: string; value: string }[];
}

export interface CartSession {
  itemsCount: number;
  items: CartItem[];
  subtotal: MoneyAmount;
  total: MoneyAmount;
  currencyCode: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location?: string;
  rating: number; // 1-5
  quote: string;
  productName?: string;
}

/** Interaction contracts — implemented by client components, wired to Store API mutations later. */
export type AddToCartHandler = (
  productId: number,
  variationId?: number,
  quantity?: number
) => void | Promise<void>;

export type OpenCartDrawerHandler = () => void;

export type OpenQuickViewHandler = (product: Product) => void;
