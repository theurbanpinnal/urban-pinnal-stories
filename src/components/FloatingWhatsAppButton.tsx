import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const FloatingWhatsAppButton: React.FC = () => {
  const whatsappNumber = "919884215963"; // international format without +
  const presetMsg = encodeURIComponent("Hello The Urban Pinnal!");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${presetMsg}&app_absent=1`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary/70 backdrop-blur-md text-primary-foreground shadow-lg hover:bg-primary/80 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="currentColor"
            className="w-7 h-7"
          >
            <path d="M16 0C7.164 0 0 7.163 0 16c0 2.833.741 5.558 2.148 7.965L0 32l8.262-2.136A15.93 15.93 0 0 0 16 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.091c-2.545 0-5.053-.67-7.25-1.938l-.519-.302-4.904 1.269 1.313-4.765-.34-.552A12.989 12.989 0 1 1 29 16c0 7.169-5.831 13.091-13 13.091zm7.44-9.651c-.407-.203-2.406-1.188-2.778-1.323-.372-.136-.643-.203-.915.203-.272.407-1.046 1.323-1.282 1.596-.235.272-.47.305-.877.102-.407-.203-1.72-.635-3.276-2.023-1.21-1.076-2.026-2.406-2.263-2.813-.235-.407-.025-.627.178-.83.183-.182.407-.47.611-.705.204-.235.272-.407.407-.678.136-.272.068-.508-.034-.711-.102-.203-.915-2.203-1.252-3.016-.33-.793-.666-.686-.915-.699l-.779-.015c-.272 0-.712.102-1.085.508-.372.407-1.416 1.385-1.416 3.381 0 1.996 1.45 3.923 1.65 4.196.203.272 2.85 4.35 6.915 6.101 4.065 1.75 4.065 1.168 4.799 1.085.734-.085 2.406-.99 2.743-1.945.339-.955.339-1.779.237-1.955-.102-.176-.372-.285-.779-.488z" />
          </svg>
        </a>
      </TooltipTrigger>
      <TooltipContent side="left">
        Message us
      </TooltipContent>
    </Tooltip>
  );
};

export default FloatingWhatsAppButton;
