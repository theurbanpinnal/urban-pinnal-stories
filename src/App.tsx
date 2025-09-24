import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/components/CartProvider";
// Lazy loaded pages (code-splitting)
import { Suspense, lazy, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ResourcePreloader from "@/components/ResourcePreloader";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { getBrowserCapabilities } from "@/lib/instagram-browser-detection";
import heroImage from "@/assets/hero_3.png";

const Index = lazy(() => import(/* webpackChunkName: "page-index" */ "./pages/Index"));
const OurStory = lazy(() => import(/* webpackChunkName: "page-our-story" */ "./pages/OurStory"));
const Contact = lazy(() => import(/* webpackChunkName: "page-contact" */ "./pages/Contact"));
const Craft = lazy(() => import(/* webpackChunkName: "page-craft" */ "./pages/Craft"));
const Artisans = lazy(() => import(/* webpackChunkName: "page-artisans" */ "./pages/Artisans"));
const Journal = lazy(() => import(/* webpackChunkName: "page-journal" */ "./pages/Journal"));
const JournalPost = lazy(() => import(/* webpackChunkName: "page-journal-post" */ "./pages/JournalPost"));
const Privacy = lazy(() => import(/* webpackChunkName: "page-privacy" */ "./pages/Privacy"));
const Terms = lazy(() => import(/* webpackChunkName: "page-terms" */ "./pages/Terms"));
const Shipping = lazy(() => import(/* webpackChunkName: "page-shipping" */ "./pages/Shipping"));
const FAQ = lazy(() => import(/* webpackChunkName: "page-faq" */ "./pages/FAQ"));
const Store = lazy(() => import(/* webpackChunkName: "page-store" */ "./pages/Store"));
const Products = lazy(() => import(/* webpackChunkName: "page-products" */ "./pages/Products"));
const ProductPage = lazy(() => import(/* webpackChunkName: "page-product" */ "./pages/ProductPage"));
const CartPage = lazy(() => import(/* webpackChunkName: "page-cart" */ "./pages/CartPage"));
const NotFound = lazy(() => import(/* webpackChunkName: "page-not-found" */ "./pages/NotFound"));

// Create QueryClient for CMS data only (not for GraphQL)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes for CMS data
      gcTime: 10 * 60 * 1000, // 10 minutes cache time
      retry: 1,
    },
  },
});

const App = () => {
  // Apply Instagram browser class to body for CSS targeting
  useEffect(() => {
    const capabilities = getBrowserCapabilities();
    if (capabilities.isInstagram) {
      document.body.classList.add('instagram-browser');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('instagram-browser');
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <ResourcePreloader images={[heroImage]} />
          <Toaster />
          <BrowserRouter>
            {/* Suspense boundary to show fallback while lazily loaded pages are fetched */}
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/our-story" element={<OurStory />} />
                <Route path="/craft" element={<Craft />} />
                <Route path="/artisans" element={<Artisans />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/journal/:slug" element={<JournalPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/store" element={<Store />} />
                <Route path="/products" element={<Products />} />
                <Route path="/store/products/:handle" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <FloatingWhatsAppButton />
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
