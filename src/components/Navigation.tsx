import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import logoTransparent from "@/assets/logo-transparent.png";
import Cart from "@/components/Cart";
import DrawerSearch from "@/components/DrawerSearch";
import LoginButton from "@/components/LoginButton";
import founderArtisanImage from "@/assets/founder-artisan.jpg";
import heroWeavingImage from "@/assets/hero-weaving.jpg";
import storyBannerImage from "@/assets/story-banner.jpg";
import villageLandscapeImage from "@/assets/village-landscape.jpg";

const Navigation = () => {
  const location = useLocation();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const primaryNavigationItems = [
    { label: "Store", href: "/store" },
  ];

  const moreMenuItems = [
    { 
      label: "Our Story", 
      href: "/our-story",
      description: "Discover our mission to empower rural craftswomen and preserve traditional techniques."
    },
    { 
      label: "The Craft", 
      href: "/craft",
      description: "Explore the ancient art of handloom weaving and sustainable craftsmanship."
    },
    { 
      label: "Our Artisans", 
      href: "/artisans",
      description: "Meet the talented women who bring these beautiful creations to life."
    },
    { 
      label: "Journal", 
      href: "/journal",
      description: "Read stories, insights, and updates from our artisan community."
    },
  ];

  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 relative">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src={logoTransparent}
              alt="The Urban Pinnal - Handmade Collective"
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain hover:opacity-90 transition-all duration-300"
              width={160}
              height={64}
              loading="eager"
              decoding="async"
            />
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <nav>
              <NavigationMenu>
                <NavigationMenuList>
                  {/* Primary Navigation Items */}
                  {primaryNavigationItems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <Button
                        variant="ghost"
                        asChild
                        className={cn(
                          "font-sans text-xs sm:text-sm xl:text-base font-medium transition-all duration-200 ease-out hover:text-craft-terracotta hover:bg-accent/10 px-2 sm:px-3 xl:px-4 h-10",
                          location.pathname === item.href && "text-craft-terracotta"
                        )}
                      >
                        <Link to={item.href}>
                          {item.label}
                        </Link>
                      </Button>
                    </NavigationMenuItem>
                  ))}
                  
                  {/* Contact Link */}
                  <NavigationMenuItem>
                    <Button
                      variant="ghost"
                      asChild
                      className={cn(
                        "font-sans text-xs sm:text-sm xl:text-base font-medium transition-all duration-200 ease-out hover:text-craft-terracotta hover:bg-accent/10 px-2 sm:px-3 xl:px-4 h-10",
                        location.pathname === "/contact" && "text-craft-terracotta"
                      )}
                    >
                      <Link to="/contact">
                        Contact
                      </Link>
                    </Button>
                  </NavigationMenuItem>
                  
                  {/* About Menu Trigger */}
                  <NavigationMenuItem>
                    <Button
                      variant="ghost"
                      className={cn(
                        "font-sans text-xs sm:text-sm xl:text-base font-medium transition-all duration-200 ease-out hover:text-craft-terracotta hover:bg-accent/10 px-2 sm:px-3 xl:px-4 h-10",
                        ["/our-story", "/craft", "/artisans", "/journal"].includes(location.pathname) && "text-craft-terracotta",
                        isMegaMenuOpen && "text-craft-terracotta"
                      )}
                      onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                      onMouseEnter={() => setIsMegaMenuOpen(true)}
                    >
                      About
                      <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", isMegaMenuOpen && "rotate-180")} />
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
            <LoginButton iconOnly={true} showTooltip={true} />
            <Cart />
            <DrawerSearch />
          </div>

          {/* Mega Menu Content - Positioned absolutely within header */}
          {isMegaMenuOpen && (
            <>
              {/* Overlay to close menu when clicking outside */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsMegaMenuOpen(false)}
              />
              <div 
                className="absolute top-full right-0 w-[95vw] max-w-[1200px] bg-background shadow-lg border border-border/20 rounded-b-lg overflow-hidden z-50"
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
              <div className="flex">
                {/* Left Sidebar - Menu Items */}
                <div className="w-64 bg-muted/30 border-r border-border/20 flex flex-col">
                  <div className="p-6 flex-1">
                    <h3 className="font-serif text-lg font-semibold text-craft-terracotta mb-1">
                      Discover Our Heritage
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Explore our story and craftsmanship
                    </p>
                    
                    <div className="space-y-1">
                      {moreMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={cn(
                            "block px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-background/80 hover:text-craft-terracotta",
                            location.pathname === item.href 
                              ? "bg-background text-craft-terracotta shadow-sm" 
                              : "text-foreground/90"
                          )}
                          onClick={() => setIsMegaMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                      
                      {/* Additional Links */}
                      <div className="pt-3 mt-3 border-t border-border/20">
                        <Link
                          to="/store"
                          className="block px-3 py-2 text-sm font-medium rounded-md text-foreground/90 hover:bg-background/80 hover:text-craft-terracotta transition-colors"
                          onClick={() => setIsMegaMenuOpen(false)}
                        >
                          Shop Our Collection
                        </Link>
                        <Link
                          to="/contact"
                          className="block px-3 py-2 text-sm font-medium rounded-md text-foreground/90 hover:bg-background/80 hover:text-craft-terracotta transition-colors"
                          onClick={() => setIsMegaMenuOpen(false)}
                        >
                          Get In Touch
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* My Account - Pushed to bottom */}
                  <div className="p-6 border-t border-border/20">
                    <LoginButton 
                      variant="link" 
                      className="p-0 h-auto font-medium text-sm text-foreground/90 hover:text-craft-terracotta"
                      showTooltip={true}
                      tooltipText="Login to track your orders"
                    >
                      My Account
                    </LoginButton>
                  </div>
                </div>
                
                {/* Right Content Area */}
                <div className="flex-1 p-8">
                  <div className="grid grid-cols-2 gap-6 h-full">
                    {/* First Story Card */}
                    <Link 
                      to="/artisans"
                      className="mega-menu-card relative overflow-hidden rounded-lg group cursor-pointer block"
                      onClick={() => setIsMegaMenuOpen(false)}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img 
                          src={founderArtisanImage}
                          alt="Skilled artisan working with traditional handloom techniques"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 blur-[1px] group-hover:blur-[0.5px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="relative z-10">
                            <h4 className="font-serif text-lg font-semibold text-white mb-2 group-hover:text-craft-ivory transition-colors">
                              Meet Our Artisans
                            </h4>
                            <p className="text-sm text-craft-ivory/90 mb-3 line-clamp-3">
                              Discover the skilled women who create beautiful handwoven pieces using traditional techniques passed down through generations.
                            </p>
                            <span className="inline-flex items-center text-sm font-medium text-craft-ivory group-hover:text-craft-gold transition-colors">
                              Learn more
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Second Story Card */}
                    <Link 
                      to="/craft"
                      className="mega-menu-card relative overflow-hidden rounded-lg group cursor-pointer block"
                      onClick={() => setIsMegaMenuOpen(false)}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img 
                          src={heroWeavingImage}
                          alt="Traditional handloom weaving process showing skilled artisan hands"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 blur-[1px] group-hover:blur-[0.5px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="relative z-10">
                            <h4 className="font-serif text-lg font-semibold text-white mb-2 group-hover:text-craft-ivory transition-colors">
                              Traditional Craft
                            </h4>
                            <p className="text-sm text-craft-ivory/90 mb-3 line-clamp-3">
                              Explore the ancient art of handloom weaving and sustainable craftsmanship that forms the heart of our collection.
                            </p>
                            <span className="inline-flex items-center text-sm font-medium text-craft-ivory group-hover:text-craft-gold transition-colors">
                              Discover craft
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Third Story Card - Journal */}
                    <Link 
                      to="/journal"
                      className="mega-menu-card relative overflow-hidden rounded-lg group cursor-pointer block"
                      onClick={() => setIsMegaMenuOpen(false)}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img 
                          src={storyBannerImage}
                          alt="Artisan community working together in rural village setting"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 blur-[1px] group-hover:blur-[0.5px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="relative z-10">
                            <h4 className="font-serif text-lg font-semibold text-white mb-2 group-hover:text-craft-ivory transition-colors">
                              Stories & Updates
                            </h4>
                            <p className="text-sm text-craft-ivory/90 mb-3 line-clamp-3">
                              Read insights, stories, and updates from our artisan community and their creative journey.
                            </p>
                            <span className="inline-flex items-center text-sm font-medium text-craft-ivory group-hover:text-craft-gold transition-colors">
                              Read journal
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Fourth Story Card - Our Story */}
                    <Link 
                      to="/our-story"
                      className="mega-menu-card relative overflow-hidden rounded-lg group cursor-pointer block"
                      onClick={() => setIsMegaMenuOpen(false)}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img 
                          src={villageLandscapeImage}
                          alt="Rural village landscape in Tamil Nadu showing traditional craftsmanship heritage"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 blur-[1px] group-hover:blur-[0.5px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="relative z-10">
                            <h4 className="font-serif text-lg font-semibold text-white mb-2 group-hover:text-craft-ivory transition-colors">
                              Our Mission
                            </h4>
                            <p className="text-sm text-craft-ivory/90 mb-3 line-clamp-3">
                              Learn about our mission to empower rural craftswomen and preserve traditional techniques.
                            </p>
                            <span className="inline-flex items-center text-sm font-medium text-craft-ivory group-hover:text-craft-gold transition-colors">
                              Our story
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            </>
          )}

          {/* Mobile navigation */}
          <div className="flex items-center gap-2 lg:hidden">
            <Cart />
            <DrawerSearch />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-4 sm:p-6 space-y-4 sm:space-y-6 h-screen overflow-y-auto custom-scrollbar">
                {/* Primary Navigation */}
                {primaryNavigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "block font-medium text-base sm:text-lg py-2 sm:py-3 border-b border-border/20",
                      location.pathname === item.href ? "text-craft-terracotta" : "text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* My Account Link */}
                <div className="py-2 sm:py-3 border-b border-border/20">
                  <LoginButton 
                    variant="link" 
                    className="p-0 h-auto font-medium text-base sm:text-lg text-foreground hover:text-craft-terracotta"
                  >
                    My Account
                  </LoginButton>
                </div>
                
                {/* More Menu Items */}
                <div className="pt-2">
                  <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                    Explore
                  </h3>
                  {moreMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "block py-2 sm:py-3 border-b border-border/20 last:border-b-0",
                        location.pathname === item.href ? "text-craft-terracotta" : "text-foreground"
                      )}
                    >
                      <div className="font-medium text-base sm:text-lg mb-1">
                        {item.label}
                      </div>
                      <p className="text-sm text-muted-foreground leading-snug">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
                
                {/* Contact Link - After Explore Section */}
                <div className="pt-2">
                  <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                    Support
                  </h3>
                  <div className="py-2 sm:py-3 border-b border-border/20">
                    <Link
                      to="/contact"
                      className={cn(
                        "block font-medium text-base sm:text-lg",
                        location.pathname === "/contact" ? "text-craft-terracotta" : "text-foreground"
                      )}
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;