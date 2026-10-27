import { getHeroBanner } from "@/lib/graphql";
import HeroSlider from "./HeroSlider";

const FALLBACK = {
  image:
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1800&auto=format&fit=crop",
  alt: "Model wearing layered gold jewellery",
  link: "/collections/our-collection",
};

export default async function Hero() {
  const fields = await getHeroBanner();

  // Desktop Images
  const rawDesktop = [
    fields?.heroBanner?.node,
    fields?.heroBanner2?.node,
    fields?.heroBanner3?.node,
  ];

  // Mobile Images (Only 1 for now, pad the rest with null so they fall back to desktop)
  const rawMobile = [
    fields?.herobannermobile1?.node,
    null,
    null,
  ];

  // Clean Desktop Array
  const desktopSlides = rawDesktop
    .filter((img): img is { sourceUrl: string; altText: string } => !!img?.sourceUrl)
    .map((img) => ({
      src: img.sourceUrl.trim(),
      alt: img.altText?.trim() || FALLBACK.alt,
    }));

  if (desktopSlides.length === 0) {
    desktopSlides.push({ src: FALLBACK.image, alt: FALLBACK.alt });
  }

  // Clean Mobile Array - If a mobile image doesn't exist, fallback to the desktop image for that slot
  const mobileSlides = desktopSlides.map((desktopSlide, index) => {
    const mobileImg = rawMobile[index];
    if (mobileImg?.sourceUrl) {
      return {
        src: mobileImg.sourceUrl.trim(),
        alt: mobileImg.altText?.trim() || FALLBACK.alt,
      };
    }
    return desktopSlide; 
  });

  return (
    <HeroSlider
      desktopSlides={desktopSlides}
      mobileSlides={mobileSlides}
      link={FALLBACK.link}
    />
  );
}