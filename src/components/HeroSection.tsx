import heroImage from "@/assets/hero-weaving-3.jpg";
import AnimatedHandwriting from "@/components/AnimatedHandwriting";

// Typewriter sound - disabled due to CORS issues
// const typewriterSfx = "https://cdn.pixabay.com/download/audio/2023/05/25/audio_7e4d3e10ae.mp3?filename=typewriter-typing-146859.mp3";
const typewriterSfx = undefined; // Disable audio for now

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <img 
        src={heroImage}
        alt="Traditional Tamil Nadu handloom weaving process showing skilled artisan hands creating beautiful bags with natural materials"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />
      
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold text-craft-ivory mb-6 leading-tight">
          The Urban Pinnal<span className="text-craft-gold"></span>
        </h1>
        <div className="max-w-3xl mx-auto">
          <AnimatedHandwriting
            text="The Story of Our Hands, The Tradition in Yours."
            duration={4000}
            audioSrc={typewriterSfx}
            className="text-craft-ivory text-0.75xl md:text-2xl lg:text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:-translate-y-1"
          />
        </div>
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