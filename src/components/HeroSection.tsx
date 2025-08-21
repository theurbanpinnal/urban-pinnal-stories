import heroImage from "@/assets/hero-weaving.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold text-craft-ivory mb-6 leading-tight">
          The Urban <span className="text-craft-gold">பின்னல்</span>
        </h1>
        <p className="font-serif text-xl md:text-2xl lg:text-3xl text-craft-ivory/90 max-w-3xl mx-auto leading-relaxed">
          The Story of Our Hands, The Tradition in Yours.
        </p>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-craft-ivory/80">
        <div className="animate-bounce">
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;