import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import logoTransparent from "@/assets/logo-transparent.png";
import Cart from "@/components/Cart";

const Navigation = () => {
  const location = useLocation();

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Store", href: "/store" },
    { label: "Our Story", href: "/our-story" },
    { label: "The Craft", href: "/craft" },
    { label: "Our Artisans", href: "/artisans" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
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
                  {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <Link to={item.href}>
                        <NavigationMenuLink
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "font-sans text-xs sm:text-sm xl:text-base font-medium transition-colors hover:text-craft-terracotta px-2 sm:px-3 xl:px-4",
                            location.pathname === item.href && "text-craft-terracotta"
                          )}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
            <Cart />
          </div>

          {/* Mobile navigation */}
          <div className="flex items-center gap-2 lg:hidden">
            <Cart />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-4 sm:p-6 space-y-4 sm:space-y-6 h-screen overflow-y-auto custom-scrollbar">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "block font-medium text-base sm:text-lg py-2 sm:py-3 border-b border-border/20 last:border-b-0",
                      location.pathname === item.href ? "text-craft-terracotta" : "text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;