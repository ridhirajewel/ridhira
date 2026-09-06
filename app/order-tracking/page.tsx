"use client";

import { useState, FormEvent } from "react";
import { Loader2, Search, Truck, CheckCircle, AlertCircle, Info, Calendar, MapPin, Mail, Phone, Package, CreditCard } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { Order, OrderStatus, MoneyAmount } from "@/types/woocommerce";

const WP_GRAPHQL_ENDPOINT = "https://wp.ridhira.in/graphql";

const GET_ORDER_QUERY = `
  query GetOrderByIdAndEmail($id: ID!, $email: String!) {
    order(id: $id, idType: DATABASE_ID) {
      databaseId
      orderNumber
      status
      currencyCode
      billing {
        firstName
        lastName
        email
        phone
      }
      shipping {
        firstName
        lastName
        address1
        address2
        city
        state
        postcode
        country
      }
      lineItems {
        nodes {
          id
          name
          productId
          variationId
          quantity
          total {
            amount
            currencyCode
            currencySymbol
          }
          subtotal {
            amount
            currencyCode
            currencySymbol
          }
          metaData {
            key
            value
          }
        }
      }
      shippingTotal {
        amount
        currencyCode
        currencySymbol
      }
      total {
        amount
        currencyCode
        currencySymbol
      }
      dateCreated
      dateModified
      paymentMethod
      paymentMethodTitle
      transactionId
      customerNote
    }
  }
`;

interface FormState {
  orderId: string;
  email: string;
}

interface FormErrors {
  orderId?: string;
  email?: string;
  general?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusInfo(status: OrderStatus): { label: string; className: string; icon: React.ReactNode; description: string } {
  const configs: Record<OrderStatus, { label: string; className: string; color: string; description: string }> = {
    pending: {
      label: "Pending Payment",
      className: "bg-gold/10 text-gold border-gold/30",
      color: "gold",
      description: "We're waiting for your payment to be confirmed.",
    },
    processing: {
      label: "Processing",
      className: "bg-bottle/10 text-bottle border-bottle/30",
      color: "bottle",
      description: "Your order is being prepared in our atelier.",
    },
    "on-hold": {
      label: "On Hold",
      className: "bg-gold/10 text-gold border-gold/30",
      color: "gold",
      description: "Your order is on hold. We'll contact you soon.",
    },
    completed: {
      label: "Completed",
      className: "bg-emerald/10 text-emerald border-emerald/30",
      color: "emerald",
      description: "Your order has been delivered. Thank you!",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-oxblood/10 text-oxblood border-oxblood/30",
      color: "oxblood",
      description: "This order has been cancelled.",
    },
    refunded: {
      label: "Refunded",
      className: "bg-bark/10 text-bark border-bark/30",
      color: "bark",
      description: "A refund has been processed for this order.",
    },
    failed: {
      label: "Failed",
      className: "bg-oxblood/10 text-oxblood border-oxblood/30",
      color: "oxblood",
      description: "Payment failed. Please try again or contact us.",
    },
  };

  const config = configs[status] ?? configs.pending;
  return {
    label: config.label,
    className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] ${config.className}`,
    icon: config.color === "emerald" ? <CheckCircle size={12} strokeWidth={2} /> : <Info size={12} strokeWidth={2} />,
    description: config.description,
  };
}

export default function OrderTrackingPage() {
  const [formData, setFormData] = useState<FormState>({ orderId: "", email: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let hasErrors = false;

    if (!formData.orderId.trim()) {
      newErrors.orderId = "Order ID is required";
      hasErrors = true;
    } else if (!/^\d+$/.test(formData.orderId.trim())) {
      newErrors.orderId = "Order ID must be numeric";
      hasErrors = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setNotFound(false);
    setOrder(null);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      const response = await fetch(WP_GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: GET_ORDER_QUERY,
          variables: { id: formData.orderId.trim(), email: formData.email.trim() },
        }),
      });

      const json = await response.json();

      if (json.errors) {
        throw new Error(json.errors[0]?.message || "Failed to fetch order");
      }

      const orderData = json?.data?.order;

      if (!orderData) {
        setNotFound(true);
        return;
      }

      if (orderData.billing?.email?.toLowerCase() !== formData.email.trim().toLowerCase()) {
        setNotFound(true);
        return;
      }

      const formattedOrder: Order = {
        ...orderData,
        lineItems: orderData.lineItems?.nodes ?? [],
        shipping: orderData.shipping ?? orderData.billing,
      };

      setOrder(formattedOrder);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ orderId: "", email: "" });
    setErrors({});
    setOrder(null);
    setNotFound(false);
  };

  return (
    <section className="bg-ivory py-10 lg:py-16 min-h-[70vh]">
      <div className="mx-auto max-w-[700px] px-5 lg:px-10">
        <div className="text-center mb-12">
          <h1 className="font-serif text-[32px] leading-tight text-ink lg:text-[42px]">
            Track Your Order
          </h1>
          <p className="mt-3 text-lg text-bark/60">
            Enter your Order ID and billing email to view the current status.
          </p>
        </div>

        {!order && (
          <form onSubmit={handleSubmit} className="bg-white border border-hairline rounded-lg p-6 lg:p-8" noValidate>
            <div className="grid gap-6">
              <div>
                <label htmlFor="order-id" className="block text-[12px] font-medium uppercase tracking-[0.1em] text-ink/70 mb-1.5">
                  Order ID
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} strokeWidth={1.5} />
                  <input
                    id="order-id"
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => handleChange("orderId", e.target.value)}
                    placeholder="e.g. 12345"
                    className={`w-full pl-10 pr-4 py-3 border rounded-sm bg-white text-ink placeholder:text-ink/40 transition-colors ${
                      errors.orderId ? "border-oxblood focus:border-oxblood focus:ring-1 focus:ring-oxblood" : "border-hairline focus:border-gold focus:ring-1 focus:ring-gold"
                    }`}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>
                {errors.orderId && <p className="mt-1 text-xs text-oxblood" role="alert">{errors.orderId}</p>}
              </div>

              <div>
                <label htmlFor="billing-email" className="block text-[12px] font-medium uppercase tracking-[0.1em] text-ink/70 mb-1.5">
                  Billing Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} strokeWidth={1.5} />
                  <input
                    id="billing-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-sm bg-white text-ink placeholder:text-ink/40 transition-colors ${
                      errors.email ? "border-oxblood focus:border-oxblood focus:ring-1 focus:ring-oxblood" : "border-hairline focus:border-gold focus:ring-1 focus:ring-gold"
                    }`}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-oxblood" role="alert">{errors.email}</p>}
              </div>

              {errors.general && (
                <div className="flex items-center gap-2 rounded-lg border border-oxblood/30 bg-oxblood/10 p-3 text-oxblood text-sm" role="alert">
                  <AlertCircle size={16} strokeWidth={2} />
                  <span>{errors.general}</span>
                </div>
              )}

              {notFound && (
                <div className="flex items-center gap-2 rounded-lg border border-oxblood/30 bg-oxblood/10 p-3 text-oxblood text-sm" role="alert">
                  <AlertCircle size={16} strokeWidth={2} />
                  <span>No order found with that Order ID and email combination.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-ink py-3.5 text-sm uppercase tracking-[0.14em] text-ivory transition hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:opacity-50 disabled:cursor-not-allowed pt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                    Looking up order…
                  </span>
                ) : (
                  "Track Order"
                )}
              </button>
            </div>
          </form>
        )}

        {order && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white border border-hairline rounded-lg p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-serif text-xl text-ink">Order #{order.orderNumber}</h2>
                  <p className="text-sm text-bark/60 mt-1">Placed on {formatDate(order.dateCreated)}</p>
                </div>
                <div className={getStatusInfo(order.status as OrderStatus).className}>
                  {getStatusInfo(order.status as OrderStatus).icon}
                  {getStatusInfo(order.status as OrderStatus).label}
                </div>
              </div>

              <p className="text-sm text-bark/60 mb-6">
                {getStatusInfo(order.status as OrderStatus).description}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-start gap-3 p-4 bg-ivory/50 rounded-lg">
                  <Calendar className="flex-shrink-0 mt-0.5 text-gold" size={18} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-bark/60 uppercase tracking-[0.1em]">Order Date</p>
                    <p className="font-serif text-sm text-ink">{formatDate(order.dateCreated)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-ivory/50 rounded-lg">
                  <Package className="flex-shrink-0 mt-0.5 text-gold" size={18} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-bark/60 uppercase tracking-[0.1em]">Items</p>
                    <p className="font-serif text-sm text-ink">{order.lineItems.length} item{order.lineItems.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-ivory/50 rounded-lg">
                  <CreditCard className="flex-shrink-0 mt-0.5 text-gold" size={18} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-bark/60 uppercase tracking-[0.1em]">Payment</p>
                    <p className="font-serif text-sm text-ink">{order.paymentMethodTitle ?? order.paymentMethod ?? "Cash on Delivery"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-ivory/50 rounded-lg">
                  <Truck className="flex-shrink-0 mt-0.5 text-gold" size={18} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-bark/60 uppercase tracking-[0.1em]">Shipping</p>
                    <p className="font-serif text-sm text-ink">Free Shipping</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-hairline rounded-lg overflow-hidden">
              <div className="p-6 border-b border-hairline">
                <h3 className="font-serif text-lg text-ink">Order Items</h3>
              </div>
              <div className="divide-y divide-hairline">
                {order.lineItems.map((item, index) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="w-8 text-center text-sm text-bark/50 font-medium">{index + 1}</span>
                      <div className="min-w-0">
                        <p className="text-sm text-ink truncate">{item.name}</p>
                        {item.metaData && item.metaData.length > 0 && (
                          <p className="text-xs text-bark/50 mt-0.5">
                            {item.metaData.map((m) => `${m.key}: ${m.value}`).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-bark/60 w-16 text-center">Qty: {item.quantity}</span>
                      <span className="font-serif text-ink w-24 text-right">
                        {formatMoney(item.total as MoneyAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-hairline bg-ivory/50">
                <div className="grid gap-2 sm:grid-cols-2 sm:gap-4 max-w-md mx-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-bark/60">Subtotal</span>
                    <span className="font-serif text-ink">{formatMoney(order.total as MoneyAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-bark/60">Shipping</span>
                    <span className="font-serif text-ink">{formatMoney(order.shippingTotal as MoneyAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-serif text-ink border-t border-hairline pt-2 sm:col-span-2">
                    <span>Total</span>
                    <span>{formatMoney(order.total as MoneyAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-white border border-hairline rounded-lg p-6">
                <h3 className="font-serif text-lg text-ink mb-4 flex items-center gap-2">
                  <MapPin className="text-gold" size={18} strokeWidth={1.5} />
                  Shipping Address
                </h3>
                <address className="text-sm text-bark/60 not-italic space-y-1">
                  <p className="font-medium text-ink">
                    {order.shipping.firstName} {order.shipping.lastName}
                  </p>
                  {order.shipping.company && <p>{order.shipping.company}</p>}
                  <p>{order.shipping.address1}</p>
                  {order.shipping.address2 && <p>{order.shipping.address2}</p>}
                  <p>
                    {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
                  </p>
                  <p>{order.shipping.country}</p>
                </address>
              </div>

              <div className="bg-white border border-hairline rounded-lg p-6">
                <h3 className="font-serif text-lg text-ink mb-4 flex items-center gap-2">
                  <Mail className="text-gold" size={18} strokeWidth={1.5} />
                  Billing Contact
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-bark/60">Email</dt>
                    <dd className="font-medium text-ink">{order.billing.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-bark/60">Phone</dt>
                    <dd className="font-medium text-ink">{order.billing.phone}</dd>
                  </div>
                  {order.transactionId && (
                    <div className="flex justify-between">
                      <dt className="text-bark/60">Transaction ID</dt>
                      <dd className="font-mono text-xs text-ink">{order.transactionId}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {order.customerNote && (
              <div className="bg-white border border-hairline rounded-lg p-6">
                <h3 className="font-serif text-lg text-ink mb-2 flex items-center gap-2">
                  <Info className="text-gold" size={18} strokeWidth={1.5} />
                  Order Note
                </h3>
                <p className="text-sm text-bark/60 whitespace-pre-wrap">{order.customerNote}</p>
              </div>
            )}

            <div className="text-center pt-4">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-sm text-bark/60 hover:text-gold transition"
              >
                <Search size={16} strokeWidth={1.5} />
                Track Another Order
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}