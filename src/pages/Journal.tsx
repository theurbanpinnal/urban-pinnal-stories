import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, PenTool, Clock, Leaf } from "lucide-react";

const Journal = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>Journal - The Urban Pinnal | Artisan Stories & Sustainable Living</title>
      <meta name="description" content="Read stories from Tamil Nadu artisans, sustainable living tips, and behind-the-scenes insights from The Urban Pinnal craft collective." />
      <meta name="keywords" content="artisan stories, sustainable living blog, handcraft insights, Tamil Nadu culture, eco-friendly lifestyle, craft techniques" />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Journal
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Stories from our artisans, insights into sustainable living, and reflections on craft, heritage, and mindful creation.
            </p>
          </div>
        </section>

        {/* Coming Soon Content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-craft-terracotta/10 rounded-lg p-12 mb-16">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Stories Coming Soon
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Our journal will feature in-depth articles about our artisans, traditional craft techniques, sustainable living practices, 
                  and the cultural heritage of Tamil Nadu. Each story will take you deeper into the world of handmade craftsmanship.
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
                    <BookOpen className="w-8 h-8 text-craft-terracotta" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Artisan Interviews
                  </h3>
                  <p className="text-muted-foreground">
                    Deep conversations with the women who create our beautiful handmade products.
                  </p>
                </div>

                <div className="text-center p-6 border border-border rounded-lg">
                  <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-4">
                    <PenTool className="w-8 h-8 text-craft-terracotta" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Craft Techniques
                  </h3>
                  <p className="text-muted-foreground">
                    Behind-the-scenes looks at traditional techniques and modern applications.
                  </p>
                </div>

                <div className="text-center p-6 border border-border rounded-lg">
                  <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="w-8 h-8 text-craft-terracotta" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Sustainable Living
                  </h3>
                  <p className="text-muted-foreground">
                    Tips and insights on eco-friendly practices and mindful consumption.
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

export default Journal;
