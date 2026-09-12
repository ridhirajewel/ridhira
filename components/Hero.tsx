import Image from "next/image";

interface HeroImage {
  sourceUrl: string;
  altText: string;
}

interface HeroBannerFields {
  heroImage: HeroImage | null;
  heroHeading: string | null;
  heroSubheading: string | null;
  heroButtonText: string | null;
  heroButtonLink: string | null;
}

interface WPGraphQLResponse {
  data?: {
    page?: {
      // NOTE: verify this key against your GraphiQL schema. You said the
      // field group is exposed as `herobanner` — WPGraphQL for ACF derives
      // this from the field group's "GraphQL Field Name" setting, so it
      // could also come through camelCased as `heroBanner`. If the fetch
      // below returns null unexpectedly, that's the first thing to check.
      herobanner?: HeroBannerFields | null;
    } | null;
  };
  errors?: { message: string }[];
}

const HERO_QUERY = /* GraphQL */ `
  query HeroBanner {
    page(id: "home", idType: URI) {
      herobanner {
        heroImage {
          sourceUrl
          altText
        }
        heroHeading
        heroSubheading
        heroButtonText
        heroButtonLink
      }
    }
  }
`;

// Fallback content so the hero never breaks if WPGraphQL is unreachable or
// the client leaves a field blank in WordPress.
const FALLBACK = {
  image:
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1800&auto=format&fit=crop",
  alt: "Model wearing layered gold jewellery",
  heading: "Weight that feels\nlike intention.",
  subheading:
    "Solid gold pieces, cast and finished by hand in small batches — nothing plated, nothing rushed.",
  buttonText: "Shop the Edit",
  buttonLink: "/new-arrivals",
};

// Not currently modeled in the `herobanner` ACF field group you listed.
// Left as static content — swap for a `heroEyebrow` field later if the
// client wants to control this from WP too.
const EYEBROW = "The Winter Edit";
const SECONDARY_CTA = { label: "Our Story", href: "/our-story" };

async function getHeroBanner(): Promise<HeroBannerFields | null> {
  try {
    const res = await fetch("https://wp.ridhira.in/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: HERO_QUERY }),
      // Revalidate every 60s (ISR) so edits in WP show up quickly without
      // hitting WPGraphQL on every request.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`WPGraphQL hero fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const json: WPGraphQLResponse = await res.json();

    if (json.errors?.length) {
      console.error("WPGraphQL hero fetch returned errors:", json.errors);
      return null;
    }

    return json.data?.page?.herobanner ?? null;
  } catch (err) {
    // Network failure, DNS issue, WP down, etc. — never let the homepage
    // crash because of the hero banner.
    console.error("WPGraphQL hero fetch threw:", err);
    return null;
  }
}

export default async function Hero() {
  const fields = await getHeroBanner();

  const image = fields?.heroImage?.sourceUrl?.trim() || FALLBACK.image;
  const alt = fields?.heroImage?.altText?.trim() || FALLBACK.alt;
  const heading = fields?.heroHeading?.trim() || FALLBACK.heading;
  const subheading = fields?.heroSubheading?.trim() || FALLBACK.subheading;
  const buttonText = fields?.heroButtonText?.trim() || FALLBACK.buttonText;
  const buttonLink = fields?.heroButtonLink?.trim() || FALLBACK.buttonLink;

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