import Image from "next/image";
import { categories } from "@/lib/mock-data";

export default function FeaturedCollections() {
  return (
    <section className="mx-auto max-w-[1600px] py-20 pl-5 lg:py-28 lg:pl-10">
      <div className="mb-12 pr-5 flex flex-col items-center text-center lg:pr-10">
        <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">
          Shop by Category
        </p>
        <h2 className="font-serif text-[32px] text-ink lg:text-[40px]">
          Every piece, sorted by occasion
        </h2>
      </div>

      {/* 
        Native CSS Slider:
        - snap-x & snap-mandatory: Creates the smooth snapping effect
        - overflow-x-auto: Enables horizontal scrolling
        - [&::-webkit-scrollbar]:hidden etc: Hides the scrollbar across all browsers 
      */}
      <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-8 pr-5 sm:gap-6 lg:gap-8 lg:pr-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`/collections/${category.slug}`}
            // shrink-0 prevents items from squishing, w-[...] defines fixed widths per breakpoint
            className="group flex flex-col items-center gap-4 text-center shrink-0 snap-start w-[130px] sm:w-[150px] lg:w-[180px]"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-full bg-white ring-1 ring-hairline">
              {category.image && (
                <Image
                  src={category.image.sourceUrl}
                  alt={category.image.altText}
                  fill
                  sizes="(max-width: 768px) 130px, (max-width: 1024px) 150px, 180px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              )}
            </div>
            <div>
              <p className="text-[14px] text-ink transition group-hover:text-gold">
                {category.name}
              </p>
              <p className="text-xs text-bark/50">{category.count} pieces</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}