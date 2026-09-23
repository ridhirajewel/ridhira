import Image from "next/image";
import { getHeroBanner } from "@/lib/graphql";

const FALLBACK = {
  image:
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1800&auto=format&fit=crop",
  alt: "Model wearing layered gold jewellery",
  heading: "Weight that feels\nlike intention.",
  subheading:
    "Solid gold pieces, cast and finished by hand in small batches — nothing plated, nothing rushed.",
  buttonText: "Shop the Edit",
  buttonLink: "/collections/our-collection",
};

const EYEBROW = "The Winter Edit";
const SECONDARY_CTA = { label: "Our Story", href: "/our-story" };

export default async function Hero() {
  const fields = await getHeroBanner();

  // Data coming from WordPress
  const image =
    fields?.heroBanner?.node?.sourceUrl?.trim() || FALLBACK.image;

  const alt =
    fields?.heroBanner?.node?.altText?.trim() || FALLBACK.alt;

  const heading =
    fields?.bannerHeading?.trim() || FALLBACK.heading;

  // These aren't currently available in WordPress,
  // so they remain local/static values.
  const subheading = FALLBACK.subheading;
  const buttonText = FALLBACK.buttonText;
  const buttonLink = FALLBACK.buttonLink;

  return (
    <section className="relative h-[560px] w-full overflow-hidden sm:h-[620px] lg:h-[720px]">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/20 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-center px-5 lg:px-10">
        <div className="max-w-xl">
          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.2em] text-gold-light">
            {EYEBROW}
          </p>

          <h1 className="whitespace-pre-line font-serif text-[38px] leading-[1.08] text-ivory sm:text-[48px] lg:text-[58px]">
            {heading}
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ivory/85">
            {subheading}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={buttonLink}
              className="bg-ivory px-7 py-3.5 text-[13px] uppercase tracking-[0.12em] text-ink transition hover:bg-gold hover:text-ivory"
            >
              {buttonText}
            </a>

            <a
              href={SECONDARY_CTA.href}
              className="border border-ivory/60 px-7 py-3.5 text-[13px] uppercase tracking-[0.12em] text-ivory transition hover:border-ivory hover:bg-ivory/10"
            >
              {SECONDARY_CTA.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}