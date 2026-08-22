"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const messages = [
  "Complimentary engraving on all signet rings this month",
  "Free insured shipping on orders above ₹15,000",
  "Lifetime polish & re-plating on every piece we sell",
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-bottle text-ivory">
      <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-center px-10 text-center">
        <p
          key={index}
          className="animate-fade-in text-[11px] font-medium tracking-[0.14em] uppercase"
        >
          <span className="mr-2 font-serif italic normal-case tracking-normal text-gold-light">
            No. {String(index + 1).padStart(2, "0")}
          </span>
          {messages[index]}
        </p>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => setVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ivory/70 transition hover:bg-ivory/10 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-light"
        >
          <X size={13} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
