import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import QuickView from "@/components/QuickView";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Ridhira",
  description:
    "Solid gold rings, necklaces, earrings and bridal sets, cast and hand-set in Jaipur.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${workSans.variable} font-sans`}>
        <CartProvider>
          {children}
          <CartDrawer />
          <QuickView />
        </CartProvider>
      </body>
    </html>
  );
}
