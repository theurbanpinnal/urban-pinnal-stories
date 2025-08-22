import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BrandIntroduction from "@/components/BrandIntroduction";
import CraftSection from "@/components/CraftSection";
// import JournalPreview from "@/components/JournalPreview";
import NewsletterCTA from "@/components/NewsletterCTA";

const Index = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>The Urban Pinnal - Handmade Collective | Sustainable Crafts Chennai</title>
      <meta name="description" content="Discover ethically-made, natural products from The Urban Pinnal. A woman-owned brand empowering rural artisans in Tamil Nadu with handmade, sustainable crafts." />
      <meta name="keywords" content="handmade crafts, sustainable products, Tamil Nadu artisans, women-owned business, ethical fashion, natural materials, Chennai crafts, Indian craftsmanship" />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        <HeroSection />
        <BrandIntroduction />
        {/* <FeaturedArtisans /> */}
        <CraftSection />
        {/* <JournalPreview /> */}
        <NewsletterCTA />
        <Footer />
      </div>
    </>
  );
};

export default Index;
