import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Leaf, Users, Clock } from "lucide-react";

const Craft = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>The Craft - The Urban Pinnal | Traditional Tamil Nadu Techniques</title>
      <meta name="description" content="Discover the traditional craft techniques and natural materials used by The Urban Pinnal artisans. Learn about sustainable handmade processes from Tamil Nadu." />
      <meta name="keywords" content="traditional crafts Tamil Nadu, handloom weaving, natural dyes, sustainable textiles, artisan techniques, Chennai craftsmanship" />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              The Craft
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Where ancient techniques meet contemporary design. Discover the timeless artistry behind every piece in our collection.
            </p>
          </div>
        </section>

        {/* Coming Soon Content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-craft-terracotta/10 rounded-lg p-12 mb-16">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Coming Soon
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  We're crafting something beautiful for this page. Soon, you'll be able to explore our traditional techniques, 
                  learn about natural materials, and discover the intricate processes that bring our handmade products to life.
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-craft-terracotta text-craft-ivory rounded-lg">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">Under Development</span>
                </div>
              </div>

              {/* Preview Cards */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 border border-border rounded-lg">
                  <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="w-8 h-8 text-craft-terracotta" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Natural Materials
                  </h3>
                  <p className="text-muted-foreground">
                    Learn about our organic cotton, natural dyes, and sustainable sourcing practices.
                  </p>
                </div>

                <div className="text-center p-6 border border-border rounded-lg">
                  <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-craft-terracotta" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Traditional Techniques
                  </h3>
                  <p className="text-muted-foreground">
                    Discover the ancient methods passed down through generations of Tamil Nadu artisans.
                  </p>
                </div>

                <div className="text-center p-6 border border-border rounded-lg">
                  <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-craft-terracotta" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Craft Process
                  </h3>
                  <p className="text-muted-foreground">
                    Follow the journey from raw materials to finished products in our workshops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Craft;


