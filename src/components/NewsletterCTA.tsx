import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

type NewsletterData = { email: string };

const NewsletterCTA = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<NewsletterData>({ defaultValues: { email: "" } });
  const { toast } = useToast();

  const onSubmit = async (data: NewsletterData) => {
    try {
      // Our secure, serverless API endpoint will handle the MailerLite logic
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });
      
      const json = await res.json();

      if (res.ok && json.success) {
        toast({ title: "Subscribed!", description: "Check your inbox for confirmation." });
        reset();
      } else {
        toast({ title: "Subscription failed", description: json.message || "Try again later", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Network error", description: "Please try again later", variant: "destructive" });
    }
  };

  return (
    <section className="py-12 lg:py-18 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-foreground mb-6">
          Join Our Journey
        </h2>
        
        <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Be the first to discover new collections, read artisan stories, and learn about 
          sustainable living practices. Join our community of conscious creators.
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            className={`flex-1 h-12 text-base border-2 border-muted focus:border-primary ${errors.email ? 'border-red-500' : ''}`}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 text-left absolute -bottom-6">{errors.email.message}</p>
          )}
          <Button variant="newsletter" size="lg" className="h-12 px-8 whitespace-nowrap" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Subscribe"}
          </Button>
        </form>
        
        <p className="text-sm text-muted-foreground mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;