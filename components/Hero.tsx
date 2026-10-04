import { getHeroBanner } from "@/lib/graphql";
import HeroSlider from "./HeroSlider";

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

  // Extract all three potential images
  const rawImages = [
    fields?.heroBanner?.node,
    fields?.heroBanner2?.node,
    fields?.heroBanner3?.node,
  ];

  // Filter out any empty fields from WordPress and format them
  const slides = rawImages
    .filter((img): img is { sourceUrl: string; altText: string } => !!img?.sourceUrl)
    .map((img) => ({
      src: img.sourceUrl.trim(),
      alt: img.altText?.trim() || FALLBACK.alt,
    }));

  // Fallback if the client hasn't uploaded any images yet
  if (slides.length === 0) {
    slides.push({ src: FALLBACK.image, alt: FALLBACK.alt });
  }

  const heading = fields?.bannerHeading?.trim() || FALLBACK.heading;

 return <HeroSlider slides={slides} link="/collections/our-collection" />;
}