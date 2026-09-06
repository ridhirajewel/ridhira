import { NextRequest, NextResponse } from "next/server";
import type {
  Address,
  CheckoutAddress,
  LineItemInput,
  Order,
  OrderStatus,
  MoneyAmount,
} from "@/types/woocommerce";

const WC_REST_API_URL = "https://wp.ridhira.in/wp-json/wc/v3/orders";

// ---------- What the frontend actually sends ----------

interface CheckoutRequestBody {
  billing: Address;
  shipping: CheckoutAddress;
  lineItems: LineItemInput[];
  paymentMethod: string;
  paymentMethodTitle: string;
  customerNote?: string;
  setPaid?: boolean;
}

// ---------- What this route returns ----------
// A discriminated union rather than the shared CreateOrderResponse type,
// since on failure there is no real Order to attach.

type CheckoutApiResponse =
  | { success: true; order: Order }
  | { success: false; errors: { code: string; message: string }[] };

// ---------- Shape of the raw WooCommerce REST API v3 response ----------
// Only the fields this route actually reads.

interface WCMetaData {
  key: string;
  value: string;
}

interface WCLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  subtotal: string;
  total: string;
  meta_data: WCMetaData[];
}

interface WCAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

interface WCOrderResponse {
  id: number;
  number: string;
  status: string;
  currency: string;
  billing: WCAddress;
  shipping: WCAddress;
  line_items: WCLineItem[];
  shipping_total: string;
  total: string;
  date_created: string;
  date_modified: string;
  payment_method: string;
  payment_method_title: string;
  transaction_id?: string;
  customer_note?: string;
}

interface WCErrorResponse {
  code: string;
  message: string;
  data?: { status?: number };
}

// ---------- Helpers ----------

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

function toMoneyAmount(amount: string, currencyCode: string): MoneyAmount {
  return {
    amount,
    currencyCode,
    currencySymbol: CURRENCY_SYMBOLS[currencyCode] ?? currencyCode,
  };
}

function toWooCommerceOrderPayload(body: CheckoutRequestBody) {
  return {
    payment_method: body.paymentMethod,
    payment_method_title: body.paymentMethodTitle,
    set_paid: body.setPaid ?? false,
    customer_note: body.customerNote ?? "",
    billing: {
      first_name: body.billing.firstName,
      last_name: body.billing.lastName,
      company: body.billing.company ?? "",
      address_1: body.billing.address1,
      address_2: body.billing.address2 ?? "",
      city: body.billing.city,
      state: body.billing.state,
      postcode: body.billing.postcode,
      country: body.billing.country,
      email: body.billing.email,
      phone: body.billing.phone,
    },
    shipping: {
      first_name: body.shipping.firstName,
      last_name: body.shipping.lastName,
      company: body.shipping.company ?? "",
      address_1: body.shipping.address1,
      address_2: body.shipping.address2 ?? "",
      city: body.shipping.city,
      state: body.shipping.state,
      postcode: body.shipping.postcode,
      country: body.shipping.country,
    },
    line_items: body.lineItems.map((item) => ({
      product_id: item.productId,
      ...(item.variationId ? { variation_id: item.variationId } : {}),
      quantity: item.quantity,
      ...(item.metaData && item.metaData.length > 0
        ? {
            meta_data: item.metaData.map((m) => ({
              key: m.key,
              value: m.value,
            })),
          }
        : {}),
    })),
  };
}

function mapWooCommerceOrder(raw: WCOrderResponse): Order {
  const currencyCode = raw.currency;

  return {
    id: String(raw.id),
    databaseId: raw.id,
    orderNumber: raw.number,
    status: raw.status as OrderStatus,
    currencyCode,
    billing: {
      firstName: raw.billing.first_name,
      lastName: raw.billing.last_name,
      company: raw.billing.company,
      address1: raw.billing.address_1,
      address2: raw.billing.address_2,
      city: raw.billing.city,
      state: raw.billing.state,
      postcode: raw.billing.postcode,
      country: raw.billing.country,
      email: raw.billing.email ?? "",
      phone: raw.billing.phone ?? "",
    },
    shipping: {
      firstName: raw.shipping.first_name || raw.billing.first_name,
      lastName: raw.shipping.last_name || raw.billing.last_name,
      company: raw.shipping.company,
      address1: raw.shipping.address_1 || raw.billing.address_1,
      address2: raw.shipping.address_2,
      city: raw.shipping.city || raw.billing.city,
      state: raw.shipping.state || raw.billing.state,
      postcode: raw.shipping.postcode || raw.billing.postcode,
      country: raw.shipping.country || raw.billing.country,
      email: raw.billing.email ?? "",
      phone: raw.billing.phone ?? "",
    },
    lineItems: raw.line_items.map((item) => ({
      id: String(item.id),
      name: item.name,
      productId: item.product_id,
      variationId: item.variation_id || undefined,
      quantity: item.quantity,
      total: toMoneyAmount(item.total, currencyCode),
      subtotal: toMoneyAmount(item.subtotal, currencyCode),
      metaData: item.meta_data?.map((m) => ({ key: m.key, value: m.value })),
    })),
    shippingTotal: toMoneyAmount(raw.shipping_total, currencyCode),
    total: toMoneyAmount(raw.total, currencyCode),
    dateCreated: raw.date_created,
    dateModified: raw.date_modified,
    paymentMethod: raw.payment_method,
    paymentMethodTitle: raw.payment_method_title,
    transactionId: raw.transaction_id,
    customerNote: raw.customer_note,
  };
}

export async function POST(request: NextRequest) {
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    return NextResponse.json<CheckoutApiResponse>(
      {
        success: false,
        errors: [
          {
            code: "missing_credentials",
            message: "WooCommerce API credentials are not configured.",
          },
        ],
      },
      { status: 500 }
    );
  }

  let body: CheckoutRequestBody;
  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json<CheckoutApiResponse>(
      {
        success: false,
        errors: [
          { code: "invalid_json", message: "Request body must be valid JSON." },
        ],
      },
      { status: 400 }
    );
  }

  if (!body?.billing || !body?.lineItems || body.lineItems.length === 0) {
    return NextResponse.json<CheckoutApiResponse>(
      {
        success: false,
        errors: [
          {
            code: "invalid_payload",
            message: "Missing billing details or line items.",
          },
        ],
      },
      { status: 400 }
    );
  }

  const wcPayload = toWooCommerceOrderPayload(body);
  const authHeader =
    "Basic " + Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    const wcResponse = await fetch(WC_REST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(wcPayload),
      cache: "no-store",
    });

    const wcJson = await wcResponse.json();

    if (!wcResponse.ok) {
      const wcError = wcJson as WCErrorResponse;
      return NextResponse.json<CheckoutApiResponse>(
        {
          success: false,
          errors: [
            {
              code: wcError.code ?? "woocommerce_error",
              message: wcError.message ?? "Failed to create order.",
            },
          ],
        },
        { status: wcResponse.status }
      );
    }

    const order = mapWooCommerceOrder(wcJson as WCOrderResponse);

    return NextResponse.json<CheckoutApiResponse>(
      { success: true, order },
      { status: 201 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error creating order.";
    return NextResponse.json<CheckoutApiResponse>(
      { success: false, errors: [{ code: "network_error", message }] },
      { status: 502 }
    );
  }
}