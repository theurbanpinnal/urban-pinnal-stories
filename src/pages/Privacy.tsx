import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>Privacy Policy - The Urban Pinnal</title>
      <meta name="description" content="Privacy Policy for The Urban Pinnal. Learn how we protect and handle your personal information." />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 text-center">
            <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-craft-terracotta" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
            </p>
          </div>
        </section>

        {/* Coming Soon Content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-craft-terracotta/10 rounded-lg p-12 text-center">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Privacy Policy Coming Soon
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We're currently preparing our comprehensive privacy policy that will detail how we collect, 
                  use, and protect your personal information. In the meantime, rest assured that we take your 
                  privacy seriously and follow industry best practices.
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

export default Privacy;


