import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { submitToWeb3Forms } from "@/lib/form-submissions";
import { useCanonicalUrl } from "@/hooks/use-canonical-url";

const Contact = () => {
  const { toast } = useToast();
  
  // Set canonical URL for contact page
  useCanonicalUrl();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      _honeypot: "", // Hidden field for spam protection
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const result = await submitToWeb3Forms(data);

      if (result.success) {
        toast({
          title: "Message Sent Successfully!",
          description: result.message,
        });
        reset(); // Clear the form
      } else {
        toast({
          title: "Failed to Send Message",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <title>Contact Us - The Urban Pinnal | Handmade Crafts Chennai</title>
      <meta name="description" content="Get in touch with The Urban Pinnal. Contact our Chennai-based women-owned sustainable craft collective. Email, phone, and address details." />
      <meta name="keywords" content="contact Urban Pinnal, Chennai handmade crafts, sustainable artisan contact, Tamil Nadu craftswomen, ethical fashion contact" />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Contact Us
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Reach out to learn more about our handmade, sustainable products and the artisans who create them.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              
              {/* Left Column - Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                    Get in Touch
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    Whether you're interested in our handmade products, want to learn more about our artisans, or have questions about sustainable craftsmanship, we're here to help.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-craft-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-craft-terracotta" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                        Email Us
                      </h3>
                      <p className="text-muted-foreground">support@theurbanpinnal.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-craft-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-craft-terracotta" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                        Call Us
                      </h3>
                      <p className="text-muted-foreground">+91 98842 15963</p>
                      <p className="text-sm text-muted-foreground">Monday - Friday, 10 AM - 6 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-craft-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-craft-terracotta" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                        Visit Our Corporate Office
                      </h3>
                      <p className="text-muted-foreground">
                        The Urban Pinnal<br />
                        621, Canal Road<br />
                        Kilpauk Garden Colony, Chennai - 600010<br />
                        Tamil Nadu, India
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Artisan Partnerships
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Are you a skilled artisan or represent an NGO working with craftswomen? We're always looking to expand our network of talented makers across Tamil Nadu.
                  </p>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="bg-muted/20 rounded-lg self-start">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Honeypot field for spam protection - hidden from users */}
                  <input
                    {...register("_honeypot")}
                    type="text"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      {...register("name")}
                      className={`w-full ${errors.name ? "border-red-500" : ""}`}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={`w-full ${errors.email ? "border-red-500" : ""}`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-foreground mb-2 block">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      {...register("subject")}
                      className={`w-full ${errors.subject ? "border-red-500" : ""}`}
                      placeholder="What would you like to discuss?"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      className={`w-full min-h-[120px] ${errors.message ? "border-red-500" : ""}`}
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    variant="elegant" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Contact;