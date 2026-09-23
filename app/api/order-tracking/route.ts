import { NextRequest, NextResponse } from "next/server";
import type { Order, OrderStatus } from "@/types/woocommerce";

/**
 * POST /api/order-tracking
 *
 * Server-side proxy for order lookup. Keeps the WPGraphQL request behind
 * the Next.js server so CORS is never an issue, and validates that the
 * billing email matches before returning any order data.
 *
 * Falls back to WooCommerce REST API (Basic Auth) if WPGraphQL returns null
 * (e.g. the WPGraphQL WooCommerce extension requires auth for order queries).
 */

const WP_GRAPHQL_ENDPOINT =
  process.env.WP_GRAPHQL_ENDPOINT ?? "https://wp.ridhira.in/graphql";
const WC_REST_BASE = "https://wp.ridhira.in/wp-json/wc/v3";

const GET_ORDER_QUERY = `
  query GetOrder($id: ID!) {
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
        address1
        address2
        city
        state
        postcode
        country
        company
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
        company
      }
      lineItems {
        nodes {
          id
          name
          productId
          variationId
          quantity
          total
          subtotal
          metaData { key value }
        }
      }
      shippingTotal
      total
      dateCreated
      dateModified
      paymentMethod
      paymentMethodTitle
      transactionId
      customerNote
    }
  }
`;

interface RequestBody {
  orderId: string;
  email: string;
}

function makeMoney(amount: string, currencyCode = "INR") {
  return { amount: String(amount ?? "0"), currencyCode, currencySymbol: "₹" };
}

export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  const { orderId, email } = body;

  if (!orderId || !email) {
    return NextResponse.json(
      { success: false, error: "orderId and email are required." },
      { status: 400 }
    );
  }

  // ── 1. Try WPGraphQL first ──────────────────────────────────────────────
  let order: Order | null = null;
  try {
    const gqlRes = await fetch(WP_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_ORDER_QUERY, variables: { id: orderId } }),
      cache: "no-store",
    });

    const gqlJson = await gqlRes.json();

    if (!gqlJson.errors && gqlJson.data?.order) {
      const raw = gqlJson.data.order;

      // Security: verify email matches
      if (
        raw.billing?.email?.toLowerCase() !== email.trim().toLowerCase()
      ) {
        return NextResponse.json({ success: false, notFound: true });
      }

      order = {
        id: String(raw.databaseId),
        databaseId: raw.databaseId,
        orderNumber: raw.orderNumber,
        status: raw.status as OrderStatus,
        currencyCode: raw.currencyCode ?? "INR",
        billing: {
          firstName: raw.billing?.firstName ?? "",
          lastName: raw.billing?.lastName ?? "",
          company: raw.billing?.company,
          address1: raw.billing?.address1 ?? "",
          address2: raw.billing?.address2,
          city: raw.billing?.city ?? "",
          state: raw.billing?.state ?? "",
          postcode: raw.billing?.postcode ?? "",
          country: raw.billing?.country ?? "",
          email: raw.billing?.email ?? "",
          phone: raw.billing?.phone ?? "",
        },
        shipping: {
          firstName: raw.shipping?.firstName || raw.billing?.firstName || "",
          lastName: raw.shipping?.lastName || raw.billing?.lastName || "",
          company: raw.shipping?.company,
          address1: raw.shipping?.address1 || raw.billing?.address1 || "",
          address2: raw.shipping?.address2,
          city: raw.shipping?.city || raw.billing?.city || "",
          state: raw.shipping?.state || raw.billing?.state || "",
          postcode: raw.shipping?.postcode || raw.billing?.postcode || "",
          country: raw.shipping?.country || raw.billing?.country || "",
          email: raw.billing?.email ?? "",
          phone: raw.billing?.phone ?? "",
        },
        lineItems: (raw.lineItems?.nodes ?? []).map(
          (item: { id: string; name: string; productId: number; variationId?: number; quantity: number; total: string; subtotal: string; metaData?: { key: string; value: string }[] }) => ({
            id: item.id,
            name: item.name,
            productId: item.productId,
            variationId: item.variationId || undefined,
            quantity: item.quantity,
            total: makeMoney(item.total),
            subtotal: makeMoney(item.subtotal),
            metaData: item.metaData,
          })
        ),
        shippingTotal: makeMoney(raw.shippingTotal ?? "0"),
        total: makeMoney(raw.total ?? "0"),
        dateCreated: raw.dateCreated,
        dateModified: raw.dateModified,
        paymentMethod: raw.paymentMethod,
        paymentMethodTitle: raw.paymentMethodTitle,
        transactionId: raw.transactionId,
        customerNote: raw.customerNote,
      };
    }
  } catch {
    // WPGraphQL failed — fall through to REST API
  }

  // ── 2. Fallback: WooCommerce REST API (Basic Auth) ──────────────────────
  if (!order) {
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      return NextResponse.json({ success: false, notFound: true });
    }

    try {
      const authHeader =
        "Basic " +
        Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

      const wcRes = await fetch(
        `${WC_REST_BASE}/orders/${orderId}`,
        {
          headers: { Authorization: authHeader },
          cache: "no-store",
        }
      );

      if (!wcRes.ok) {
        return NextResponse.json({ success: false, notFound: true });
      }

      const raw = await wcRes.json();

      // Security: verify billing email
      if (
        (raw.billing?.email ?? "").toLowerCase() !==
        email.trim().toLowerCase()
      ) {
        return NextResponse.json({ success: false, notFound: true });
      }

      order = {
        id: String(raw.id),
        databaseId: raw.id,
        orderNumber: raw.number,
        status: raw.status as OrderStatus,
        currencyCode: raw.currency ?? "INR",
        billing: {
          firstName: raw.billing?.first_name ?? "",
          lastName: raw.billing?.last_name ?? "",
          company: raw.billing?.company,
          address1: raw.billing?.address_1 ?? "",
          address2: raw.billing?.address_2,
          city: raw.billing?.city ?? "",
          state: raw.billing?.state ?? "",
          postcode: raw.billing?.postcode ?? "",
          country: raw.billing?.country ?? "",
          email: raw.billing?.email ?? "",
          phone: raw.billing?.phone ?? "",
        },
        shipping: {
          firstName: raw.shipping?.first_name || raw.billing?.first_name || "",
          lastName: raw.shipping?.last_name || raw.billing?.last_name || "",
          company: raw.shipping?.company,
          address1: raw.shipping?.address_1 || raw.billing?.address_1 || "",
          address2: raw.shipping?.address_2,
          city: raw.shipping?.city || raw.billing?.city || "",
          state: raw.shipping?.state || raw.billing?.state || "",
          postcode: raw.shipping?.postcode || raw.billing?.postcode || "",
          country: raw.shipping?.country || raw.billing?.country || "",
          email: raw.billing?.email ?? "",
          phone: raw.billing?.phone ?? "",
        },
        lineItems: (raw.line_items ?? []).map(
          (item: { id: number; name: string; product_id: number; variation_id?: number; quantity: number; total: string; subtotal: string; meta_data?: { key: string; value: string }[] }) => ({
            id: String(item.id),
            name: item.name,
            productId: item.product_id,
            variationId: item.variation_id || undefined,
            quantity: item.quantity,
            total: makeMoney(item.total),
            subtotal: makeMoney(item.subtotal),
            metaData: item.meta_data,
          })
        ),
        shippingTotal: makeMoney(raw.shipping_total ?? "0"),
        total: makeMoney(raw.total ?? "0"),
        dateCreated: raw.date_created,
        dateModified: raw.date_modified,
        paymentMethod: raw.payment_method,
        paymentMethodTitle: raw.payment_method_title,
        transactionId: raw.transaction_id || undefined,
        customerNote: raw.customer_note || undefined,
      };
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to fetch order." },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ success: true, order });
}
