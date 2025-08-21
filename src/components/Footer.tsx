import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome to our community!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-craft-terracotta text-craft-ivory">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-serif text-2xl font-bold mb-4 block">
              The Urban Pinnal
            </Link>
            <p className="text-craft-ivory/80 leading-relaxed mb-6">
              Empowering rural craftswomen through sustainable, handmade products that celebrate Tamil Nadu's rich heritage.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/theurbanpinnal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-craft-ivory/10 rounded-full flex items-center justify-center hover:bg-craft-ivory/20 transition-elegant"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/theurbanpinnal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-craft-ivory/10 rounded-full flex items-center justify-center hover:bg-craft-ivory/20 transition-elegant"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://pinterest.com/theurbanpinnal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-craft-ivory/10 rounded-full flex items-center justify-center hover:bg-craft-ivory/20 transition-elegant"
                aria-label="Follow us on Pinterest"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c6.628 0 12-5.372 12-12S18.628 0 12 0zm5.568 8.16c-.169 1.858-.896 3.175-1.84 4.12-.944.944-2.262 1.67-4.12 1.839-.62.056-1.233.084-1.85.084-.617 0-1.23-.028-1.849-.084-1.858-.169-3.176-.895-4.12-1.84-.945-.944-1.671-2.261-1.84-4.119C1.793 7.54 1.765 6.927 1.765 6.31c0-.617.028-1.23.084-1.849.169-1.858.895-3.175 1.84-4.12.944-.944 2.262-1.67 4.12-1.839.619-.056 1.232-.084 1.849-.084.617 0 1.23.028 1.85.084 1.858.169 3.175.895 4.119 1.84.945.944 1.671 2.261 1.84 4.119.056.619.084 1.232.084 1.849 0 .617-.028 1.23-.084 1.849z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xl font-semibold mb-6">Quick Links</h3>
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
            <h3 className="font-serif text-xl font-semibold mb-6">Contact</h3>
            <div className="space-y-3 text-craft-ivory/80">
              <p>hello@theurbanpinnal.com</p>
              <p>+91 98765 43210</p>
              <p>
                123 Anna Salai<br />
                Teynampet, Chennai<br />
                Tamil Nadu 600018
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-xl font-semibold mb-6">Join Our Journey</h3>
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
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-craft-ivory/60 text-sm">
              © {currentYear} The Urban Pinnal. All rights reserved. Empowering artisans since 2024.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-craft-ivory/60 hover:text-craft-ivory transition-elegant">
                Privacy Policy
              </a>
              <a href="/terms" className="text-craft-ivory/60 hover:text-craft-ivory transition-elegant">
                Terms of Service
              </a>
              <a href="/shipping" className="text-craft-ivory/60 hover:text-craft-ivory transition-elegant">
                Shipping & Returns
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;