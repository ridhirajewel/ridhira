import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Exchange Policy | Ridhira",
  description: "Our return and exchange policy for handcrafted jewelry.",
};

export default function ReturnsPolicyPage() {
  return (
    <main className="bg-ivory min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-12 lg:py-24">
        <header className="mb-12 border-b border-hairline pb-8 lg:mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
            Ridhira Grace
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink lg:text-5xl">
            Return & Exchange Policy
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">
            Everything you need to know about returns and exchanges for your Ridhira jewelry.
          </p>
        </header>

        <article className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/75 prose-p:leading-relaxed prose-strong:text-ink prose-a:text-gold prose-a:no-underline hover:prose-a:underline">
          <section id="returns" className="scroll-mt-24">
            <h2 className="font-serif text-2xl text-ink lg:text-3xl">Return & Exchange Policy</h2>
            <div className="mt-6">
              <ul className="list-none space-y-4 pl-0">
                <li className="flex gap-3">
                  <span className="mt-1 font-serif text-gold" aria-hidden="true">&#10022;</span>
                  <span className="text-ink/75 leading-relaxed">
                    As all our jewelry is handpicked and made to order, we do not accept returns. Each piece is picked especially for you, therefore our policy follows no refunds or exchanges.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 font-serif text-gold" aria-hidden="true">&#10022;</span>
                  <span className="text-ink/75 leading-relaxed">
                    In case you receive a damaged or defective item, please share an unboxing video within 48 hours of delivery. We will review the issue and assist you accordingly. Based on the situation, an exchange or refund may be considered.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 font-serif text-gold" aria-hidden="true">&#10022;</span>
                  <span className="text-ink/75 leading-relaxed">
                    Your satisfaction matters to us, and we will make every reasonable effort to ensure a smooth and fair resolution.
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