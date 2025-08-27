import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, ArrowRight, Youtube, Twitter } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import logoTransparent from "@/assets/logo-transparent.png";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        toast({
          title: "Welcome to our community!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
      } else {
        toast({
          title: "Subscription failed",
          description: json.message || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-craft-terracotta text-craft-ivory">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="block mb-4">
              <div className="inline-block bg-craft-ivory/95 px-3 sm:px-4 py-2 rounded-lg shadow-sm hover:bg-craft-ivory transition-all">
                <img
                  src={logoTransparent}
                  alt="The Urban Pinnal - Handmade Collective"
                  className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
                  width={140}
                  height={56}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Link>
            <p className="text-craft-ivory/80 leading-relaxed mb-6">
              Empowering rural craftswomen through sustainable, handmade products that celebrate Tamil Nadu's rich heritage.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="https://instagram.com/theurbanpinnal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-craft-ivory/10 rounded-full flex items-center justify-center hover:bg-craft-ivory/20 transition-elegant"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://facebook.com/theurbanpinnal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-craft-ivory/10 rounded-full flex items-center justify-center hover:bg-craft-ivory/20 transition-elegant"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              {/* Pinterest */}
              <a
                href="https://pinterest.com/theurbanpinnal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-craft-ivory/10 rounded-full flex items-center justify-center hover:bg-craft-ivory/20 transition-elegant"
                aria-label="Follow us on Pinterest"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.371 0 .8 5.371 .8 12c0 4.946 3.129 9.126 7.469 10.688-.104-.896-.2-2.287.04-3.28.22-.936 1.408-5.954 1.408-5.954s-.36-.72-.36-1.78c0-1.667 .967-2.914 2.17-2.914 1.023 0 1.515 .77 1.515 1.693 0 1.032-.657 2.573-1 4.006-.286 1.208 .6 2.192 1.773 2.192 2.126 0 3.765-2.246 3.765-5.49 0-2.87-2.062-4.886-5.003-4.886-3.408 0-5.407 2.556-5.407 5.205 0 1.034 .397 2.143 .893 2.745 .098 .12 .112 .224 .083 .344-.091 .376-.298 1.207-.338 1.374-.053 .223-.18 .27-.414 .162-1.547-.716-2.515-2.958-2.515-4.756 0-3.885 2.826-7.456 8.155-7.456 4.277 0 7.604 3.051 7.604 7.132 0 4.247-2.683 7.664-6.406 7.664-1.252 0-2.43-.648-2.834-1.416l-.773 2.95c-.278 1.078-1.03 2.433-1.536 3.254 1.155 .358 2.377 .55 3.653 .55 6.629 0 11.989-5.371 11.989-11.999C24 5.371 18.629 0 12 0z" />
                </svg>
              </a>

              <a
                href="https://youtube.com/@theurbanpinnal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-craft-ivory/10 rounded-full flex items-center justify-center hover:bg-craft-ivory/20 transition-elegant"
                aria-label="Subscribe on YouTube"
              >
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

              <a
                href="https://twitter.com/theurbanpinnal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-craft-ivory/10 rounded-full flex items-center justify-center hover:bg-craft-ivory/20 transition-elegant"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-craft-ivory/80 hover:text-craft-ivory transition-elegant"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/our-story" 
                  className="text-craft-ivory/80 hover:text-craft-ivory transition-elegant"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link 
                  to="/craft" 
                  className="text-craft-ivory/80 hover:text-craft-ivory transition-elegant"
                >
                  The Craft
                </Link>
              </li>
              <li>
                <Link 
                  to="/artisans" 
                  className="text-craft-ivory/80 hover:text-craft-ivory transition-elegant"
                >
                  Our Artisans
                </Link>
              </li>
              <li>
                <Link 
                  to="/journal" 
                  className="text-craft-ivory/80 hover:text-craft-ivory transition-elegant"
                >
                  Journal
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-craft-ivory/80 hover:text-craft-ivory transition-elegant"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Contact</h3>
            <div className="space-y-3 text-craft-ivory/80">
              <p>support@theurbanpinnal.com</p>
              <p>+91 98842 15963</p>
              <p>
                Chennai, Tamil Nadu <br />
                India<br />
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Join Our Journey</h3>
            <p className="text-craft-ivory/80 mb-4">
              Subscribe to receive stories from our artisans and updates on new collections.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-craft-ivory/10 border-craft-ivory/20 text-craft-ivory placeholder:text-craft-ivory/60"
              />
              <Button 
                type="submit" 
                variant="story" 
                size="sm" 
                className="w-full bg-craft-ivory text-craft-terracotta hover:bg-craft-ivory/90"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-craft-ivory/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-craft-ivory/60 text-sm">
              © {currentYear} The Urban Pinnal. All rights reserved. Empowering artisans since 2024.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link to="/privacy" className="text-craft-ivory/60 hover:text-craft-ivory transition-elegant">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-craft-ivory/60 hover:text-craft-ivory transition-elegant">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-craft-ivory/60 hover:text-craft-ivory transition-elegant">
                Shipping & Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;