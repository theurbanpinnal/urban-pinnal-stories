import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductList from '@/components/ProductList';

const Store: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
            Our Collection
          </h1>
          <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover authentic, handcrafted pieces that tell stories of tradition, 
            skill, and the artisans who create them with love and dedication.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
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
