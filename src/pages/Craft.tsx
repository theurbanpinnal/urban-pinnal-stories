import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Leaf, Users } from "lucide-react";
import heroWeavingImage from "@/assets/hero-weaving.jpg";
import villageLandscapeImage from "@/assets/village-landscape.jpg";

const Craft = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>The Craft - The Urban Pinnal | Traditional Tamil Nadu Techniques</title>
      <meta name="description" content="Discover the traditional craft techniques and natural materials used by The Urban Pinnal artisans. Learn about sustainable handmade processes from Tamil Nadu." />
      <meta name="keywords" content="traditional crafts Tamil Nadu, handloom weaving, natural dyes, sustainable recycled materials, artisan techniques, Chennai craftsmanship" />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full overflow-hidden">
                      <img
              src={villageLandscapeImage}
              alt="Traditional Tamil Nadu village landscape showing the natural environment where our artisans work and source materials"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-6">
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
                The Craft
              </h1>
              <p className="font-sans text-lg md:text-xl opacity-90">
                Where ancient techniques meet contemporary design. Discover the timeless artistry behind every piece in our collection.
              </p>
            </div>
          </div>
        </section>

        {/* Natural Materials Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Natural & Ethical Materials
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                We honour the earth that nurtures us by selecting materials that are gentle on the planet and safe for the people who craft and use them. Our artisans work primarily with <span className="font-semibold text-foreground">wild-harvested cane, sustainably farmed ratan, and locally sourced natural fibres</span>.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Dyes are extracted from <span className="font-semibold text-foreground">turmeric, indigo, marigold</span>, and other botanical sources, ensuring every hue mirrors nature’s own palette. These practices reduce chemical pollution and celebrate the rich biodiversity of Tamil Nadu.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Leaf className="w-8 h-8 text-craft-terracotta" />
                <span className="text-base font-medium text-foreground">100% Plastic-Free & Biodegradable</span>
              </div>
            </div>
            <img 
              src={heroWeavingImage}
              alt="Artisan weaving with natural cane"
              className="rounded-lg shadow-lg object-cover w-full h-[340px]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        {/* Traditional Techniques Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 text-center max-w-5xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Traditional Techniques, Timeless Wisdom
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              From the <span className="font-semibold text-foreground">kuchu knotting</span> that finishes every basket to the intricate <span className="font-semibold text-foreground">wire-koodai weave</span> unique to coastal Tamil Nadu, each technique we use is a living thread of culture. Our master craftswomen pass these skills to apprentices, safeguarding heritage while embracing contemporary design.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Hand-Preparation</h3>
                <p className="text-muted-foreground">Every strand of cane is stripped, soaked, and sun-dried by hand, ensuring optimal strength and flexibility.</p>
              </div>
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Herbal Dye Baths</h3>
                <p className="text-muted-foreground">Natural pigments are fixed using biodegradable mordants, producing colours that mature gracefully with time.</p>
              </div>
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Slow Weaving</h3>
                <p className="text-muted-foreground">Our artisans weave at an unhurried rhythm that honours precision, allowing every curve and corner to settle perfectly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Craft Process Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
              From Field to Home – Our Process
            </h2>
            <ol className="relative border-s border-craft-terracotta/40 ml-3">
              <li className="mb-10 ms-6">
                <span className="absolute -start-3 flex items-center justify-center w-6 h-6 bg-craft-terracotta rounded-full ring-8 ring-background text-craft-ivory">1</span>
                <h3 className="font-semibold text-foreground">Sourcing & Selection</h3>
                <p className="text-muted-foreground">Local farmers and foragers provide raw cane, which is inspected for quality and sustainability credentials.</p>
              </li>
              <li className="mb-10 ms-6">
                <span className="absolute -start-3 flex items-center justify-center w-6 h-6 bg-craft-terracotta rounded-full ring-8 ring-background text-craft-ivory">2</span>
                <h3 className="font-semibold text-foreground">Preparation & Dyeing</h3>
                <p className="text-muted-foreground">Strips are cleansed in rain-water, sun-bleached, then dyed in small, energy-efficient vats using plant pigments.</p>
              </li>
              <li className="mb-10 ms-6">
                <span className="absolute -start-3 flex items-center justify-center w-6 h-6 bg-craft-terracotta rounded-full ring-8 ring-background text-craft-ivory">3</span>
                <h3 className="font-semibold text-foreground">Weaving & Finishing</h3>
                <p className="text-muted-foreground">Artisans weave each piece in their home studios, finishing with hand-stitched labels signed by its maker.</p>
              </li>
            </ol>
            <div className="flex items-center justify-center mt-12">
              <Users className="w-8 h-8 text-craft-terracotta mr-3" />
              <span className="font-medium text-foreground">Every purchase supports over 50 rural craftswomen.</span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Craft;


