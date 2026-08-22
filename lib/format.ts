import type { MoneyAmount } from "@/types/woocommerce";

/**
 * Formats a WooCommerce MoneyAmount into a display string.
 * WooCommerce returns price as a decimal string — never do float math on it
 * beyond display formatting, to avoid rounding drift against the store of record.
 */
export function formatMoney(money: MoneyAmount): string {
  const value = Number(money.amount);
  if (Number.isNaN(value)) return `${money.currencySymbol}0`;

  const formatted = value.toLocaleString("en-IN", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return `${money.currencySymbol}${formatted}`;
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
