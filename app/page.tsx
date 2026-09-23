import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCollections from "@/components/FeaturedCollections";
import BestSellers from "@/components/BestSellers";
import CraftsmanshipSpotlight from "@/components/CraftsmanshipSpotlight";
import GlowDiaryReels from "@/components/ReelCarousel"
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQSection";
import { getCategories } from "@/lib/graphql";

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <FeaturedCollections categories={categories} />
        <CraftsmanshipSpotlight />
        <BestSellers />
        <GlowDiaryReels />
        <FAQ />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}