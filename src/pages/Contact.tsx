import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
                      <p className="text-muted-foreground">hello@theurbanpinnal.com</p>
                      <p className="text-muted-foreground">partnerships@theurbanpinnal.com</p>
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
                      <p className="text-muted-foreground">+91 98765 43210</p>
                      <p className="text-sm text-muted-foreground">Monday - Friday, 9 AM - 6 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-craft-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-craft-terracotta" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                        Visit Our Studio
                      </h3>
                      <p className="text-muted-foreground">
                        The Urban Pinnal Studio<br />
                        123 Anna Salai<br />
                        Teynampet, Chennai - 600018<br />
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
              <div className="bg-muted/20 p-8 rounded-lg">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-foreground mb-2 block">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="What would you like to discuss?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full min-h-[120px]"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="elegant" 
                    size="lg" 
                    className="w-full"
                  >
                    Send Message
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