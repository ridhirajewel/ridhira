import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Ridhira",
  description: "Our shipping policy for handcrafted jewelry orders across India.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="bg-ivory min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-12 lg:py-24">
        <header className="mb-12 border-b border-hairline pb-8 lg:mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
            Ridhira Grace
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink lg:text-5xl">
            Shipping Policy
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">
            Delivery timelines and shipping details for your Ridhira jewelry orders.
          </p>
        </header>

        <article className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/75 prose-p:leading-relaxed prose-strong:text-ink prose-a:text-gold prose-a:no-underline hover:prose-a:underline">
          <section id="shipping" className="scroll-mt-24">
            <h2 className="font-serif text-2xl text-ink lg:text-3xl">Shipping Policy</h2>
            <div className="mt-6">
              <ul className="list-none space-y-4 pl-0">
                <li className="flex gap-3">
                  <span className="mt-1 font-serif text-gold" aria-hidden="true">&#10022;</span>
                  <span className="text-ink/75 leading-relaxed">
                    Standard delivery takes <strong>2–5 business days</strong>, depending on your location.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 font-serif text-gold" aria-hidden="true">&#10022;</span>
                  <span className="text-ink/75 leading-relaxed">
                    Orders are processed only on <strong>business days (Monday to Saturday)</strong> between <strong>9:00 AM and 6:00 PM</strong>. Orders placed on Sundays, public holidays, or after 6:00 PM will be processed on the next working day.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 font-serif text-gold" aria-hidden="true">&#10022;</span>
                  <span className="text-ink/75 leading-relaxed">
                    Deliveries are made from <strong>Monday to Saturday</strong> only.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 font-serif text-gold" aria-hidden="true">&#10022;</span>
                  <span className="text-ink/75 leading-relaxed">
                    Ready-stock items are usually dispatched within <strong>24–48 hours</strong>, unless mentioned otherwise.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 font-serif text-gold" aria-hidden="true">&#10022;</span>
                  <span className="text-ink/75 leading-relaxed">
                    Bulk or large-quantity orders may require an additional <strong>1–3 business days</strong> for dispatch and may be shipped in bulk packaging.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 font-serif text-gold" aria-hidden="true">&#10022;</span>
                  <span className="text-ink/75 leading-relaxed">
                    Enjoy delivery at little to no cost on all orders across India.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <hr className="my-14 border-t border-hairline" aria-hidden="true" />

          <section id="contact" className="scroll-mt-24">
            <h2 className="font-serif text-2xl text-ink lg:text-3xl">Contact Information</h2>
            <div className="mt-6">
              <p>
                For questions, please contact us at{" "}
                <a href="mailto:ridhiragrace@gmail.com">ridhiragrace@gmail.com</a>{" "}
                or DM us on Instagram at{" "}
                <a href="https://instagram.com/ridhiragrace" target="_blank" rel="noopener noreferrer">@ridhiragrace</a>{" "}
                (Mon&ndash;Sat, 10:00 am to 6:00 pm).
              </p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}