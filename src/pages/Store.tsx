import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductList from '@/components/ProductList';

const Store: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/hero-weaving-3.jpg"
            alt="Artisan weaving traditional crafts"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Our Collection
          </h1>
          <p className="font-sans text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Discover authentic, handcrafted pieces that tell stories of tradition, 
            skill, and the artisans who create them with love and dedication.
          </p>
          <a 
            href="#products" 
            className="inline-flex items-center justify-center px-8 py-4 bg-craft-terracotta text-craft-ivory hover:bg-craft-clay transition-all duration-300 font-medium tracking-wide rounded-md text-lg"
          >
            Shop Collection
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Handcrafted with Love
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each piece in our collection is carefully crafted by skilled artisans, 
              preserving traditional techniques while creating modern, timeless designs.
            </p>
          </div>
          
          <ProductList limit={24} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Store;
