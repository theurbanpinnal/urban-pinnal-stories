import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewsletterCTA = () => {
  return (
    <section className="py-20 lg:py-28 px-6 bg-secondary/20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-foreground mb-6">
          Join Our Journey
        </h2>
        
        <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Be the first to discover new collections, read artisan stories, and learn about 
          sustainable living practices. Join our community of conscious creators.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input 
            type="email" 
            placeholder="Enter your email address"
            className="flex-1 h-12 text-base border-2 border-muted focus:border-primary"
          />
          <Button variant="newsletter" size="lg" className="h-12 px-8 whitespace-nowrap">
            Subscribe
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default NewsletterCTA;