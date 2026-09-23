"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Package, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { Order, MoneyAmount } from "@/types/woocommerce";

const STORAGE_KEY = "luxe-atelier-last-order";
const CART_KEY = "luxe-atelier-cart";

interface PageProps {
  params: { orderId: string };
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function safeMoney(val: MoneyAmount | undefined | null): string {
  if (!val) return "₹0";
  return formatMoney(val);
}

export default function OrderSuccessPage({ params }: PageProps) {
  const { orderId } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 1. Clear the cart unconditionally on mount
    localStorage.removeItem(CART_KEY);

    // 2. Attempt to read the stashed order data
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Order = JSON.parse(raw);
        // Validate it matches the orderId in the URL before using it
        if (
          String(parsed.databaseId) === String(orderId) ||
          parsed.orderNumber === orderId ||
          String(parsed.id) === String(orderId)
        ) {
          setOrder(parsed);
        }
        // Clean up — we don't need this across sessions
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore parse errors; fallback UI handles missing data
    }

    setHydrated(true);
  }, [orderId]);

  // ── Loading state — avoids hydration flash ───────────────────────────────
  if (!hydrated) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-ivory">
        <Loader2 size={28} className="animate-spin text-gold" strokeWidth={1.5} />
      </section>
    );
  }

  // ── Full success view (order data available) ─────────────────────────────
  if (order) {
    return (
      <section className="bg-ivory py-10 lg:py-16 min-h-[60vh]">
        <div className="mx-auto max-w-[760px] px-5 lg:px-10">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald/10 mb-6">
              <CheckCircle size={36} className="text-emerald" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-[32px] leading-tight text-ink lg:text-[42px]">
              Thank You for Your Order
            </h1>
            <p className="mt-3 text-base text-bark/60">
              Order{" "}
              <span className="font-medium text-ink">#{order.orderNumber}</span>{" "}
              has been placed successfully.
            </p>
            {order.billing?.email && (
              <p className="mt-1 text-sm text-bark/50">
                A confirmation will be sent to{" "}
                <span className="font-medium text-ink">{order.billing.email}</span>
              </p>
            )}
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="flex items-start gap-3 bg-white border border-hairline rounded-lg p-4">
              <CheckCircle className="flex-shrink-0 mt-0.5 text-gold" size={18} strokeWidth={1.5} />
              <div>
                <p className="text-xs text-bark/60 uppercase tracking-[0.1em]">Status</p>
                <p className="font-serif text-sm text-ink capitalize mt-0.5">
                  {order.status === "processing" ? "Processing" :
                   order.status === "pending" ? "Pending" :
                   order.status === "completed" ? "Completed" : order.status}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white border border-hairline rounded-lg p-4">
              <Package className="flex-shrink-0 mt-0.5 text-gold" size={18} strokeWidth={1.5} />
              <div>
                <p className="text-xs text-bark/60 uppercase tracking-[0.1em]">Order Date</p>
                <p className="font-serif text-sm text-ink mt-0.5">{formatDate(order.dateCreated)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white border border-hairline rounded-lg p-4">
              <MapPin className="flex-shrink-0 mt-0.5 text-gold" size={18} strokeWidth={1.5} />
              <div>
                <p className="text-xs text-bark/60 uppercase tracking-[0.1em]">Ships To</p>
                <p className="font-serif text-sm text-ink mt-0.5">
                  {order.shipping?.city || order.billing?.city || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Line items */}
          {order.lineItems && order.lineItems.length > 0 && (
            <div className="bg-white border border-hairline rounded-lg overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-hairline">
                <h2 className="font-serif text-lg text-ink">Order Items</h2>
              </div>
              <ul className="divide-y divide-hairline">
                {order.lineItems.map((item, i) => (
                  <li key={item.id ?? i} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{item.name}</p>
                      {item.metaData && item.metaData.length > 0 && (
                        <p className="text-xs text-bark/50 mt-0.5">
                          {item.metaData.map((m) => `${m.key}: ${m.value}`).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm shrink-0">
                      <span className="text-bark/60">Qty: {item.quantity}</span>
                      <span className="font-serif text-ink w-20 text-right">
                        {safeMoney(item.total as MoneyAmount)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-4 border-t border-hairline bg-ivory/50">
                <div className="max-w-xs ml-auto space-y-2">
                  <div className="flex justify-between text-sm text-bark/60">
                    <span>Shipping</span>
                    <span className="text-ink">
                      {order.shippingTotal && Number((order.shippingTotal as MoneyAmount).amount) > 0
                        ? safeMoney(order.shippingTotal as MoneyAmount)
                        : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-serif text-ink border-t border-hairline pt-2">
                    <span>Total</span>
                    <span>{safeMoney(order.total as MoneyAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping address */}
          {order.shipping?.address1 && (
            <div className="bg-white border border-hairline rounded-lg p-6 mb-8">
              <h2 className="font-serif text-base text-ink mb-3">Shipping Address</h2>
              <address className="text-sm text-bark/60 not-italic space-y-0.5">
                <p className="font-medium text-ink">
                  {order.shipping.firstName} {order.shipping.lastName}
                </p>
                <p>{order.shipping.address1}</p>
                {order.shipping.address2 && <p>{order.shipping.address2}</p>}
                <p>
                  {order.shipping.city}, {order.shipping.state}{" "}
                  {order.shipping.postcode}
                </p>
                <p>{order.shipping.country}</p>
              </address>
            </div>
          )}

          {/* CTA */}
          <div className="text-center space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-ink px-8 py-3.5 text-sm uppercase tracking-[0.14em] text-ivory transition hover:bg-gold"
            >
              Continue Shopping
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <p className="text-xs text-bark/50">
              Questions?{" "}
              <a href="mailto:hello@ridhira.in" className="underline hover:text-gold">
                Contact our atelier
              </a>
              {" "}· Track your order on the{" "}
              <Link href="/order-tracking" className="underline hover:text-gold">
                Order Tracking
              </Link>{" "}page.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ── Fallback view — no cached order data (e.g. direct URL visit) ─────────
  return (
    <section className="bg-ivory py-10 lg:py-16 min-h-[60vh]">
      <div className="mx-auto max-w-[600px] px-5 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald/10 mb-6">
          <CheckCircle size={36} className="text-emerald" strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-[32px] leading-tight text-ink lg:text-[42px]">
          Order Placed!
        </h1>
        <p className="mt-3 text-base text-bark/60">
          Your Order ID is{" "}
          <span className="font-medium text-ink">#{orderId}</span>.
        </p>
        <p className="mt-2 text-sm text-bark/50">
          A confirmation email is on its way. You can also track your order below.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-ink px-8 py-3.5 text-sm uppercase tracking-[0.14em] text-ivory transition hover:bg-gold"
          >
            Continue Shopping
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
          <Link
            href="/order-tracking"
            className="inline-flex items-center gap-2 border border-ink px-8 py-3.5 text-sm uppercase tracking-[0.14em] text-ink transition hover:bg-ink hover:text-ivory"
          >
            Track My Order
          </Link>
        </div>
      </div>
    </section>
  );
}
