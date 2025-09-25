import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from 'urql';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductList from '@/components/ProductList';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Package, Star, Zap, Heart, Gift, Briefcase, Home, Sparkles, MapPin, Calendar, BookOpen } from 'lucide-react';
import { GET_PRODUCTS, ShopifyProduct } from '@/lib/shopify';
import { formatCurrency } from '@/lib/utils';
import { useCanonicalUrl } from '@/hooks/use-canonical-url';
import { useFilterStore } from '@/stores';
import heroWeavingImage from '@/assets/hero-weaving-3.png';

// Programmatic SEO content database
const PROGRAMMATIC_CONTENT = {
  // Category pages
  categories: {
    'handmade-bags': {
      title: 'Handmade Bags Collection | Authentic Artisan Craftsmanship',
      description: 'Discover our exquisite collection of handmade bags crafted by skilled Tamil Nadu artisans. Each piece tells a story of tradition, craftsmanship, and sustainable fashion.',
      metaDescription: 'Shop authentic handmade bags from Tamil Nadu artisans. Sustainable, traditional craftsmanship with modern design. Perfect for everyday use and special occasions.',
      h1: 'Handmade Bags Collection',
      intro: 'Each handmade bag in our collection is a testament to centuries-old weaving techniques passed down through generations. Our artisans use natural fibers and traditional patterns to create pieces that are both beautiful and durable.',
      features: [
        { icon: Heart, text: 'Made with love by skilled artisans' },
        { icon: Package, text: 'Sustainable and eco-friendly materials' },
        { icon: Star, text: 'Unique, one-of-a-kind designs' },
        { icon: Sparkles, text: 'Traditional craftsmanship meets modern style' }
      ],
      query: 'bag OR handbag OR tote OR purse',
      priority: '0.8'
    },
    'sustainable-crafts': {
      title: 'Sustainable Handmade Crafts | Eco-Friendly Artisan Products',
      description: 'Explore our sustainable crafts collection made from natural, eco-friendly materials by traditional artisans committed to preserving our planet.',
      metaDescription: 'Sustainable handmade crafts from Tamil Nadu artisans. Eco-friendly products made with natural materials, supporting traditional craftsmanship and environmental conservation.',
      h1: 'Sustainable Crafts Collection',
      intro: 'Our sustainable crafts are made using traditional methods and natural materials, ensuring that each piece not only looks beautiful but also contributes to environmental conservation.',
      features: [
        { icon: Heart, text: 'Eco-friendly natural materials' },
        { icon: Package, text: 'Zero waste production process' },
        { icon: Star, text: 'Supports sustainable livelihoods' },
        { icon: Sparkles, text: 'Traditional techniques preserved' }
      ],
      query: 'sustainable OR eco OR natural OR organic',
      priority: '0.8'
    },
    'traditional-accessories': {
      title: 'Traditional Accessories | Authentic Tamil Nadu Handcrafts',
      description: 'Browse our traditional accessories collection featuring authentic handcrafted items that preserve Tamil Nadu\'s rich cultural heritage.',
      metaDescription: 'Traditional Tamil Nadu accessories handmade by artisans. Authentic cultural heritage pieces including jewelry, belts, and decorative items.',
      h1: 'Traditional Accessories',
      intro: 'Our traditional accessories collection showcases the rich cultural heritage of Tamil Nadu through meticulously crafted pieces that blend ancient techniques with contemporary appeal.',
      features: [
        { icon: Heart, text: 'Rich cultural heritage preserved' },
        { icon: Package, text: 'Handcrafted with traditional techniques' },
        { icon: Star, text: 'Unique cultural motifs and patterns' },
        { icon: Sparkles, text: 'Perfect blend of tradition and modernity' }
      ],
      query: 'traditional OR cultural OR heritage OR accessory',
      priority: '0.8'
    },
    'handwoven-textiles': {
      title: 'Handwoven Textiles | Traditional Tamil Nadu Weaving',
      description: 'Discover authentic handwoven textiles from Tamil Nadu, featuring intricate patterns and natural dyes that showcase centuries of weaving expertise.',
      metaDescription: 'Handwoven textiles from Tamil Nadu artisans. Authentic traditional weaving with natural dyes, intricate patterns, and sustainable textile production.',
      h1: 'Handwoven Textiles Collection',
      intro: 'Our handwoven textiles represent the pinnacle of Tamil Nadu\'s weaving tradition. Each piece is crafted on traditional looms using techniques passed down through generations.',
      features: [
        { icon: Heart, text: 'Traditional handloom weaving' },
        { icon: Package, text: 'Natural dyes and fibers' },
        { icon: Star, text: 'Intricate cultural patterns' },
        { icon: Sparkles, text: 'UNESCO-recognized craftsmanship' }
      ],
      query: 'textile OR fabric OR weave OR handloom',
      priority: '0.8'
    },
    'artisanal-home-decor': {
      title: 'Artisanal Home Decor | Handcrafted Decorative Pieces',
      description: 'Transform your home with our collection of artisanal home decor pieces, each handcrafted by skilled Tamil Nadu artisans using traditional techniques.',
      metaDescription: 'Artisanal home decor from Tamil Nadu craftsmen. Handcrafted decorative pieces, wall hangings, and home accents made with traditional techniques.',
      h1: 'Artisanal Home Decor',
      intro: 'Bring the warmth of traditional Tamil Nadu craftsmanship into your home with our curated collection of decorative pieces, wall hangings, and functional art.',
      features: [
        { icon: Home, text: 'Beautiful home transformation' },
        { icon: Heart, text: 'Traditional craftsmanship' },
        { icon: Package, text: 'Functional art pieces' },
        { icon: Star, text: 'Unique cultural decor' }
      ],
      query: 'decor OR home OR wall hanging OR decorative',
      priority: '0.8'
    }
  },

  // Location pages
  locations: {
    'chennai-crafts': {
      title: 'Chennai Handmade Crafts | Local Artisan Products',
      description: 'Discover authentic handmade crafts from Chennai artisans. Support local craftsmanship and bring home pieces made in the heart of Tamil Nadu.',
      metaDescription: 'Handmade crafts from Chennai artisans. Support local Tamil Nadu craftsmanship with authentic, high-quality handmade products made in Chennai.',
      h1: 'Chennai Handmade Crafts',
      intro: 'Chennai, the cultural capital of Tamil Nadu, is home to some of India\'s finest artisans. Our collection features pieces crafted by local masters who continue age-old traditions.',
      features: [
        { icon: MapPin, text: 'Crafted in Chennai, Tamil Nadu' },
        { icon: Heart, text: 'Support local artisans' },
        { icon: Package, text: 'Authentic regional craftsmanship' },
        { icon: Star, text: 'Direct from artisan workshops' }
      ],
      query: 'chennai OR tamil nadu',
      priority: '0.7'
    },
    'tamil-nadu-artisans': {
      title: 'Tamil Nadu Artisans | Traditional South Indian Handcrafts',
      description: 'Explore handcrafted products from Tamil Nadu artisans. Authentic South Indian craftsmanship featuring traditional weaving, dyeing, and decorative techniques.',
      metaDescription: 'Tamil Nadu artisan handmade products. Traditional South Indian crafts including handwoven textiles, natural dyes, and cultural decorative items.',
      h1: 'Tamil Nadu Artisan Crafts',
      intro: 'Tamil Nadu\'s rich artisanal heritage spans thousands of years, with each region specializing in unique crafts. Our collection brings together the finest examples of this living tradition.',
      features: [
        { icon: MapPin, text: 'From across Tamil Nadu villages' },
        { icon: Heart, text: 'Preserving ancient techniques' },
        { icon: Package, text: 'Regional specialty crafts' },
        { icon: Star, text: 'UNESCO-recognized craftsmanship' }
      ],
      query: 'tamil nadu OR south india',
      priority: '0.7'
    },
    'kanchipuram-silk': {
      title: 'Kanchipuram Silk Crafts | Traditional Tamil Nadu Silk Weaving',
      description: 'Discover authentic Kanchipuram silk crafts featuring the world-famous silk sarees and handwoven textiles from this historic weaving center.',
      metaDescription: 'Kanchipuram silk crafts and textiles. World-famous traditional Tamil Nadu silk weaving, sarees, and handcrafted silk products from Kanchipuram artisans.',
      h1: 'Kanchipuram Silk Crafts',
      intro: 'Kanchipuram, renowned worldwide for its exquisite silk weaving, produces some of the finest handcrafted textiles. Our collection showcases the mastery of this ancient craft.',
      features: [
        { icon: MapPin, text: 'Authentic Kanchipuram silk' },
        { icon: Heart, text: 'World-renowned craftsmanship' },
        { icon: Package, text: 'Traditional silk weaving techniques' },
        { icon: Star, text: 'UNESCO cultural heritage' }
      ],
      query: 'kanchipuram OR silk OR saree',
      priority: '0.7'
    },
    'madurai-crafts': {
      title: 'Madurai Handmade Crafts | Temple City Artisan Products',
      description: 'Explore authentic handmade crafts from Madurai artisans. The temple city of Tamil Nadu offers unique handcrafted products with rich cultural significance.',
      metaDescription: 'Madurai handmade crafts from temple city artisans. Traditional Tamil Nadu crafts with cultural significance, handcrafted products from Madurai workshops.',
      h1: 'Madurai Artisan Crafts',
      intro: 'Madurai, Tamil Nadu\'s temple city, is home to artisans who create pieces inspired by the region\'s rich Dravidian architecture and cultural heritage.',
      features: [
        { icon: MapPin, text: 'Temple city craftsmanship' },
        { icon: Heart, text: 'Cultural heritage preservation' },
        { icon: Package, text: 'Traditional regional designs' },
        { icon: Star, text: 'Temple-inspired artistry' }
      ],
      query: 'madurai OR temple city',
      priority: '0.7'
    }
  },

  // Use case pages
  'use-cases': {
    'office-bags': {
      title: 'Handmade Office Bags | Professional Artisan Totes',
      description: 'Professional handmade bags perfect for office use. Stylish, durable, and ethically made by skilled Tamil Nadu artisans.',
      metaDescription: 'Handmade office bags for professionals. Stylish, durable artisan totes made in Tamil Nadu. Perfect for work, meetings, and daily professional use.',
      h1: 'Handmade Office Bags',
      intro: 'Our office bags combine traditional craftsmanship with modern professional needs. Each bag is designed to be both stylish and functional for the workplace.',
      features: [
        { icon: Briefcase, text: 'Professional and stylish design' },
        { icon: Package, text: 'Durable for daily office use' },
        { icon: Star, text: 'Spacious compartments' },
        { icon: Heart, text: 'Ethically handmade' }
      ],
      query: 'bag OR tote OR office OR professional',
      priority: '0.7'
    },
    'home-decor-crafts': {
      title: 'Handmade Home Decor | Artisan Wall Hangings & Decorative Pieces',
      description: 'Beautiful handmade home decor items crafted by Tamil Nadu artisans. Add authentic craftsmanship and cultural charm to your living space.',
      metaDescription: 'Handmade home decor from Tamil Nadu artisans. Wall hangings, decorative pieces, and cultural decor items for authentic Indian craftsmanship.',
      h1: 'Handmade Home Decor',
      intro: 'Transform your home with our collection of handmade decorative pieces. Each item brings the warmth and authenticity of traditional Tamil Nadu craftsmanship into your living space.',
      features: [
        { icon: Home, text: 'Beautiful home accents' },
        { icon: Heart, text: 'Cultural decorative pieces' },
        { icon: Package, text: 'Handcrafted wall hangings' },
        { icon: Star, text: 'Unique conversation starters' }
      ],
      query: 'decor OR wall hanging OR decorative OR home',
      priority: '0.7'
    },
    'wedding-gifts': {
      title: 'Handmade Wedding Gifts | Traditional Artisan Presents',
      description: 'Meaningful handmade wedding gifts from Tamil Nadu artisans. Traditional crafts that make perfect wedding presents and housewarming gifts.',
      metaDescription: 'Handmade wedding gifts from Tamil Nadu artisans. Traditional crafts perfect for weddings, housewarmings, and special occasions.',
      h1: 'Handmade Wedding Gifts',
      intro: 'Our wedding gift collection features traditional crafts that carry deep cultural significance. Each piece tells a story and creates lasting memories for the couple.',
      features: [
        { icon: Gift, text: 'Meaningful wedding presents' },
        { icon: Heart, text: 'Traditional cultural significance' },
        { icon: Package, text: 'Handcrafted with care' },
        { icon: Star, text: 'Memorable and unique' }
      ],
      query: 'wedding OR gift OR special occasion',
      priority: '0.7'
    },
    'eco-friendly-gifts': {
      title: 'Eco-Friendly Handmade Gifts | Sustainable Artisan Presents',
      description: 'Give the gift of sustainability with our eco-friendly handmade gifts. Ethically produced, beautifully crafted presents that make a positive impact.',
      metaDescription: 'Eco-friendly handmade gifts from Tamil Nadu artisans. Sustainable, ethical presents made with natural materials and traditional craftsmanship.',
      h1: 'Eco-Friendly Handmade Gifts',
      intro: 'Our eco-friendly gifts combine traditional craftsmanship with modern environmental consciousness. Each piece is not only beautiful but also contributes to a sustainable future.',
      features: [
        { icon: Heart, text: 'Sustainable and eco-friendly' },
        { icon: Package, text: 'Natural materials only' },
        { icon: Star, text: 'Ethically produced' },
        { icon: Gift, text: 'Perfect conscious gifts' }
      ],
      query: 'eco OR sustainable OR gift OR natural',
      priority: '0.7'
    },
    'corporate-gifts': {
      title: 'Corporate Handmade Gifts | Premium Artisan Business Presents',
      description: 'Impress clients and employees with premium handmade corporate gifts. Unique, thoughtful presents that showcase your brand\'s commitment to quality.',
      metaDescription: 'Corporate handmade gifts from Tamil Nadu artisans. Premium business presents, client gifts, and employee rewards featuring authentic craftsmanship.',
      h1: 'Corporate Handmade Gifts',
      intro: 'Elevate your corporate gifting with our collection of premium handmade items. Each piece reflects the artistry and cultural heritage of Tamil Nadu craftsmanship.',
      features: [
        { icon: Briefcase, text: 'Premium corporate branding' },
        { icon: Package, text: 'Unique and memorable' },
        { icon: Star, text: 'High-quality craftsmanship' },
        { icon: Gift, text: 'Professional presentation' }
      ],
      query: 'corporate OR business OR gift OR premium',
      priority: '0.7'
    }
  },

  // Comparison pages
  comparisons: {
    'handmade-vs-machine-made': {
      title: 'Handmade vs Machine-Made Bags | Why Choose Artisan Crafts',
      description: 'Compare handmade vs machine-made bags. Discover why authentic artisan craftsmanship creates superior, meaningful products.',
      metaDescription: 'Handmade vs machine-made bags comparison. Learn why artisan crafts offer superior quality, sustainability, and cultural value over mass-produced items.',
      h1: 'Handmade vs Machine-Made: Why Artisan Crafts Matter',
      intro: 'In a world of mass production, handmade crafts offer something truly special. Here\'s why choosing authentic artisan products makes a difference.',
      comparisonData: {
        handmade: {
          title: 'Handmade by Artisans',
          points: [
            'Unique, one-of-a-kind pieces',
            'Superior craftsmanship and durability',
            'Sustainable and eco-friendly production',
            'Supports traditional livelihoods',
            'Rich cultural heritage preserved',
            'Personal story and authenticity'
          ]
        },
        machine: {
          title: 'Machine-Made Products',
          points: [
            'Identical mass-produced items',
            'Often lower initial cost',
            'Faster production process',
            'Less expensive labor',
            'Consistent but generic designs',
            'Environmental impact concerns'
          ]
        }
      },
      query: 'bag OR handbag OR tote',
      priority: '0.6'
    }
  },

  // Seasonal pages
  seasonal: {
    'diwali-crafts': {
      title: 'Diwali Handmade Crafts | Traditional Festival Decorations',
      description: 'Celebrate Diwali with authentic handmade crafts from Tamil Nadu artisans. Traditional festival decorations and auspicious items.',
      metaDescription: 'Diwali handmade crafts and decorations from Tamil Nadu artisans. Traditional festival items, auspicious decor, and Diwali gift ideas.',
      h1: 'Diwali Handmade Crafts',
      intro: 'Light up your Diwali celebrations with our collection of traditional handmade crafts. Each piece brings the warmth and auspiciousness of this beautiful festival.',
      features: [
        { icon: Calendar, text: 'Perfect for Diwali celebrations' },
        { icon: Sparkles, text: 'Auspicious traditional designs' },
        { icon: Gift, text: 'Beautiful festival gifts' },
        { icon: Heart, text: 'Festival decorations and decor' }
      ],
      query: 'diwali OR festival OR decorative OR auspicious',
      priority: '0.6'
    },
    'pongal-crafts': {
      title: 'Pongal Handmade Crafts | Harvest Festival Artisan Products',
      description: 'Celebrate Pongal with traditional handmade crafts from Tamil Nadu. Harvest festival decorations and auspicious items for this joyous South Indian celebration.',
      metaDescription: 'Pongal handmade crafts and decorations. Traditional harvest festival items from Tamil Nadu artisans, auspicious decor for Pongal celebrations.',
      h1: 'Pongal Handmade Crafts',
      intro: 'Celebrate the harvest festival of Pongal with our collection of traditional handmade crafts. Each piece reflects the gratitude and joy of this auspicious Tamil festival.',
      features: [
        { icon: Calendar, text: 'Harvest festival celebration' },
        { icon: Heart, text: 'Traditional Tamil culture' },
        { icon: Package, text: 'Auspicious festival items' },
        { icon: Star, text: 'Cultural significance' }
      ],
      query: 'pongal OR harvest OR festival OR tamil',
      priority: '0.6'
    },
    'christmas-handmade-gifts': {
      title: 'Christmas Handmade Gifts | Artisan Holiday Presents',
      description: 'Give the gift of authentic craftsmanship this Christmas. Handmade holiday gifts from Tamil Nadu artisans featuring traditional Indian artistry.',
      metaDescription: 'Christmas handmade gifts from Tamil Nadu artisans. Traditional Indian crafts as holiday presents, authentic artisan Christmas gifts.',
      h1: 'Christmas Handmade Gifts',
      intro: 'This Christmas, give gifts that tell a story of tradition and craftsmanship. Our handmade pieces bring the warmth of Indian artistry to your holiday celebrations.',
      features: [
        { icon: Gift, text: 'Unique Christmas presents' },
        { icon: Heart, text: 'Cultural storytelling' },
        { icon: Package, text: 'Handcrafted with love' },
        { icon: Star, text: 'Memorable holiday gifts' }
      ],
      query: 'christmas OR holiday OR gift OR festive',
      priority: '0.6'
    }
  },

  // Guide pages
  guides: {
    'caring-for-handmade-crafts': {
      title: 'How to Care for Handmade Crafts | Maintenance Guide',
      description: 'Learn how to care for your handmade crafts and keep them beautiful for years. Essential maintenance tips for artisan products.',
      metaDescription: 'Care guide for handmade crafts. Learn how to maintain, clean, and preserve your artisan products for long-lasting beauty and durability.',
      h1: 'Caring for Your Handmade Crafts',
      intro: 'Proper care ensures your handmade crafts remain beautiful and functional for generations. Follow these simple guidelines to preserve your artisan treasures.',
      guideContent: [
        {
          title: 'Cleaning Natural Fiber Crafts',
          content: 'Gently dust with a soft brush. For deeper cleaning, use a damp cloth with mild soap. Avoid harsh chemicals and excessive water.'
        },
        {
          title: 'Storage Recommendations',
          content: 'Store in a cool, dry place away from direct sunlight. Use acid-free tissue paper and avoid plastic bags which can cause moisture buildup.'
        },
        {
          title: 'Sunlight and Color Protection',
          content: 'Natural dyes can fade in direct sunlight. Display your crafts away from windows or use UV-protective glass when possible.'
        }
      ],
      priority: '0.5'
    },
    'authentic-artisan-guide': {
      title: 'How to Identify Authentic Artisan Crafts | Buying Guide',
      description: 'Learn to identify genuine handmade crafts vs mass-produced items. Essential guide for buying authentic artisan products with confidence.',
      metaDescription: 'Guide to identifying authentic artisan crafts. Learn to distinguish genuine handmade products from mass-produced items, buying tips for authentic crafts.',
      h1: 'Identifying Authentic Artisan Crafts',
      intro: 'With so many products claiming to be "handmade," it\'s important to know how to identify truly authentic artisan craftsmanship. Here\'s your complete guide.',
      guideContent: [
        {
          title: 'Check for Imperfections',
          content: 'Authentic handmade items often have slight variations and imperfections that show human craftsmanship. Perfect uniformity usually indicates machine production.'
        },
        {
          title: 'Examine the Materials',
          content: 'Genuine artisan products use high-quality, natural materials. Cheap synthetic materials are a red flag for mass-produced items.'
        },
        {
          title: 'Look for Craftsmanship Details',
          content: 'Handmade items show evidence of skilled human work - uneven stitching, hand-dyed variations, and traditional techniques that machines can\'t replicate perfectly.'
        },
        {
          title: 'Research the Artisan Story',
          content: 'Authentic crafts come with stories. Look for information about the artisans, their location, and traditional techniques used.'
        }
      ],
      priority: '0.5'
    },
    'sustainable-crafts-guide': {
      title: 'Sustainable Handmade Crafts | Environmental Impact Guide',
      description: 'Understanding the environmental benefits of choosing handmade crafts. How traditional artisan practices contribute to sustainability.',
      metaDescription: 'Sustainable handmade crafts guide. Environmental benefits of artisan products, how traditional crafts contribute to sustainability and eco-friendly living.',
      h1: 'The Environmental Impact of Handmade Crafts',
      intro: 'Choosing handmade crafts isn\'t just about aesthetics - it\'s also about making environmentally conscious decisions. Learn how traditional artisan practices support sustainability.',
      guideContent: [
        {
          title: 'Natural Materials Usage',
          content: 'Artisans often use locally sourced, renewable materials that have a much lower environmental impact than synthetic alternatives.'
        },
        {
          title: 'Zero Waste Production',
          content: 'Traditional crafting techniques minimize waste, with artisans using every part of raw materials and creating products that last for generations.'
        },
        {
          title: 'Small-Scale Production',
          content: 'Artisan workshops produce in small quantities, avoiding the energy-intensive mass production processes of factories.'
        },
        {
          title: 'Cultural Preservation',
          content: 'Supporting artisans helps preserve traditional techniques that are often more environmentally friendly than modern industrial methods.'
        }
      ],
      priority: '0.5'
    }
  }
};

const ProgrammaticPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract type from pathname
  const type = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[0]; // First segment is the type (categories, locations, etc.)
  }, [location.pathname]);

  // Set canonical URL
  useCanonicalUrl();

  // Find the content for this page
  const pageContent = useMemo(() => {
    if (!type || !slug) return null;

    // Search through all content types
    for (const [contentType, content] of Object.entries(PROGRAMMATIC_CONTENT)) {
      if (content[slug]) {
        return { ...content[slug], contentType };
      }
    }
    return null;
  }, [type, slug]);

  // Set search query in filter store when page content loads
  useEffect(() => {
    if (pageContent?.query) {
      useFilterStore.getState().setSearchQuery(pageContent.query);
    }
  }, [pageContent?.query]);

  // Query products based on the page content
  const [result] = useQuery({
    query: GET_PRODUCTS,
    variables: {
      first: 24,
      sortKey: 'CREATED_AT',
      ...(pageContent?.query && {
        query: pageContent.query
      })
    },
    pause: !pageContent,
  });

  const { data, fetching, error } = result;

  // Set SEO metadata
  useEffect(() => {
    if (pageContent) {
      document.title = pageContent.title;

      // Set meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && pageContent.metaDescription) {
        metaDescription.setAttribute('content', pageContent.metaDescription);
      }

      // Set Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', pageContent.title);

      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', pageContent.description);

      let ogType = document.querySelector('meta[property="og:type"]');
      if (!ogType) {
        ogType = document.createElement('meta');
        ogType.setAttribute('property', 'og:type');
        document.head.appendChild(ogType);
      }
      ogType.setAttribute('content', 'website');

      // Add structured data
      const existingSchema = document.querySelector('script[type="application/ld+json"]');
      if (existingSchema) {
        existingSchema.remove();
      }

      const pageSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": pageContent.h1,
        "description": pageContent.description,
        "url": `https://theurbanpinnal.com/${type}/${slug}`,
        "mainEntity": {
          "@type": "ItemList",
          "name": pageContent.h1,
          "description": pageContent.intro
        },
        "publisher": {
          "@type": "Organization",
          "name": "The Urban Pinnal",
          "url": "https://theurbanpinnal.com"
        }
      };

      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify(pageSchema);
      document.head.appendChild(schemaScript);
    }
  }, [pageContent]);

  if (!pageContent) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-6">Page Not Found</h1>
          <p className="font-sans text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/store')} variant="outline" className="font-sans text-base px-6 py-3">
            <ArrowLeft className="mr-3 h-5 w-5" />
            Back to Store
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const products = data?.products?.edges?.map(({ node }) => node) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Enhanced Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <img
          src={heroWeavingImage}
          alt={pageContent.description}
          className="w-full h-full object-cover"
          loading="eager"
          {...{ fetchpriority: "high" }}
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-craft-gold/20 text-craft-ivory border-craft-gold/30">
                <Package className="w-3 h-3 mr-1" />
                Handcrafted Collection
              </Badge>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
              {pageContent.h1}
            </h1>
            <p className="font-sans text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed opacity-90">
              {pageContent.intro}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { name: 'Store', url: '/store' },
              { name: pageContent.h1, url: `/${type}/${slug}` }
            ]}
          />
        </div>

        {/* Features Section */}
        {pageContent.features && (
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pageContent.features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                    <div className="w-12 h-12 bg-craft-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-craft-terracotta" />
                    </div>
                    <p className="font-sans text-sm text-muted-foreground">
                      {feature.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Comparison Section for comparison pages */}
        {pageContent.comparisonData && (
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-semibold mb-6 text-craft-terracotta">
                  {pageContent.comparisonData.handmade.title}
                </h2>
                <ul className="space-y-3">
                  {pageContent.comparisonData.handmade.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-craft-terracotta mt-0.5 flex-shrink-0" />
                      <span className="font-sans text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-semibold mb-6 text-muted-foreground">
                  {pageContent.comparisonData.machine.title}
                </h2>
                <ul className="space-y-3">
                  {pageContent.comparisonData.machine.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 border border-muted-foreground rounded mt-0.5 flex-shrink-0" />
                      <span className="font-sans text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Guide Content for guide pages */}
        {pageContent.guideContent && (
          <section className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {pageContent.guideContent.map((section, index) => (
                  <div key={index} className="bg-white rounded-lg p-8 shadow-sm">
                    <h2 className="font-serif text-2xl font-semibold mb-4 text-craft-terracotta">
                      {section.title}
                    </h2>
                    <p className="font-sans text-base leading-relaxed text-muted-foreground">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products Section */}
        <section className="mb-12">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our curated selection of handcrafted pieces that match this collection.
            </p>
          </div>

          {fetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <Skeleton className="w-full h-48 rounded mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <ProductList
              limit={24}
            />
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-6">
                We're currently updating our collection. Check back soon for new arrivals.
              </p>
              <Button onClick={() => navigate('/store')} variant="outline">
                View All Products
              </Button>
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-muted/20 rounded-lg">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
            Ready to Bring Home Authentic Craftsmanship?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Each piece in our collection supports skilled artisans and preserves traditional techniques.
            Shop with confidence knowing you're making a positive impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/store')}
              className="bg-craft-terracotta hover:bg-craft-clay text-craft-ivory"
            >
              <Package className="mr-2 w-5 h-5" />
              Shop the Collection
            </Button>
            <Button
              onClick={() => navigate('/our-story')}
              variant="outline"
            >
              <BookOpen className="mr-2 w-5 h-5" />
              Learn Our Story
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ProgrammaticPage;
