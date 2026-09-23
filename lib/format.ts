import type { MoneyAmount } from "@/types/woocommerce";

/**
 * Strips HTML tags and thousands-commas from a raw WooCommerce price string.
 *
 * WooCommerce / WPGraphQL returns prices as HTML such as:
 *   <span class="woocommerce-Price-amount amount">
 *     <bdi><span class="woocommerce-Price-currencySymbol">₹</span>48,500.00</bdi>
 *   </span>
 *
 * Extracts only the numeric part (e.g. "48500.00") so it can be passed into
 * MoneyAmount.amount and formatted by formatMoney without producing ₹0 / NaN.
 *
 * Always returns at least "0" — never throws.
 */
export function parseWooPrice(raw?: string | null): string {
  if (!raw) return "0";
  // 1. Strip all HTML tags
  const stripped = raw.replace(/<[^>]*>/g, "");
  // 2. Remove commas (Indian and Western thousand separators)
  const noCommas = stripped.replace(/,/g, "");
  // 3. Extract the first continuous decimal number
  const match = noCommas.match(/[\d.]+/);
  return match ? match[0] : "0";
}

/**
 * Formats a WooCommerce MoneyAmount into a display string.
 * WooCommerce returns price as a decimal string — never do float math on it
 * beyond display formatting, to avoid rounding drift against the store of record.
 * Always outputs Indian Rupees (₹ / INR) regardless of backend currency.
 */
export function formatMoney(money: MoneyAmount): string {
  const value = Number(money.amount);
  if (Number.isNaN(value)) return "₹0";

  const formatted = value.toLocaleString("en-IN", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return `₹${formatted}`;
}

export function calculateDiscountPercent(
  regular: MoneyAmount,
  sale?: MoneyAmount
): number | null {
  if (!sale) return null;
  const regularValue = Number(regular.amount);
  const saleValue = Number(sale.amount);
  if (!regularValue || Number.isNaN(saleValue)) return null;
  const percent = Math.round(((regularValue - saleValue) / regularValue) * 100);
  return percent > 0 ? percent : null;
}
