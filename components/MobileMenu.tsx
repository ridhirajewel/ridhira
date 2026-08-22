"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { categories } from "@/lib/mock-data";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Bridal", href: "/collections/bridal" },
  { label: "The Atelier", href: "/our-story" },
  { label: "Contact", href: "/contact" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] lg:hidden ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute left-0 top-0 h-full w-[85%] max-w-sm bg-ivory shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <span className="font-serif text-xl tracking-tight text-ink">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-1.5 text-ink/70 transition hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="border-b border-hairline py-3.5 text-[15px] tracking-wide text-ink transition hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="px-6 py-4">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-bark/60">
            Shop by category
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`/collections/${c.slug}`}
                className="rounded-full border border-hairline px-3.5 py-1.5 text-[13px] text-ink transition hover:border-gold hover:text-gold"
              >
                {c.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
