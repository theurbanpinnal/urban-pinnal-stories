import LaunchBanner from "@/components/LaunchBanner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { Suspense, lazy } from "react";
import { useQuery } from "urql";
import { GET_COLLECTIONS } from "@/lib/shopify";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCanonicalUrl } from "@/hooks/use-canonical-url";

// Lazy load non-critical components for better performance
const BrandIntroduction = lazy(() => import("@/components/BrandIntroduction"));
const CraftSection = lazy(() => import("@/components/CraftSection"));
const JournalPreview = lazy(() => import("@/components/JournalPreview"));
const NewsletterCTA = lazy(() => import("@/components/NewsletterCTA"));

const ComponentSkeleton = () => (
  <div className="animate-pulse py-20 px-4 sm:px-6 lg:px-8">
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
  const navigate = useNavigate();
  
  // Set canonical URL for homepage
  useCanonicalUrl();
  
  // Get collections data for the collections section
  const [collectionsResult] = useQuery({
    query: GET_COLLECTIONS,
    variables: { first: 4 },
  });

  const { data: collectionsData, fetching: fetchingCollections, error: collectionsError } = collectionsResult;
  const featuredCollections = collectionsData?.collections?.edges?.slice(0, 4) || [];



  // Handle collection selection and navigation to store
  const handleCollectionSelect = (collectionTitle: string) => {
    // Navigate to store page with collection filter
    navigate(`/store?collection=${encodeURIComponent(collectionTitle)}`);
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <title>The Urban Pinnal - Handmade Collective | Sustainable Crafts Chennai</title>
      <meta name="description" content="Discover ethically-made, natural products from The Urban Pinnal. A woman-owned brand empowering rural artisans in Tamil Nadu with handmade, sustainable crafts." />
      <meta name="keywords" content="handmade crafts, sustainable products, Tamil Nadu artisans, women-owned business, ethical fashion, natural materials, Chennai crafts, Indian craftsmanship" />
      
      {/* Structured Data for Homepage */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "The Urban Pinnal",
          "alternateName": "Urban Pinnal",
          "description": "A woman-owned brand empowering rural artisans in Tamil Nadu with handmade, sustainable crafts",
          "url": "https://theurbanpinnal.com",
          "logo": "https://theurbanpinnal.com/src/assets/logo-transparent.png",
          "image": [
            "https://theurbanpinnal.com/src/assets/hero_3.png",
            "https://theurbanpinnal.com/src/assets/logo-transparent.png"
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Chennai",
            "addressLocality": "Chennai",
            "addressRegion": "Tamil Nadu",
            "postalCode": "600001",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "13.0827",
            "longitude": "80.2707"
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+91-XXXXXXXXXX",
              "contactType": "customer service",
              "email": "hello@theurbanpinnal.com",
              "availableLanguage": ["English", "Tamil"]
            },
            {
              "@type": "ContactPoint",
              "contactType": "sales",
              "email": "sales@theurbanpinnal.com"
            }
          ],
          "sameAs": [
            "https://instagram.com/theurbanpinnal",
            "https://facebook.com/theurbanpinnal",
            "https://twitter.com/theurbanpinnal"
          ],
          "foundingDate": "2024",
          "founder": [
            {
              "@type": "Person",
              "name": "The Urban Pinnal Team",
              "jobTitle": "Founder"
            }
          ],
          "employee": [
            {
              "@type": "Person",
              "name": "Tamil Nadu Artisans",
              "jobTitle": "Master Craftspeople",
              "description": "Skilled artisans from Tamil Nadu villages"
            }
          ],
          "knowsAbout": [
            "Handmade Crafts",
            "Sustainable Products",
            "Tamil Nadu Artisans",
            "Women Empowerment",
            "Ethical Fashion",
            "Natural Materials",
            "Traditional Craft Techniques",
            "Rural Development",
            "Cultural Heritage Preservation"
          ],
          "makesOffer": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Handmade Bags",
                "description": "Traditional handcrafted bags made by Tamil Nadu artisans"
              },
              "priceRange": "₹500-₹5000",
              "priceCurrency": "INR"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Sustainable Crafts",
                "description": "Eco-friendly products using natural materials"
              },
              "priceRange": "₹300-₹3000",
              "priceCurrency": "INR"
            }
          ],
          "areaServed": [
            {
              "@type": "Country",
              "name": "India"
            },
            {
              "@type": "State",
              "name": "Tamil Nadu"
            },
            {
              "@type": "City",
              "name": "Chennai"
            }
          ],
          "mission": "To empower rural craftswomen in Tamil Nadu while preserving traditional craft techniques and creating sustainable, beautiful products",
          "slogan": "The Story of Our Hands, The Tradition in Yours",
          "award": [
            "Women Empowerment Initiative",
            "Sustainable Craft Award",
            "Cultural Heritage Preservation"
          ],
          "hasCredential": [
            {
              "@type": "EducationalOccupationalCredential",
              "name": "Fair Trade Certified",
              "description": "Ethical sourcing and fair wages for artisans"
            }
          ]
        })}
      </script>
      
      <div className="min-h-screen bg-background">
        <LaunchBanner />
        <Navigation />
        <HeroSection />
        <Suspense fallback={<ComponentSkeleton />}>
          <BrandIntroduction />
        </Suspense>
        <Suspense fallback={<ComponentSkeleton />}>
          <CraftSection />
        </Suspense>
        
        {/* Collections Section */}
        <section className="py-12 lg:py-18 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Explore Our Collections
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Curated collections featuring our finest handcrafted pieces, organized by style, technique, and artisan specialty.
              </p>
            </div>
            
            {!fetchingCollections && featuredCollections.length > 0 && (
              <div className={`grid gap-6 ${
                (featuredCollections.length + 1) === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                (featuredCollections.length + 1) === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
                (featuredCollections.length + 1) === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
              }`}>
                {/* All Collections Card */}
                <Link 
                  to="/store"
                  className="block"
                >
                  <div
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border-2 hover:border-craft-terracotta/30 border-transparent h-full"
                  >
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-craft-terracotta transition-colors">
                      All Collections
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      Discover our complete range of handcrafted products. From traditional handmade bags to modern accessories, explore everything we have to offer.
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <Badge variant="outline" className="text-xs">
                        View All
                      </Badge>
                      <div className="flex items-center text-craft-terracotta text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Explore
                        <Zap className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
                
                {featuredCollections.map(({ node: collection }) => (
                  <Link 
                    key={collection.id}
                    to={`/store?collection=${encodeURIComponent(collection.title)}`}
                    className="block"
                  >
                    <div
                      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border-2 hover:border-craft-terracotta/30 border-transparent h-full"
                    >
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-craft-terracotta transition-colors">
                        {collection.title}
                      </h3>
                      {collection.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {collection.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        <Badge variant="outline" className="text-xs">
                          View Products
                        </Badge>
                        <div className="flex items-center text-craft-terracotta text-sm font-medium group-hover:translate-x-1 transition-transform">
                          Explore
                          <Zap className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {fetchingCollections && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse h-full">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
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
