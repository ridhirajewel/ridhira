import { notFound } from "next/navigation";
import { CheckCircle, Truck, CreditCard, MapPin, Mail, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import type { Order, OrderStatus, MoneyAmount } from "@/types/woocommerce";

const WP_GRAPHQL_ENDPOINT = "https://wp.ridhira.in/graphql";

interface OrderData {
  order: Order | null;
}

const GET_ORDER_QUERY = `
  query GetOrderById($id: ID!) {
    order(id: $id, idType: DATABASE_ID) {
      databaseId
      orderNumber
      status
      currencyCode
      billing {
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postcode
        country
        email
        phone
      }
      shipping {
        firstName
        lastName
        company
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

async function fetchOrderById(orderId: string): Promise<Order | null> {
  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: GET_ORDER_QUERY,
      variables: { id: orderId },
    }),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();

  if (json.errors) {
    console.error("GraphQL errors:", json.errors);
    return null;
  }

  const orderData = json?.data?.order;
  if (!orderData) return null;

  return {
    ...orderData,
    lineItems: orderData.lineItems?.nodes ?? [],
    billing: {
      ...orderData.billing,
      email: orderData.billing?.email ?? "",
      phone: orderData.billing?.phone ?? "",
    },
    shipping: orderData.shipping ?? orderData.billing,
  } as Order;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusBadge(status: OrderStatus): { label: string; className: string; icon: React.ReactNode } {
  const configs: Record<OrderStatus, { label: string; className: string; color: string }> = {
    pending: { label: "Pending Payment", className: "bg-gold/10 text-gold border-gold/30", color: "gold" },
    processing: { label: "Processing", className: "bg-bottle/10 text-bottle border-bottle/30", color: "bottle" },
    "on-hold": { label: "On Hold", className: "bg-gold/10 text-gold border-gold/30", color: "gold" },
    completed: { label: "Completed", className: "bg-emerald/10 text-emerald border-emerald/30", color: "emerald" },
    cancelled: { label: "Cancelled", className: "bg-oxblood/10 text-oxblood border-oxblood/30", color: "oxblood" },
    refunded: { label: "Refunded", className: "bg-bark/10 text-bark border-bark/30", color: "bark" },
    failed: { label: "Failed", className: "bg-oxblood/10 text-oxblood border-oxblood/30", color: "oxblood" },
  };

  const config = configs[status] ?? configs.pending;
  return {
    label: config.label,
    className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] ${config.className}`,
    icon: <CheckCircle size={12} strokeWidth={2} />,
  };
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await fetchOrderById(orderId);

  if (!order) {
    notFound();
  }

  const statusInfo = getStatusBadge(order.status as OrderStatus);

  return (
    <section className="bg-ivory py-10 lg:py-16 min-h-[60vh]">
      <div className="mx-auto max-w-[800px] px-5 lg:px-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald/10 mb-6">
            <CheckCircle size={32} className="text-emerald" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-[32px] leading-tight text-ink lg:text-[42px]">
            Thank You for Your Order
          </h1>
          <p className="mt-3 text-lg text-bark/60">
            Your order has been placed successfully. We&apos;ll send a confirmation to{" "}
            <span className="font-medium text-ink">{order.billing.email}</span>
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-white border border-hairline rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-serif text-lg text-ink">Order Confirmation</h2>
              <span className={statusInfo.className}>
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </div>

            <dl className="space-y-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-bark/60">Order Number</dt>
                <dd className="font-serif text-ink font-medium">#{order.orderNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-bark/60">Date Placed</dt>
                <dd className="font-serif text-ink">{formatDate(order.dateCreated)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-bark/60">Payment Method</dt>
                <dd className="font-serif text-ink">{order.paymentMethodTitle ?? order.paymentMethod ?? "Cash on Delivery"}</dd>
              </div>
              {order.transactionId && (
                <div className="flex justify-between">
                  <dt className="text-bark/60">Transaction ID</dt>
                  <dd className="font-mono text-xs text-ink">{order.transactionId}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white border border-hairline rounded-lg p-6">
            <h2 className="font-serif text-lg text-ink mb-6">Shipping Address</h2>
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
        </div>

        <div className="mt-8 bg-white border border-hairline rounded-lg overflow-hidden">
          <div className="p-6 border-b border-hairline">
            <h2 className="font-serif text-lg text-ink">Order Details</h2>
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
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4 max-w-md">
              <div className="flex justify-between text-sm">
                <span className="text-bark/60">Subtotal</span>
                <span className="font-serif text-ink">{formatMoney(order.total as MoneyAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bark/60">Shipping</span>
                <span className="font-serif text-ink">{formatMoney(order.shippingTotal as MoneyAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-serif text-ink border-t border-hairline pt-2">
                <span>Total</span>
                <span>{formatMoney(order.total as MoneyAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {order.customerNote && (
          <div className="mt-8 bg-white border border-hairline rounded-lg p-6">
            <h3 className="font-serif text-lg text-ink mb-2 flex items-center gap-2">
              <span className="text-gold" aria-hidden="true">※</span>
              Order Note
            </h3>
            <p className="text-sm text-bark/60 whitespace-pre-wrap">{order.customerNote}</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-ink bg-transparent px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-bark/50">
          Questions about your order?{" "}
          <a href="mailto:hello@ridhira.in" className="underline hover:text-gold">
            Contact our atelier
          </a>
        </p>
      </div>
    </section>
  );
}