import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BrandIntroduction = () => {
  return (
    <section className="py-20 lg:py-28 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-foreground mb-12">
          Weaving Stories, Empowering Hands.
        </h2>
        
        <div className="space-y-8 text-lg lg:text-xl text-muted-foreground leading-relaxed">
          <p>
            At The Urban Pinnal, we believe every thread tells a story. Born from Chennai's rich heritage of craftsmanship, 
            we bridge the gap between traditional artisans and contemporary design. Our collective represents more than just 
            handmade products – it's a movement that honors age-old techniques while embracing modern sensibilities.
          </p>
          
          <p>
            Each piece in our collection is meticulously crafted by skilled artisans from Tamil Nadu's villages, 
            using techniques passed down through generations. From hand-spun cotton to natural dyes derived from 
            plants and minerals, we ensure that every creation is not just beautiful, but also sustainable and ethically made.
          </p>
        </div>
        
        <div className="mt-12">
          <Button asChild variant="story" size="lg" className="px-12 py-4 text-lg">
            <Link to="/our-story">
              Read Our Story
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BrandIntroduction;