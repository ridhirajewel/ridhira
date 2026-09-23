import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | Ridhira",
  description: "The story behind Ridhira Grace — handcrafted solid gold jewelry from Jaipur.",
};

export default function OurStoryPage() {
  return (
    <main className="bg-ivory min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-12 lg:py-24">
        <header className="mb-12 border-b border-hairline pb-8 lg:mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
            Ridhira Grace
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink lg:text-5xl lg:text-6xl font-medium">
            Our Story
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm leading-relaxed text-ink/60">
            Handcrafted in Jaipur. Designed for generations.
          </p>
        </header>

        <article className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/75 prose-p:leading-relaxed prose-strong:text-ink prose-a:text-gold prose-a:no-underline hover:prose-a:underline">
          <section className="scroll-mt-24">
            <h2 className="font-serif text-3xl text-ink lg:text-4xl text-center mb-8">The Beginning</h2>
            <div className="mt-6 text-lg">
              <p>
                Ridhira Grace was born from a simple belief: jewelry should be more than adornment.
                It should carry meaning, hold memories, and become part of your story.
              </p>
              <p>
                Founded in the heart of Jaipur — a city where goldsmithing is not just a craft but a legacy — Ridhira Grace brings together
                generations of traditional artistry with contemporary design. Every piece begins as a sketch,
                passes through the hands of master karigars, and emerges as solid gold jewelry meant to be lived in.
              </p>
            </div>
          </section>

          <hr className="my-14 border-t border-hairline" aria-hidden="true" />

          <section className="scroll-mt-24">
            <h2 className="font-serif text-3xl text-ink lg:text-4xl text-center mb-8">Our Philosophy</h2>
            <div className="mt-6 text-lg">
              <p>
                <strong>Solid gold, always.</strong> We work exclusively with 14k and 18k solid gold — no plating,
                no vermeil, no compromise. Gold that doesn&rsquo;t tarnish, doesn&rsquo;t wear thin, and only grows more
                beautiful with time.
              </p>
              <p>
                <strong>Made to order.</strong> Each piece is created when you choose it. This means no mass production,
                no excess inventory, and jewelry that carries the intention of its maker. It also means we can
                customize — whether it&rsquo;s a different metal, a specific gemstone, or a personal engraving.
              </p>
              <p>
                <strong>Ethical by design.</strong> Our gold is responsibly sourced, our diamonds conflict-free,
                and our workshop operates with fair wages and safe conditions. We believe luxury shouldn&rsquo;t
                come at the cost of people or the planet.
              </p>
            </div>
          </section>

          <hr className="my-14 border-t border-hairline" aria-hidden="true" />

          <section className="scroll-mt-24">
            <h2 className="font-serif text-3xl text-ink lg:text-4xl text-center mb-8">The Jaipur Legacy</h2>
            <div className="mt-6 text-lg">
              <p>
                Jaipur has been a center of jewelry making since the 18th century, when Maharaja Sawai Jai Singh II
                invited master craftsmen from across India to settle in his new city. The techniques they brought —
                kundan, meenakari, thewa, jadau — have been passed down through generations of families who still
                practice them today.
              </p>
              <p>
                Our karigars are the inheritors of this lineage. When you wear Ridhira Grace, you&rsquo;re wearing
                centuries of knowledge, millions of hours of practice, and the quiet pride of artisans who
                treat gold not as a material but as a medium for storytelling.
              </p>
            </div>
          </section>

          <hr className="my-14 border-t border-hairline" aria-hidden="true" />

          <section className="scroll-mt-24">
            <h2 className="font-serif text-3xl text-ink lg:text-4xl text-center mb-8">A Promise</h2>
            <div className="mt-6 text-lg text-center">
              <p>
                We&rsquo;re not here to sell you jewelry. We&rsquo;re here to create pieces you&rsquo;ll pass down.
                Pieces that mark milestones — an engagement, an anniversary, a birthday, a Tuesday that felt special.
                Pieces that, years from now, will still feel like <em>yours</em>.
              </p>
              <p className="mt-6 font-serif text-xl text-gold">
                &ldquo;Jewelry is the only thing that lasts forever. Make it count.&rdquo;
              </p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}