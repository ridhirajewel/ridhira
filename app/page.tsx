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

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <FeaturedCollections />
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
