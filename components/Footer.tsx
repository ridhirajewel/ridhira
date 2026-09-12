"use client";

import { useState } from "react";
import { ArrowRight, Instagram } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    // Add your newsletter submission logic here
  };

  return (
    <footer className="bg-[#0a0a0a] text-white py-12 px-6 font-sans border-t border-white/10">
      <div className="mx-auto max-w-5xl grid grid-cols-1 gap-10 md:grid-cols-4 text-center md:text-left">
        
        {/* Newsletter Section */}
        <div className="md:col-span-2 flex flex-col items-center md:items-start">
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
            Love letters to your inbox
          </h3>
          {submitted ? (
            <p className="py-2.5 text-sm text-gray-300">
              Thank you for subscribing!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-transparent border border-white/30 rounded-[4px] px-4 py-2.5 text-sm focus:outline-none focus:border-white placeholder:text-gray-500 transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </form>
          )}
        </div>

        {/* Contact & Address Section */}
        <div className="flex flex-col items-center md:items-start gap-5">
          <div>
            <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
              Contact Us
            </h3>
            <a
              href="https://wa.me/919217154034"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              </svg>
              +91 9217154034
            </a>
          </div>
          <div>
            <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
              Our Address
            </h3>
            <p className="text-sm text-gray-400">
              New Delhi, Delhi - 110006
            </p>
          </div>
        </div>

        {/* Quick Links & Socials Section */}
        <div className="flex flex-col items-center md:items-start gap-5">
          <div>
            <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="/orders" className="hover:text-white transition-colors">
                Orders
              </a>
              <a href="/profile" className="hover:text-white transition-colors">
                Profile
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <a
              href="#"
              aria-label="Instagram"
              className="text-white hover:text-gray-400 transition-colors"
            >
              <Instagram size={18} strokeWidth={1.5} />
            </a>
            <a
              href="#"
              aria-label="Pinterest"
              className="text-white hover:text-gray-400 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.439 2.981 7.439 6.933 0 4.161-2.621 7.514-6.262 7.514-1.224 0-2.375-.636-2.768-1.385l-.753 2.871c-.271 1.039-.997 2.34-1.492 3.136 1.125.347 2.316.535 3.551.535 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.638 0 12.017 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}