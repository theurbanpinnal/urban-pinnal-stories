import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { Suspense, lazy } from "react";

// Lazy load non-critical components for better performance
const BrandIntroduction = lazy(() => import("@/components/BrandIntroduction"));
const CraftSection = lazy(() => import("@/components/CraftSection"));
const JournalPreview = lazy(() => import("@/components/JournalPreview"));
const NewsletterCTA = lazy(() => import("@/components/NewsletterCTA"));

const ComponentSkeleton = () => (
  <div className="animate-pulse py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

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
        <Suspense fallback={<ComponentSkeleton />}>
          <BrandIntroduction />
        </Suspense>
        <Suspense fallback={<ComponentSkeleton />}>
          <CraftSection />
        </Suspense>
        <Suspense fallback={<ComponentSkeleton />}>
          <JournalPreview />
        </Suspense>
        <Suspense fallback={<ComponentSkeleton />}>
          <NewsletterCTA />
        </Suspense>
        <Footer />
      </div>
    </>
  );
};

export default Index;
