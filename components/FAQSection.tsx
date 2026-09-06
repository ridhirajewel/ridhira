"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

// Swap this content for whatever's most relevant to Ridhira — the layout
// and interaction below don't need to change.
const faqs: FAQItem[] = [
  {
    question: "Is every piece certified?",
    answer:
      "Yes. Each piece ships with its own certificate of authenticity, detailing metal purity and, where applicable, independent laboratory grading for every diamond or gemstone used.",
  },
  {
    question: "Can a piece be resized after purchase?",
    answer:
      "Most rings can be resized within two sizes up or down at no charge within 30 days of delivery. Reach out with your order number and we'll arrange collection and return shipping.",
  },
  {
    question: "Do you offer custom or bespoke orders?",
    answer:
      "We do. Bespoke commissions typically take four to six weeks from initial consultation to completion, depending on the design's complexity and stone sourcing.",
  },
  {
    question: "What is your exchange and return policy?",
    answer:
      "Unworn pieces in their original packaging can be returned within 14 days of delivery for a full refund. Bespoke and engraved pieces are made to order and are final sale.",
  },
  {
    question: "How should I care for my jewellery?",
    answer:
      "Store each piece separately to avoid scratching, remove it before swimming or applying fragrance, and have the setting checked by us once a year if it's worn daily.",
  },
  {
    question: "Where do you ship, and how long does it take?",
    answer:
      "We ship across India within 3–5 business days via insured courier, and internationally within 7–10 business days. Every shipment is tracked and signature-required.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left: intro — sticky on desktop so it stays in view while scanning questions */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-serif text-[32px] leading-tight text-ink lg:text-[40px]">
                Questions, answered
              </h2>
              <p className="mt-4 max-w-[360px] text-[15px] leading-relaxed text-ink/70">
                Everything worth knowing before your piece arrives, and after.
                Can&apos;t find what you need?{" "}
                <a
                  href="/contact"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  Reach out to us directly.
                </a>
              </p>
            </div>
          </div>

          {/* Right: accordion list */}
          <div className="lg:col-span-8">
            <div className="border-t border-hairline">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={faq.question} className="border-b border-hairline">
                    <button
                      onClick={() => toggle(index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                    >
                      <span
                        className={`font-serif text-[17px] transition-colors lg:text-[19px] ${
                          isOpen ? "text-gold" : "text-ink"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border transition-colors ${
                          isOpen
                            ? "border-gold text-gold"
                            : "border-hairline text-ink"
                        }`}
                      >
                        <Plus size={15} strokeWidth={1.5} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[640px] pb-6 text-[14.5px] leading-relaxed text-ink/70">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}