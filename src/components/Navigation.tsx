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

const Navigation = () => {
  const location = useLocation();

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "/our-story" },
    { label: "The Craft", href: "/craft" },
    { label: "Our Artisans", href: "/artisans" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src={logoTransparent} 
              alt="The Urban Pinnal - Handmade Collective" 
              className="h-14 w-auto hover:opacity-90 transition-opacity"
            />
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link to={item.href}>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "font-sans text-sm font-medium transition-colors hover:text-craft-terracotta",
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

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-6 space-y-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "block font-medium text-lg",
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
    </header>
  );
};

export default Navigation;