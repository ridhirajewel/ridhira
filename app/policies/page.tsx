import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies | Ridhira",
  description:
    "Return & Exchange, Shipping, and Terms & Conditions for Ridhira Grace.",
};

const NAV_ITEMS = [
  { href: "#returns", label: "Return & Exchange" },
  { href: "#shipping", label: "Shipping Policy" },
  { href: "#terms", label: "Terms & Conditions" },
];

export default function PoliciesPage() {
  return (
    <main className="bg-ivory min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        {/* Page header */}
        <header className="mb-12 border-b border-hairline pb-8 lg:mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
            Ridhira Grace
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink lg:text-5xl">
            Policies
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">
            Everything you need to know about returns, shipping, and the
            terms that govern your use of this website.
          </p>
        </header>

        {/* 12-column grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Sidebar nav */}
          <aside className="lg:col-span-3">
            <nav className="lg:sticky lg:top-24">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink/40">
                On this page
              </p>
              <ul className="space-y-1 border-l border-hairline">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="-ml-px block border-l border-transparent py-2 pl-4 text-sm text-ink/70 transition-colors hover:border-gold hover:text-gold"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9">
            <article className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/75 prose-p:leading-relaxed prose-strong:text-ink prose-a:text-gold prose-a:no-underline hover:prose-a:underline">
              {/* Section 1: Returns */}
              <PolicySection id="returns" title="Return &amp; Exchange Policy">
                <ul className="list-none space-y-4 pl-0">
                  <PolicyBullet>
                    As all our jewelry is handpicked and made to order, we do
                    not accept returns. Each piece is picked especially for
                    you, therefore our policy follows no refunds or
                    exchanges.
                  </PolicyBullet>
                  <PolicyBullet>
                    In case you receive a damaged or defective item, please
                    share an unboxing video within 48 hours of delivery. We
                    will review the issue and assist you accordingly. Based
                    on the situation, an exchange or refund may be
                    considered.
                  </PolicyBullet>
                  <PolicyBullet>
                    Your satisfaction matters to us, and we will make every
                    reasonable effort to ensure a smooth and fair resolution.
                  </PolicyBullet>
                </ul>
              </PolicySection>

              <SectionDivider />

              {/* Section 2: Shipping */}
              <PolicySection id="shipping" title="Shipping Policy">
                <ul className="list-none space-y-4 pl-0">
                  <PolicyBullet>
                    Standard delivery takes{" "}
                    <strong>2–5 business days</strong>, depending on your
                    location.
                  </PolicyBullet>
                  <PolicyBullet>
                    Orders are processed only on{" "}
                    <strong>business days (Monday to Saturday)</strong>{" "}
                    between <strong>9:00 AM and 6:00 PM</strong>. Orders
                    placed on Sundays, public holidays, or after 6:00 PM will
                    be processed on the next working day.
                  </PolicyBullet>
                  <PolicyBullet>
                    Deliveries are made from{" "}
                    <strong>Monday to Saturday</strong> only.
                  </PolicyBullet>
                  <PolicyBullet>
                    Ready-stock items are usually dispatched within{" "}
                    <strong>24–48 hours</strong>, unless mentioned otherwise.
                  </PolicyBullet>
                  <PolicyBullet>
                    Bulk or large-quantity orders may require an additional{" "}
                    <strong>1–3 business days</strong> for dispatch and may
                    be shipped in bulk packaging.
                  </PolicyBullet>
                  <PolicyBullet>
                    Enjoy delivery at little to no cost on all orders across
                    India.
                  </PolicyBullet>
                </ul>
              </PolicySection>

              <SectionDivider />

              {/* Section 3: Terms & Conditions */}
              <PolicySection id="terms" title="Terms &amp; Conditions">
                <p>
                  This website is owned and operated by Ridhira Grace
                  (hereinafter referred to as &ldquo;We&rdquo;,
                  &ldquo;Us&rdquo;, &ldquo;Our&rdquo;, &ldquo;Ridhira
                  Grace&rdquo;, or &ldquo;The Company&rdquo;). By accessing
                  or using this website, you (&ldquo;You&rdquo; refers to
                  any user or visitor of the website) agree to be bound by
                  the Terms and Conditions stated herein, as may be amended
                  from time to time. These terms apply for an indefinite
                  period and remain effective for as long as you access or
                  use this website.
                </p>
                <p>
                  Ridhira Grace reserves the right to modify, update, or
                  revise these Terms and Conditions at its sole discretion
                  without prior notice. It is your responsibility to review
                  them periodically to stay informed of any changes.
                  Continued use of the website constitutes acceptance of the
                  revised terms.
                </p>
                <p>
                  All rights, including intellectual property and copyright,
                  related to this website and its content are owned by
                  Ridhira Grace. Any reproduction, copying, storage, or use
                  of the website content, in part or in full, is strictly
                  prohibited without prior written permission from the
                  Company.
                </p>
                <p>
                  Individuals who are not competent to enter into a contract
                  as defined under the Indian Contract Act, 1872, are not
                  permitted to use this website. If you are under the age of
                  18, you are not eligible to access, purchase from, or
                  engage in any transaction through this website.
                </p>

                <h3 className="mt-10">Pricing Policy for Online Merchandise</h3>
                <p>
                  At{" "}
                  <a
                    href="https://ridhira.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ridhira.in/
                  </a>{" "}
                  we&rsquo;re committed to offering shopping convenience,
                  exceptional service and an exciting product selection at
                  competitive prices.
                </p>

                <h3 className="mt-10">GST</h3>
                <p>
                  Since Ridhira Grace doesn&rsquo;t have GST, it does not
                  charge GST from its customers. In reference to the future
                  requirement when it would be eligible for GST, all our
                  prices shall be inclusive of GST rate on jewellery.
                </p>

                <h3 className="mt-10">Online Payment</h3>
                <p>
                  All payments on{" "}
                  <a
                    href="https://ridhira.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ridhira.in/
                  </a>{" "}
                  are securely processed. We accept most major credit and
                  debit cards including Visa, MasterCard and American
                  Express. We will ensure confirmation of ordered item(s),
                  availability and shipping before processing your order
                  transaction.
                </p>

                <h3 className="mt-10">Credit Card Details</h3>
                <p>
                  You acknowledge and agree that all credit card information
                  shared by you while using this website will be true,
                  accurate, and complete. You confirm that you will only use
                  a credit card that is legally owned by you, and that any
                  transaction carried out on the website must be made using
                  your own authorized payment card.
                </p>

                <h3 className="mt-10">Sale and Promotion</h3>
                <p>
                  All sale offers are valid while stocks last. The duration
                  of any sale or promotional offer is determined solely by
                  Ridhira Grace, which reserves the right to extend, modify,
                  or discontinue the sale at any time without prior notice.
                </p>
                <p>
                  Products listed under the Sale category may be added,
                  removed, or changed, and discounted prices may also be
                  revised at the sole discretion of Ridhira Grace.
                </p>
                <p>
                  Please note that no returns or exchanges will be accepted
                  on sale items. For complete details, kindly refer to our{" "}
                  <a href="#returns">Return and Exchange Policy</a>.
                </p>
                <p>
                  If you have any questions regarding ongoing sales or
                  promotions, please reach out to our customer support at{" "}
                  <a href="mailto:ridhiragrace@gmail.com">
                    ridhiragrace@gmail.com
                  </a>
                  .
                </p>
                <p>
                  Ridhira Grace retains the right, at any time, to amend,
                  add, remove, or modify any of the sale or promotion terms,
                  in whole or in part, or to replace the current promotion
                  with another offer, whether similar or different, or to
                  withdraw it entirely. The decision of Ridhira Grace in
                  this regard shall be final and binding, without the
                  requirement of any prior communication to customers.
                </p>

                <h3 className="mt-10">Contact Information</h3>
                <p>
                  For questions, please contact us at{" "}
                  <a href="mailto:ridhiragrace@gmail.com">
                    ridhiragrace@gmail.com
                  </a>{" "}
                  or DM us on Instagram at{" "}
                  <a
                    href="https://instagram.com/ridhiragrace"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @ridhiragrace
                  </a>{" "}
                  (Mon&ndash;Sat, 10:00 am to 6:00 pm).
                </p>
              </PolicySection>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- Presentational helpers (kept in-file for a single, self-contained Server Component) ---------- */

function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-serif text-2xl text-ink lg:text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function PolicyBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 font-serif text-gold" aria-hidden="true">
        &#10022;
      </span>
      <span className="text-ink/75 leading-relaxed">{children}</span>
    </li>
  );
}

function SectionDivider() {
  return (
    <hr className="my-14 border-t border-hairline" aria-hidden="true" />
  );
}