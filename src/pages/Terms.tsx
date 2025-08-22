import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>Terms of Service - The Urban Pinnal</title>
      <meta name="description" content="Terms of Service for The Urban Pinnal. Read our terms and conditions for using our website and services." />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 text-center">
            <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-craft-terracotta" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Terms of Service
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              The terms and conditions that govern your use of our website and services.
            </p>
          </div>
        </section>

        {/* Coming Soon Content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-craft-terracotta/10 rounded-lg p-12 text-center">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Terms of Service Coming Soon
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We're currently preparing our comprehensive terms of service that will outline the 
                  rules and guidelines for using our website and services. These will include information 
                  about your rights and responsibilities as a user.
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

export default Terms;


