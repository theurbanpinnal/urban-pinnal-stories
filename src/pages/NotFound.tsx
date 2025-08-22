import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      {/* SEO Meta Tags */}
      <title>Page Not Found - The Urban Pinnal</title>
      <meta name="description" content="The page you're looking for doesn't exist. Return to The Urban Pinnal homepage to explore our handmade crafts and artisan stories." />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <section className="min-h-[80vh] flex items-center justify-center px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="font-serif text-8xl md:text-9xl font-bold text-craft-terracotta mb-4">
                404
              </h1>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
                Page Not Found
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                The page you're looking for seems to have wandered off like a thread from our loom. 
                Let's get you back on the right path to discover our beautiful handmade crafts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-craft-terracotta hover:bg-craft-terracotta/90 text-craft-ivory">
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  Return Home
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-craft-terracotta text-craft-terracotta hover:bg-craft-terracotta hover:text-craft-ivory">
                <button onClick={() => window.history.back()}>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go Back
                </button>
              </Button>
            </div>

            <div className="mt-16 text-sm text-muted-foreground">
              <p>Lost? Here are some helpful links:</p>
              <div className="flex flex-wrap justify-center gap-4 mt-3">
                <Link to="/our-story" className="text-craft-terracotta hover:underline">Our Story</Link>
                <Link to="/craft" className="text-craft-terracotta hover:underline">The Craft</Link>
                <Link to="/artisans" className="text-craft-terracotta hover:underline">Our Artisans</Link>
                <Link to="/journal" className="text-craft-terracotta hover:underline">Journal</Link>
                <Link to="/contact" className="text-craft-terracotta hover:underline">Contact</Link>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
