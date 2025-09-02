import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Users, Heart, Leaf } from "lucide-react";
import bannerImage from "@/assets/story-banner.jpg";
import founderArtisanImage from "@/assets/founder-artisan.jpg";
import villageImage from "@/assets/village-landscape.jpg";

const OurStory = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>Our Story - The Urban Pinnal | Women Artisans Tamil Nadu</title>
      <meta name="description" content="Learn about The Urban Pinnal's mission to empower rural craftswomen in Tamil Nadu. Discover our story of sustainable craftsmanship and women's empowerment." />
      <meta name="keywords" content="women artisans Tamil Nadu, sustainable craftsmanship, rural craftswomen empowerment, Chennai handmade, ethical craft collective, women-owned business India" />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Banner Section */}
        <section className="relative h-[60vh] w-full overflow-hidden">
          <img
            src={bannerImage}
            alt="Tamil Nadu craftswomen working together on traditional handloom weaving in rural village setting"
            className="w-full h-full object-cover"
            loading="eager"
            {...{ fetchpriority: "high" }}
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-6">
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
                Our Story
              </h1>
              <p className="font-sans text-lg md:text-xl opacity-90">
                A journey of empowerment, heritage, and mindful creation
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-16">
          {/* Mission Statement */}
          <section className="text-center mb-20">
            <blockquote className="font-serif text-2xl md:text-3xl text-craft-terracotta leading-relaxed max-w-4xl mx-auto">
              "To bring global recognition to the exceptional talent of rural Indian craftswomen and ensure their craft attains sustainability."
            </blockquote>
          </section>

          {/* The Full Story */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-4xl font-bold text-foreground mb-12 text-center">
                The Full Story
              </h2>
              
              <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
                <p>
                  We are a woman-founded organization born from a desire to connect conscious consumers with the heart of Indian craftsmanship. We journey into the rural villages of Tamil Nadu to collaborate directly with small-scale women artisans and NGOs.
                </p>

                <div className="flex flex-col md:flex-row gap-8 items-center my-12">
                  <div className="md:w-1/2">
                    <img
                      src={founderArtisanImage}
                      alt="Urban Pinnal artisan, an elderly Tamil Nadu artisan woman, showing hands working on traditional craft techniques"
                      className="w-full rounded-lg shadow-craft"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <p>
                      Many of these women possess incredible, inherited skills that are at risk of fading away. We provide them with a platform, ensure fair wages, and help their craft attain the sustainability it deserves.
                    </p>
                  </div>
                </div>

                <p>
                  We partner with local NGOs to train younger women, ensuring these beautiful traditions not only survive but thrive. Every product we offer is a piece of this story—a story of empowerment, heritage, and mindful creation.
                </p>

                <div className="flex flex-col md:flex-row-reverse gap-8 items-center my-12">
                  <div className="md:w-1/2">
                    <img
                      src={villageImage}
                      alt="A woman in Chennai, India, weaves a vibrant plastic basket. Seated in profile, she concentrates on the intricate work, with partially finished baskets and materials nearby."
                      className="w-full rounded-lg shadow-craft"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <p>
                      Our commitment extends beyond individual artisans to entire communities. We work to preserve the cultural heritage of Tamil Nadu while creating economic opportunities that allow traditional crafts to flourish in the modern world.
                    </p>
                  </div>
                </div>

                <p>
                  Through our work, we're not just creating beautiful products—we're weaving together the past and future, honoring tradition while embracing innovation, and ensuring that the exceptional talent of rural Indian craftswomen receives the global recognition it deserves.
                </p>
              </div>
            </div>
          </section>

          {/* Core Pillars */}
          <section className="bg-muted/30 py-16 px-8 rounded-lg">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-12 text-center">
              Our Core Pillars
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-craft-terracotta" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Women's Empowerment
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We collaborate directly with skilled women artisans from rural villages, ensuring fair wages and a sustainable livelihood.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-craft-terracotta" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Preserving Heritage
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We work to protect and promote ancestral crafting techniques, celebrating the rich cultural heritage of Tamil Nadu.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-6">
                  <Leaf className="w-8 h-8 text-craft-terracotta" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Sustainable Practice
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  From natural, locally-sourced materials to eco-friendly processes, our commitment to the planet is woven into everything we do.
                </p>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default OurStory;