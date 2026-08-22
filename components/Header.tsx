"use client";

import { useEffect, useState } from "react";
import { Menu, Search, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Rings", href: "/collections/rings" },
  { label: "Necklaces", href: "/collections/necklaces" },
  { label: "Earrings", href: "/collections/earrings" },
  { label: "Bridal", href: "/collections/bridal" },
  { label: "The Atelier", href: "/our-story" },
];

export default function Header() {
  const { cart, openCartDrawer } = useCart();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-ivory/95 backdrop-blur transition-shadow duration-300 ${
          isScrolled ? "shadow-[0_1px_0_0_theme(colors.hairline)]" : ""
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 lg:px-10">
          <button
            className="p-1.5 text-ink lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <a
            href="/"
            className="font-serif text-[26px] tracking-tight text-ink lg:text-[28px]"
          >
            Ridhira
          </a>

          <nav className="hidden lg:flex lg:items-center lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] uppercase tracking-[0.08em] text-ink/80 transition hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-full p-2 text-ink/80 transition hover:bg-ink/5 hover:text-gold"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Wishlist"
              className="hidden rounded-full p-2 text-ink/80 transition hover:bg-ink/5 hover:text-gold sm:inline-flex"
            >
              <Heart size={19} strokeWidth={1.5} />
            </button>
            <button
              aria-label={`Open cart, ${cart.itemsCount} items`}
              onClick={openCartDrawer}
              className="relative rounded-full p-2 text-ink/80 transition hover:bg-ink/5 hover:text-gold"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cart.itemsCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-oxblood text-[10px] font-medium text-ivory">
                  {cart.itemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="border-t border-hairline bg-ivory px-5 py-4 lg:px-10">
            <div className="mx-auto flex max-w-[1600px] items-center gap-3 border-b border-ink/20 pb-2">
              <Search size={16} className="text-ink/50" strokeWidth={1.5} />
              <input
                autoFocus
                type="text"
                placeholder="Search for rings, necklaces, gemstones…"
                className="w-full bg-transparent py-1 text-[15px] text-ink placeholder:text-ink/40 focus:outline-none"
              />
            </div>
          </div>
        )}
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
