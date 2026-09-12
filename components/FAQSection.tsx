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
    question: "Can I wear anti-tarnish jewellery every day?", //[cite: 1]
    answer:
      "Yes, you can wear anti-tarnish jewellery every day. It is designed for daily use, making it perfect for styling your favorite pinterest jewellery, a cute heart pendant, or simple minimal jewellery looks. It is durable, water-resistant, and keeps its shine for a long time.", //[cite: 1]
  },
  {
    question: "Does anti-tarnish jewellery turn skin green?", //[cite: 1]
    answer:
      "No, good-quality anti-tarnish jewellery does not turn your skin green. It is made with skin-friendly materials that prevent reactions, so your necklace and rings stay safe to wear all day. Green stains usually happen with low-quality metals, but anti-tarnish pieces are designed to avoid this issue.", //[cite: 1]
  },
  {
    question: "Is minimal jewellery safe for sensitive skin?", //[cite: 1]
    answer:
      "Yes, minimal jewellery is generally safe for sensitive skin, especially when made from hypoallergenic and nickel-free materials. Its lightweight and simple design reduces irritation, making it comfortable for daily wear. When choosing pieces like best western jewelry or trendy pinterest jewellery necklaces, always opt for high-quality, skin-friendly materials to ensure maximum comfort and safety.", //[cite: 1]
  },
  {
    question: "What is the best way to clean western jewellery?", //[cite: 1]
    answer:
      "The best way to clean jewellery is simple and gentle: Wipe with a soft cloth after use, wash occasionally with mild soap and lukewarm water, dry completely before storing, and avoid harsh chemicals or abrasive materials, as they can damage the coating.", //[cite: 1]
  },
  {
    question: "Is Pinterest Style jewellery good for gifting?", //[cite: 1]
    answer:
      "Yes, anti-tarnish jewellery is a great gifting option. It offers long-lasting shine, trendy designs, and is suitable for daily wear. Its durability and skin-friendly nature make it a thoughtful and practical gift for any occasion.", //[cite: 1]
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
                        className={`font-serif text-[17px] transition-colors lg:text-[19px] ${isOpen ? "text-gold" : "text-ink"
                          }`}
                      >
                        {faq.question}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border transition-colors ${isOpen
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