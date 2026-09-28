"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { Caveat, Playfair_Display } from "next/font/google";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const handwriting = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

type FormState = {
  name: string;
  email: string;
  orderNumber: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  orderNumber: "",
  message: "",
};

const fieldClasses =
  "w-full border-0 border-b border-gray-700 bg-transparent px-0 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#C1121F] focus:outline-none focus:ring-0 transition-colors";

const labelClasses = "block text-xs uppercase tracking-[0.2em] text-gray-600";

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: send `form` to your API route / email service here.
    setSubmitted(true);
    setForm(initialState);
  };

  return (
    <main
      className={`${serif.className} relative min-h-screen w-full bg-[#FAF6F0] text-gray-900`}
    >
      <Link
        href="/"
        className="absolute left-6 top-6 z-10 text-sm text-gray-900 transition-colors hover:text-[#C1121F] sm:left-10 sm:top-8"
      >
        ← Back to Home
      </Link>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 pb-24 pt-32 md:grid-cols-2 md:gap-20 md:px-12 lg:gap-28 lg:py-24 lg:pt-32">
        {/* Left column: contact info */}
        <section>
          <h1 className="text-5xl font-medium leading-tight sm:text-6xl lg:text-7xl">
            Get in touch
          </h1>
          <p
            className={`${handwriting.className} mt-3 text-4xl font-semibold text-[#C1121F] sm:text-5xl`}
          >
            we&rsquo;re here for you
          </p>

          <div className="mt-14 space-y-10">
            <div>
              <h2 className={labelClasses}>Customer Care</h2>
              <a
                href="mailto:hello@ridhira.in"
                className="mt-3 inline-block border-b border-transparent text-xl transition-colors hover:border-gray-900"
              >
                hello@ridhira.in
              </a>
            </div>

            <div>
              <h2 className={labelClasses}>Phone / WhatsApp</h2>
              <a
                href="tel:+919876543210"
                className="mt-3 inline-block border-b border-transparent text-xl transition-colors hover:border-gray-900"
              >
                +91 98765 43210
              </a>
            </div>

            <div>
              <h2 className={labelClasses}>Studio Hours</h2>
              <p className="mt-3 text-xl">Monday &ndash; Friday</p>
              <p className="text-xl text-gray-700">10 AM &ndash; 6 PM IST</p>
            </div>
          </div>
        </section>

        {/* Right column: form */}
        <section className="md:pt-4">
          {submitted ? (
            <div
              role="status"
              aria-live="polite"
              className="flex h-full min-h-[320px] flex-col items-start justify-center"
            >
              <p
                className={`${handwriting.className} text-5xl font-semibold text-[#C1121F] sm:text-6xl`}
              >
                Thank you.
              </p>
              <p className="mt-4 text-2xl leading-snug">
                We will be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div>
                <label htmlFor="name" className={labelClasses}>
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClasses}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>

              <div>
                <label htmlFor="orderNumber" className={labelClasses}>
                  Order Number{" "}
                  <span
                    className={`${handwriting.className} ml-1 text-lg normal-case tracking-normal text-[#C1121F]`}
                  >
                    (optional)
                  </span>
                </label>
                <input
                  id="orderNumber"
                  name="orderNumber"
                  type="text"
                  value={form.orderNumber}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>

              <div>
                <label htmlFor="message" className={labelClasses}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className={`${fieldClasses} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="bg-black px-8 py-3 text-sm uppercase tracking-[0.2em] text-[#FAF6F0] transition-colors hover:bg-gray-800"
              >
                Send Message
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}