import artisan1 from "@/assets/artisan-1.jpg";
import artisan2 from "@/assets/artisan-2.jpg";
import artisan3 from "@/assets/artisan-3.jpg";
import OptimizedLazyImage from "@/components/OptimizedLazyImage";

const FeaturedArtisans = () => {
  const artisans = [
    {
      name: "Kamala Devi",
      village: "Kanchipuram",
      image: artisan1,
    },
    {
      name: "Raman Kumar",
      village: "Thanjavur",
      image: artisan2,
    },
    {
      name: "Priya Shankar",
      village: "Madurai",
      image: artisan3,
    },
  ];

  return (
    <section className="py-20 lg:py-28 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Meet the Makers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Behind every piece lies the skilled hands and passionate hearts of our artisan partners.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {artisans.map((artisan, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-card group-hover:shadow-craft transition-all duration-300">
                  <OptimizedLazyImage
                    src={artisan.image}
                    alt={`Portrait of ${artisan.name}, skilled artisan from ${artisan.village} village in Tamil Nadu, working with traditional handcraft techniques`}
                    context="artisan"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width={192}
                    height={192}
                  />
                </div>
              </div>
              
              <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                {artisan.name}
              </h3>
              <p className="text-muted-foreground text-lg">
                {artisan.village}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtisans;