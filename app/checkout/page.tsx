"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle, Truck, CreditCard, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/format";
import type { CheckoutAddress, LineItemInput, Order } from "@/types/woocommerce";

interface FormErrors {
  billing?: Partial<Record<keyof BillingAddress, string>>;
  shipping?: Partial<Record<keyof CheckoutAddress, string>>;
  general?: string;
}

interface BillingAddress extends CheckoutAddress {
  email: string;
  phone: string;
}

interface CheckoutFormData {
  billing: BillingAddress;
  shipping: CheckoutAddress;
  sameAsBilling: boolean;
  paymentMethod: string;
  customerNote: string;
}

// Mirrors the discriminated union returned by /api/checkout — no real Order
// exists on failure, so it isn't forced into the shape.
type CheckoutApiResponse =
  | { success: true; order: Order }
  | { success: false; errors: { code: string; message: string }[] };

const initialFormData: CheckoutFormData = {
  billing: {
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "IN",
    email: "",
    phone: "",
  },
  shipping: {
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "IN",
  },
  sameAsBilling: true,
  paymentMethod: "cod",
  customerNote: "",
};

const fieldConfig = [
  { name: "firstName", label: "First Name", type: "text", required: true, icon: User },
  { name: "lastName", label: "Last Name", type: "text", required: true, icon: User },
  { name: "email", label: "Email Address", type: "email", required: true, icon: User },
  { name: "phone", label: "Phone Number", type: "tel", required: true, icon: User },
  { name: "address1", label: "Street Address", type: "text", required: true, icon: Truck },
  { name: "address2", label: "Apartment, suite, etc. (optional)", type: "text", required: false, icon: Truck },
  { name: "city", label: "City", type: "text", required: true, icon: Truck },
  { name: "state", label: "State", type: "text", required: true, icon: Truck },
  { name: "postcode", label: "PIN Code / Postal Code", type: "text", required: true, icon: Truck },
] as const;

type FieldConfig = typeof fieldConfig[number];
type BillingFieldName = FieldConfig["name"];

export default function CheckoutPage() {
  const { cart, closeCartDrawer } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/");
    }
  }, [cart.items.length, router]);

  useEffect(() => {
    closeCartDrawer();
  }, [closeCartDrawer]);

  const validateField = (name: keyof BillingAddress, value: string, isRequired: boolean): string | undefined => {
    if (isRequired && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Invalid email address";
    }
    if (name === "phone" && value && !/^[\d\s\-\+\(\)]{10,}$/.test(value)) {
      return "Invalid phone number";
    }
    if (name === "postcode" && value && !/^\d{6}$/.test(value)) {
      return "Invalid PIN code (6 digits)";
    }
    return undefined;
  };

  const handleChange = (section: "billing" | "shipping", name: BillingFieldName, value: string) => {
    const field = fieldConfig.find((f) => f.name === name);
    const error = field ? validateField(name, value, field.required) : undefined;

    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));

    setErrors((prev) => ({
      ...prev,
      [section]: { ...prev[section] ?? {}, [name]: error },
    }));

    if (section === "billing" && formData.sameAsBilling) {
      setFormData((prev) => ({
        ...prev,
        shipping: { ...prev.shipping, [name]: value },
      }));
    }
  };

  const handleSameAsBillingChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sameAsBilling: checked,
      shipping: checked ? prev.billing : prev.shipping,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { billing: {}, shipping: {} };
    let hasErrors = false;

    fieldConfig.forEach((field) => {
      const fieldName = field.name as BillingFieldName;
      const billingValue = formData.billing[fieldName] ?? "";
      const billingError = validateField(fieldName, billingValue, field.required);
      if (billingError) {
        newErrors.billing![fieldName] = billingError;
        hasErrors = true;
      }

      if (!formData.sameAsBilling) {
        const shippingFieldNames = ["firstName", "lastName", "company", "address1", "address2", "city", "state", "postcode", "country"] as const;
        type ShippingFieldName = typeof shippingFieldNames[number];
        if (shippingFieldNames.includes(fieldName as ShippingFieldName)) {
          const shippingValue = formData.shipping[fieldName as ShippingFieldName] ?? "";
          const shippingError = validateField(fieldName, shippingValue, field.required);
          if (shippingError) {
            newErrors.shipping![fieldName as ShippingFieldName] = shippingError;
            hasErrors = true;
          }
        }
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const prepareLineItems = (): LineItemInput[] => {
    return cart.items.map((item) => ({
      productId: item.productId,
      variationId: item.variationId,
      quantity: item.quantity,
      metaData: item.attributes?.map((attr) => ({
        key: attr.name,
        value: attr.value,
      })),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const lineItems = prepareLineItems();

      const payload = {
        billing: formData.billing,
        shipping: formData.sameAsBilling ? formData.billing : formData.shipping,
        lineItems,
        paymentMethod: formData.paymentMethod,
        paymentMethodTitle: formData.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
        customerNote: formData.customerNote,
        setPaid: false,
      };

      // Route through our own API — the frontend never talks to WooCommerce
      // directly, so there's no CORS issue and no WC keys exposed to the browser.
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: CheckoutApiResponse = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage =
          !data.success && data.errors?.[0]?.message
            ? data.errors[0].message
            : "Failed to place order. Please try again.";
        throw new Error(errorMessage);
      }

      setSubmitSuccess(true);
      localStorage.removeItem("luxe-atelier-cart");

      setTimeout(() => {
        router.push(`/checkout/order-success/${data.order.databaseId}`);
        router.refresh();
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (section: "billing" | "shipping", field: FieldConfig) => {
    const Icon = field.icon;
    const fieldName = field.name as BillingFieldName;
    const sectionErrors = errors[section] as Partial<Record<BillingFieldName, string>> | undefined;
    const error = sectionErrors?.[fieldName];
    const sectionData = formData[section] as Record<BillingFieldName, string>;
    const value = sectionData[fieldName] ?? "";

    return (
      <div className="relative">
        <label htmlFor={`${section}-${fieldName}`} className="block text-[12px] font-medium uppercase tracking-[0.1em] text-ink/70 mb-1.5">
          {field.label} {field.required && <span className="text-oxblood" aria-hidden="true">*</span>}
        </label>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} strokeWidth={1.5} />
          <input
            id={`${section}-${fieldName}`}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(section, fieldName, e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-sm bg-white text-ink placeholder:text-ink/40 transition-colors ${
              error ? "border-oxblood focus:border-oxblood focus:ring-1 focus:ring-oxblood" : "border-hairline focus:border-gold focus:ring-1 focus:ring-gold"
            }`}
            disabled={isSubmitting}
            required={field.required}
            autoComplete={section === "billing" ? fieldName : `shipping ${fieldName}`}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-oxblood" role="alert">{error}</p>
        )}
      </div>
    );
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-ivory px-5">
        <div className="text-center">
          <p className="font-serif text-lg text-ink">Your cart is empty</p>
          <p className="mt-2 text-sm text-bark/60">Add some pieces before checking out.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-ivory py-10 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <h1 className="font-serif text-[30px] leading-tight text-ink lg:text-[38px] mb-10">
          Checkout
        </h1>

        {submitSuccess && (
          <div className="mb-8 flex items-center gap-3 rounded-lg border border-emerald/30 bg-emerald/10 p-4 text-emerald animate-fade-in" role="status">
            <CheckCircle size={20} strokeWidth={2} />
            <p className="font-medium">Order placed successfully! Redirecting…</p>
          </div>
        )}

        {submitError && (
          <div className="mb-8 flex items-center gap-3 rounded-lg border border-oxblood/30 bg-oxblood/10 p-4 text-oxblood animate-fade-in" role="alert">
            <AlertCircle size={20} strokeWidth={2} />
            <p className="font-medium">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-12 lg:gap-12" noValidate>
          <div className="lg:col-span-7 space-y-8">
            <fieldset className="space-y-6">
              <legend className="font-serif text-lg text-ink mb-4">Billing Details</legend>
              {fieldConfig.map((field) => renderField("billing", field))}
            </fieldset>

            <fieldset className="space-y-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="same-as-billing"
                  checked={formData.sameAsBilling}
                  onChange={(e) => handleSameAsBillingChange(e.target.checked)}
                  className="w-4 h-4 rounded border-hairline text-gold focus:ring-gold focus:ring-2"
                />
                <label htmlFor="same-as-billing" className="text-sm text-ink">
                  Ship to the same address
                </label>
              </div>

              {!formData.sameAsBilling && (
                <>
                  <legend className="font-serif text-lg text-ink mb-4">Shipping Details</legend>
                  {fieldConfig.map((field) => renderField("shipping", field))}
                </>
              )}
            </fieldset>

            <fieldset className="space-y-4 border-t border-hairline pt-6">
              <legend className="font-serif text-lg text-ink mb-4">Payment Method</legend>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-4 h-4 text-gold border-ink/30 focus:ring-gold focus:ring-2"
                    disabled={isSubmitting}
                  />
                  <div className="flex items-center gap-3 p-3 border border-hairline rounded-sm hover:border-gold transition-colors">
                    <CreditCard className="text-ink/60" size={20} strokeWidth={1.5} />
                    <span className="text-sm text-ink">Cash on Delivery</span>
                    <span className="ml-auto text-xs text-bark/50">Pay when you receive your order</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer opacity-50 pointer-events-none">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={formData.paymentMethod === "razorpay"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-4 h-4 text-gold border-ink/30 focus:ring-gold focus:ring-2"
                    disabled
                  />
                  <div className="flex items-center gap-3 p-3 border border-hairline rounded-sm">
                    <CreditCard className="text-ink/60" size={20} strokeWidth={1.5} />
                    <span className="text-sm text-ink">Online Payment (Razorpay)</span>
                    <span className="ml-auto text-xs text-bark/50">Coming soon</span>
                  </div>
                </label>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="font-serif text-lg text-ink mb-4">Order Notes (Optional)</legend>
              <textarea
                value={formData.customerNote}
                onChange={(e) => setFormData((prev) => ({ ...prev, customerNote: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-hairline rounded-sm bg-white text-ink placeholder:text-ink/40 focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
                placeholder="Special instructions, gift message, preferred delivery time…"
                disabled={isSubmitting}
              />
            </fieldset>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white border border-hairline rounded-lg p-6">
                <h2 className="font-serif text-lg text-ink mb-4">Order Summary</h2>

                <ul className="space-y-4 mb-6 divide-y divide-hairline">
                  {cart.items.map((item) => (
                    <li key={item.key} className="flex gap-3 py-2">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-ivory">
                        <img
                          src={item.image.sourceUrl}
                          alt={item.image.altText}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink truncate">{item.name}</p>
                        {item.attributes && item.attributes.length > 0 && (
                          <p className="text-xs text-bark/50 mt-0.5">
                            {item.attributes.map((a) => a.value).join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-ink/60 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-serif text-sm text-ink whitespace-nowrap">
                        {formatMoney(item.subtotal)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 border-t border-hairline pt-4">
                  <div className="flex justify-between text-sm text-ink">
                    <span>Subtotal</span>
                    <span className="font-serif">{formatMoney(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-ink">
                    <span>Shipping</span>
                    <span className="font-serif">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-ink">
                    <span>Tax</span>
                    <span className="font-serif">Included</span>
                  </div>
                  <div className="flex justify-between text-lg font-serif text-ink border-t border-hairline pt-3">
                    <span>Total</span>
                    <span>{formatMoney(cart.total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="mt-6 w-full bg-ink py-3.5 text-sm uppercase tracking-[0.14em] text-ivory transition hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                      Placing Order…
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-bark/50">
                  By placing your order, you agree to our{" "}
                  <a href="/terms" className="underline hover:text-gold">Terms of Sale</a>
                  {" "}and{" "}
                  <a href="/privacy" className="underline hover:text-gold">Privacy Policy</a>
                  .
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}