import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LoginButtonProps {
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  showTooltip?: boolean;
  tooltipText?: string;
  iconOnly?: boolean;
}

const LoginButton = ({ 
  variant = "ghost", 
  size = "default", 
  className,
  children,
  showTooltip = false,
  tooltipText = "Login to track your orders",
  iconOnly = false
}: LoginButtonProps) => {
  const handleLogin = () => {
    // Get the Shopify store domain from environment variables
    const shopifyDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
    
    if (!shopifyDomain) {
      console.error('Shopify store domain not configured');
      return;
    }
    
    // Navigate to Shopify customer login page
    const loginUrl = `https://${shopifyDomain}/account/login`;
    window.open(loginUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={iconOnly ? "icon" : size}
            onClick={handleLogin}
            className={cn(
              iconOnly 
                ? "w-10 h-10" 
                : "font-sans text-xs sm:text-sm xl:text-base font-medium transition-all duration-200 ease-out hover:text-craft-terracotta hover:bg-accent/10 px-2 sm:px-3 xl:px-4 h-10",
              className
            )}
          >
            <User className={cn("w-4 h-4", !iconOnly && "mr-1 sm:mr-2")} />
            {!iconOnly && (children || "My Account")}
          </Button>
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default LoginButton;
