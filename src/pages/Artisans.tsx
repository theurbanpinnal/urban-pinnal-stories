import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Heart, MapPin, Clock, Users } from "lucide-react";

const Artisans = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>Our Artisans - The Urban Pinnal | Women Craftswomen Tamil Nadu</title>
      <meta name="description" content="Meet the talented women artisans behind The Urban Pinnal. Learn about our partnerships with rural craftswomen and NGOs across Tamil Nadu." />
      <meta name="keywords" content="women artisans Tamil Nadu, rural craftswomen, NGO partnerships, artisan profiles, handcraft makers, Chennai artisan collective" />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Our Artisans
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              The skilled hands and passionate hearts behind every piece. Meet the remarkable women who bring our collections to life.
            </p>
          </div>
        </section>

        {/* Coming Soon Content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-craft-terracotta/10 rounded-lg p-12 mb-16">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Artisan Profiles Coming Soon
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  We're preparing beautiful profiles of our partner artisans and NGOs. This page will showcase their stories, 
                  techniques, villages, and the incredible crafts they create. Each artisan has a unique journey and heritage to share.
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
                    <Heart className="w-8 h-8 text-craft-terracotta" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Artisan Stories
                  </h3>
                  <p className="text-muted-foreground">
                    Personal journeys of the women who create our handmade products.
                  </p>
                </div>

                <div className="text-center p-6 border border-border rounded-lg">
                  <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-craft-terracotta" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Village Partnerships
                  </h3>
                  <p className="text-muted-foreground">
                    Explore the rural communities and NGOs we collaborate with across Tamil Nadu.
                  </p>
                </div>

                <div className="text-center p-6 border border-border rounded-lg">
                  <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-craft-terracotta" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Skills & Heritage
                  </h3>
                  <p className="text-muted-foreground">
                    Traditional techniques and knowledge passed down through generations.
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

export default Artisans;
