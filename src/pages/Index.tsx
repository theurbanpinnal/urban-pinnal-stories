import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import BrandIntroduction from "@/components/BrandIntroduction";
import FeaturedArtisans from "@/components/FeaturedArtisans";
import CraftSection from "@/components/CraftSection";
import JournalPreview from "@/components/JournalPreview";
import NewsletterCTA from "@/components/NewsletterCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <BrandIntroduction />
      <FeaturedArtisans />
      <CraftSection />
      <JournalPreview />
      <NewsletterCTA />
    </div>
  );
};

export default Index;
