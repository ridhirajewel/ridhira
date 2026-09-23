import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/razorpay/order
 *
 * Creates a Razorpay order on the server so the KEY_SECRET is never exposed
 * to the browser. The frontend receives only the order_id + amount it needs
 * to open the Razorpay checkout modal.
 *
 * Request body: { amount: number (paise), currency: string }
 * Response:     { orderId, amount, currency, keyId }
 */

interface RazorpayOrderRequest {
  /** Amount in paise (INR × 100). e.g. ₹500 → 50000 */
  amount: number;
  currency?: string;
  receipt?: string;
}

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: string;
}

interface RazorpayErrorResponse {
  error?: { description?: string; code?: string };
}

export async function POST(request: NextRequest) {
  const keyId = process.env.NEXT_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (
    !keyId ||
    !keySecret ||
    keyId.includes("REPLACE") ||
    keySecret.includes("REPLACE")
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Razorpay is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local.",
      },
      { status: 503 }
    );
  }

  let body: RazorpayOrderRequest;
  try {
    body = (await request.json()) as RazorpayOrderRequest;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body.amount || body.amount < 100) {
    return NextResponse.json(
      { success: false, error: "Amount must be at least ₹1 (100 paise)." },
      { status: 400 }
    );
  }

  const payload = {
    amount: Math.round(body.amount), // paise, integer
    currency: body.currency ?? "INR",
    receipt: body.receipt ?? `receipt_${Date.now()}`,
  };

  const authHeader =
    "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  try {
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const rzpJson = (await rzpRes.json()) as RazorpayOrderResponse & RazorpayErrorResponse;

    if (!rzpRes.ok) {
      const errMsg =
        rzpJson.error?.description ?? "Failed to create Razorpay order.";
      return NextResponse.json(
        { success: false, error: errMsg },
        { status: rzpRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: rzpJson.id,
      amount: rzpJson.amount,
      currency: rzpJson.currency,
      keyId, // safe — this is the public key
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error creating Razorpay order.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 502 }
    );
  }
}
