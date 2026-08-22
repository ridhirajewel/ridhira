import { Star } from "lucide-react";
import { testimonials } from "@/lib/mock-data";

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="mb-12 flex flex-col items-center text-center">
        <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">
          From the Ledger
        </p>
        <h2 className="font-serif text-[32px] text-ink lg:text-[40px]">
          Words from people who wear these daily
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="flex flex-col justify-between border border-hairline p-6"
          >
            <div>
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < t.rating ? "fill-gold text-gold" : "text-hairline"
                    }
                  />
                ))}
              </div>
              <blockquote className="text-[15px] leading-relaxed text-ink/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </div>
            <figcaption className="mt-6 border-t border-hairline pt-4">
              <p className="text-[14px] text-ink">{t.author}</p>
              <p className="text-xs text-bark/50">
                {t.location}
                {t.productName ? ` · ${t.productName}` : ""}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
