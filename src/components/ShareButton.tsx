import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Share2, MessageCircle, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

interface ShareButtonProps {
  productTitle: string;
  productUrl: string;
  productImage?: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  productTitle, 
  productUrl, 
  productImage,
  className = "" 
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const shareText = `Check out this beautiful handmade product: ${productTitle}`;
  
  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}&app_absent=1`;
    window.open(whatsappUrl, '_blank');
    setIsSharing(false);
  };

  const shareOnInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
    const instagramText = `${shareText}\n\n${productUrl}`;
    navigator.clipboard.writeText(instagramText).then(() => {
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard. You can now paste it in Instagram.",
      });
    });
    setIsSharing(false);
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`;
    window.open(twitterUrl, '_blank');
    setIsSharing(false);
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(facebookUrl, '_blank');
    setIsSharing(false);
  };

  const shareViaEmail = () => {
    const emailSubject = `Check out this product: ${productTitle}`;
    const emailBody = `${shareText}\n\n${productUrl}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(emailUrl, '_blank');
    setIsSharing(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard.",
      });
    });
    setIsSharing(false);
  };

  return (
    <DropdownMenu open={isSharing} onOpenChange={setIsSharing}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="lg"
          className={`font-sans px-6 py-3 text-base border-2 hover:border-foreground ${className}`}
        >
          <Share2 className="mr-3 h-5 w-5" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={shareOnWhatsApp} className="cursor-pointer">
          <MessageCircle className="mr-3 h-4 w-4 text-green-600" />
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnInstagram} className="cursor-pointer">
          <Instagram className="mr-3 h-4 w-4 text-pink-600" />
          Share on Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnTwitter} className="cursor-pointer">
          <Twitter className="mr-3 h-4 w-4 text-blue-500" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnFacebook} className="cursor-pointer">
          <Facebook className="mr-3 h-4 w-4 text-blue-600" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaEmail} className="cursor-pointer">
          <Mail className="mr-3 h-4 w-4 text-gray-600" />
          Share via Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink} className="cursor-pointer">
          <Share2 className="mr-3 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
