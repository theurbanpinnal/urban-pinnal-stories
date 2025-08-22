import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Truck } from "lucide-react";

const Shipping = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>Shipping & Returns - The Urban Pinnal</title>
      <meta name="description" content="Shipping and returns information for The Urban Pinnal. Learn about our delivery options and return policy." />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 text-center">
            <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-6">
              <Truck className="w-8 h-8 text-craft-terracotta" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Shipping & Returns
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Information about our shipping options, delivery times, and return policy.
            </p>
          </div>
        </section>

        {/* Coming Soon Content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-craft-terracotta/10 rounded-lg p-12 text-center">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Shipping & Returns Policy Coming Soon
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We're currently finalizing our shipping and returns policy. This will include detailed 
                  information about delivery options, shipping costs, processing times, and our return 
                  policy for handmade products. Our goal is to ensure your purchases reach you safely 
                  while supporting our artisan partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Shipping;


