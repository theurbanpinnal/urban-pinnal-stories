import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

type NewsletterData = { email: string; _honeypot?: string };

const NEWSLETTER_ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = "585ab3df-4028-42f3-a758-67ea1fd7be46";

const NewsletterCTA = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<NewsletterData>({ defaultValues: { email: "", _honeypot: "" } });
  const { toast } = useToast();

  const onSubmit = async (data: NewsletterData) => {
    if (data._honeypot) return; // bot
    try {
      const formData = new FormData();
      formData.append("access_key", ACCESS_KEY);
      formData.append("email", data.email);
      formData.append("from", "newsletter");

      const res = await fetch(NEWSLETTER_ENDPOINT, { method: "POST", body: formData });
      const json = await res.json();
      if (json.success) {
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
    <section className="py-20 lg:py-28 px-6 bg-secondary/20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-foreground mb-6">
          Join Our Journey
        </h2>
        
        <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Be the first to discover new collections, read artisan stories, and learn about 
          sustainable living practices. Join our community of conscious creators.
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          {/* honeypot */}
          <input type="text" tabIndex={-1} style={{ display: "none" }} {...register("_honeypot")} />
          <Input
            type="email"
            placeholder="Enter your email address"
            className={`flex-1 h-12 text-base border-2 border-muted focus:border-primary ${errors.email ? 'border-red-500' : ''}`}
            {...register("email", { required: "Email is required" })}
          />
          <Button variant="newsletter" size="lg" className="h-12 px-8 whitespace-nowrap" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Subscribe"}
          </Button>
        </form>
        
        <p className="text-sm text-muted-foreground mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default NewsletterCTA;