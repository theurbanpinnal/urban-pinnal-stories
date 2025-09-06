import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const location = useLocation();
  const currentUrl = `https://theurbanpinnal.com${location.pathname}`;

  // Generate structured data for breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://theurbanpinnal.com${item.url}`
    }))
  };

  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* Visual Breadcrumb */}
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}
      >
        <Link 
          to="/" 
          className="flex items-center hover:text-foreground transition-colors"
          aria-label="Home"
        >
          <Home className="w-4 h-4" />
        </Link>
        
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4" />
            {index === items.length - 1 ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link 
                to={item.url}
                className="hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumb;
