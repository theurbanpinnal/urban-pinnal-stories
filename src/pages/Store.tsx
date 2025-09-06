import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'urql';
import { useFilterStore } from '@/stores';
import LaunchBanner from '@/components/LaunchBanner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductList from '@/components/ProductList';
import Breadcrumb from '@/components/Breadcrumb';
import { GET_SHOP_INFO, GET_COLLECTIONS } from '@/lib/shopify';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Star, Zap, X } from 'lucide-react';
import heroWeavingImage from '@/assets/hero-weaving-3.png';
import { useCanonicalUrl } from '@/hooks/use-canonical-url';

const Store: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filter store functions and state
  const {
    filters: currentFilters,
    searchQuery,
    syncWithURL,
    updateURL,
    clearFilters
  } = useFilterStore();

  // Set canonical URL
  useCanonicalUrl();

  // Get shop info for SEO
  const [shopResult] = useQuery({
    query: GET_SHOP_INFO,
  });

  const [collectionsResult] = useQuery({
    query: GET_COLLECTIONS,
    variables: { first: 10 },
  });

  const { data: shopData } = shopResult;
  const { data: collectionsData, fetching: fetchingCollections, error: collectionsError } = collectionsResult;

  // Sync with URL on mount and when URL changes
  useEffect(() => {
    syncWithURL();
  }, [searchParams, syncWithURL]);

  // Handle collection selection and scroll to products
  const handleCollectionSelect = (collectionTitle: string | null) => {
    // Update filter store
    if (collectionTitle) {
      useFilterStore.getState().updateFilters({ categories: [collectionTitle] });
    } else {
      useFilterStore.getState().updateFilters({ categories: [] });
    }

    // Update URL parameter
    if (collectionTitle) {
      setSearchParams({ collection: collectionTitle });
    } else {
      setSearchParams({});
    }

    // Scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle clearing all filters (collection and search)
  const handleClearAllFilters = () => {
    // Clear all filters using store
    clearFilters();

    // Clear URL parameters
    setSearchParams({});

    // Scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Set SEO metadata
  useEffect(() => {
    const shopName = shopData?.shop?.name || 'The Urban Pinnal';
    const shopDescription = shopData?.shop?.description || 'Discover authentic, handcrafted pieces that tell stories of tradition and skill.';
    
    document.title = `${shopName} - Handcrafted Collection | Authentic Artisan Products`;
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `${shopDescription} Shop our curated collection of handmade products from skilled artisans.`);
    }
    
    // Set Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', `${shopName} - Handcrafted Collection`);
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', shopDescription);
    
    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', 'website');

    // Add structured data for Store page
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    const storeSchema = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": shopName,
      "description": shopDescription,
      "url": "https://theurbanpinnal.com/store",
      "image": "https://theurbanpinnal.com/src/assets/logo-transparent.png",
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
      "areaServed": [
        {
          "@type": "City",
          "name": "Chennai",
          "containedInPlace": {
            "@type": "State",
            "name": "Tamil Nadu",
            "containedInPlace": {
              "@type": "Country",
              "name": "India"
            }
          }
        },
        {
          "@type": "State",
          "name": "Tamil Nadu",
          "containedInPlace": {
            "@type": "Country",
            "name": "India"
          }
        },
        {
          "@type": "Country",
          "name": "India"
        }
      ],
      "telephone": "+91-XXXXXXXXXX",
      "email": "support@theurbanpinnal.com",
      "openingHours": "Mo-Su 09:00-18:00",
      "priceRange": "₹₹",
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, Credit Card, UPI, Net Banking",
      "foundingDate": "2024",
      "founder": {
        "@type": "Person",
        "name": "The Urban Pinnal Team"
      },
      "sameAs": [
        "https://instagram.com/theurbanpinnal",
        "https://facebook.com/theurbanpinnal"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Handmade Crafts Collection",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Handmade Bags",
              "description": "Traditional handcrafted bags made by Tamil Nadu artisans"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Sustainable Crafts",
              "description": "Eco-friendly products using natural materials"
            }
          }
        ]
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "13.0827",
          "longitude": "80.2707"
        },
        "geoRadius": "500000"
      }
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(storeSchema);
    document.head.appendChild(schemaScript);
  }, [shopData]);

  // Scroll to products when arriving with a collection filter from home page
  useEffect(() => {
    const collectionParam = searchParams.get('collection');
    if (collectionParam) {
      // Small delay to ensure page has loaded
      setTimeout(() => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);

  const featuredCollections = collectionsData?.collections?.edges?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-background">
      <LaunchBanner />
      <Navigation />
      
      {/* Breadcrumb Structured Data Only (Hidden from UI) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Store",
            "item": "https://theurbanpinnal.com/store"
          }]
        })}
      </script>
      
      {/* Enhanced Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
                  <img
            src={heroWeavingImage}
            alt="Skilled artisan weaving traditional handcrafted bags using time-honored techniques"
            className="w-full h-full object-cover"
            loading="eager"
            {...{ fetchpriority: "high" }}
            decoding="async"
          />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-craft-gold/20 text-craft-ivory border-craft-gold/30">
                <Star className="w-3 h-3 mr-1" />
                Handcrafted Excellence
              </Badge>
              <Badge variant="secondary" className="bg-craft-terracotta/20 text-craft-ivory border-craft-terracotta/30">
                <Package className="w-3 h-3 mr-1" />
                Authentic Artisan
              </Badge>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
              Our Collection
            </h1>
            <p className="font-sans text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed opacity-90">
              Discover authentic, handcrafted pieces that tell stories of tradition, 
              skill, and the artisans who create them with love and dedication. Each product 
              preserves centuries-old techniques while bringing modern elegance to your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#products" 
                className="inline-flex items-center justify-center px-8 py-4 bg-craft-terracotta text-craft-ivory hover:bg-craft-clay transition-all duration-300 font-medium tracking-wide rounded-md text-lg"
              >
                <Package className="mr-2 w-5 h-5" />
                Shop Collection
              </a>          
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      {featuredCollections.length > 0 && (
        <section id="collections" className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Explore Our Collections
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Curated collections featuring our finest handcrafted pieces, 
                organized by style, technique, and artisan specialty.
              </p>
            </div>
            
            {fetchingCollections ? (
              <div className={`grid gap-6 ${
                (featuredCollections.length + 1) === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                (featuredCollections.length + 1) === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
                (featuredCollections.length + 1) === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
              }`}>
                {Array.from({ length: Math.min(4, featuredCollections.length + 1) }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <Skeleton className="h-8 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid gap-6 ${
                (featuredCollections.length + 1) === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                (featuredCollections.length + 1) === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
                (featuredCollections.length + 1) === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
              }`}>
                {/* All Collections Card */}
                <div 
                  className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border-2 hover:border-craft-terracotta/30 ${
                    currentFilters.categories.length === 0 
                      ? 'border-craft-terracotta shadow-md bg-craft-terracotta/5' 
                      : 'border-transparent'
                  }`}
                  onClick={() => handleCollectionSelect(null)}
                >
                  <h3 className={`font-serif text-xl font-semibold mb-3 transition-colors ${
                    currentFilters.categories.length === 0 
                      ? 'text-craft-terracotta' 
                      : 'text-foreground group-hover:text-craft-terracotta'
                  }`}>
                    All Collections
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    Discover our complete range of handcrafted products. From traditional handmade bags to modern accessories, explore everything we have to offer.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant={currentFilters.categories.length === 0 ? "default" : "outline"} className={`text-xs ${
                      currentFilters.categories.length === 0 ? 'bg-craft-terracotta text-white' : ''
                    }`}>
                      View All
                    </Badge>
                    <div className="flex items-center text-craft-terracotta text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Explore
                      <Zap className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
                
                {featuredCollections.map(({ node: collection }) => {
                  const isSelected = currentFilters.categories.includes(collection.title);
                  return (
                    <div 
                      key={collection.id} 
                      className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border-2 hover:border-craft-terracotta/30 ${
                        isSelected
                          ? 'border-craft-terracotta shadow-md bg-craft-terracotta/5' 
                          : 'border-transparent'
                      }`}
                      onClick={() => handleCollectionSelect(collection.title)}
                    >
                      <h3 className={`font-serif text-xl font-semibold mb-3 transition-colors ${
                        isSelected 
                          ? 'text-craft-terracotta' 
                          : 'text-foreground group-hover:text-craft-terracotta'
                      }`}>
                        {collection.title}
                      </h3>
                      {collection.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {collection.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant={isSelected ? "default" : "outline"} className={`text-xs ${
                          isSelected ? 'bg-craft-terracotta text-white' : ''
                        }`}>
                          View Products
                        </Badge>
                        <div className="flex items-center text-craft-terracotta text-sm font-medium group-hover:translate-x-1 transition-transform">
                          Explore
                          <Zap className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Enhanced Products Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Handcrafted with Love
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Each piece in our collection is carefully crafted by skilled artisans, 
              preserving traditional techniques while creating modern, timeless designs 
              that bring beauty and authenticity to your everyday life.
            </p>
            
            {/* Active Filters Indicator */}
            {(searchQuery || currentFilters.categories.length > 0 || currentFilters.availability !== 'all' || currentFilters.priceRange.min > 0 || currentFilters.priceRange.max < 10000) && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <span className="text-sm text-muted-foreground">
                    Showing:
                  </span>
                  
                  {/* Search Query */}
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-craft-terracotta/20 text-craft-terracotta border-craft-terracotta/30">
                      Search: {searchQuery}
                    </Badge>
                  )}
                  
                  {/* Category Filters */}
                  {currentFilters.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="bg-craft-terracotta/20 text-craft-terracotta border-craft-terracotta/30">
                      {category}
                    </Badge>
                  ))}
                  
                  {/* Availability Filter */}
                  {currentFilters.availability !== 'all' && (
                    <Badge variant="secondary" className="bg-craft-terracotta/20 text-craft-terracotta border-craft-terracotta/30">
                      In Stock
                    </Badge>
                  )}
                  
                  {/* Price Range Filter */}
                  {(currentFilters.priceRange.min > 0 || currentFilters.priceRange.max < 10000) && (
                    <Badge variant="secondary" className="bg-craft-terracotta/20 text-craft-terracotta border-craft-terracotta/30">
                      ₹{currentFilters.priceRange.min} - ₹{currentFilters.priceRange.max}
                    </Badge>
                  )}
                </div>
                
                {/* Clear Filters Button - Responsive across all screen sizes */}
                <Button 
                  variant="ghost" 
                  onClick={handleClearAllFilters}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground h-10 px-4 py-2 md:hidden"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}
            
            {/* Collection Statistics
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="text-center">
                <div className="font-serif text-2xl font-bold text-craft-terracotta">20+</div>
                <div className="text-sm text-muted-foreground">Unique Products</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-2xl font-bold text-craft-terracotta">50+</div>
                <div className="text-sm text-muted-foreground">Skilled Artisans</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-2xl font-bold text-craft-terracotta">100%</div>
                <div className="text-sm text-muted-foreground">Handmade</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-2xl font-bold text-craft-terracotta">5★</div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
              </div>
            </div> */}
          </div>
          

          
          {/* Debug component - commented out since API is working */}
          {/* <div className="mb-8">
            <ShopifyDebug />
          </div> */}
          
          <ProductList
            limit={24}
            onClearAllFilters={handleClearAllFilters}
          />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-craft-terracotta" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Authentic Handcraft</h3>
              <p className="text-muted-foreground text-sm">
                Every piece is handmade by skilled artisans using traditional techniques 
                passed down through generations.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-craft-terracotta" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground text-sm">
                We source only the finest materials and work with master craftspeople 
                to ensure exceptional quality in every product.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-craft-terracotta" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground text-sm">
                Quick and secure delivery worldwide with tracking, so you can enjoy 
                your handcrafted pieces as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Store;