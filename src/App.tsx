import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
// Lazy loaded pages (code-splitting)
import { Suspense, lazy } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ResourcePreloader from "@/components/ResourcePreloader";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import heroImage from "@/assets/hero-weaving-3.jpg";

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
const Store = lazy(() => import(/* webpackChunkName: "page-store" */ "./pages/Store"));
const ProductPage = lazy(() => import(/* webpackChunkName: "page-product" */ "./pages/ProductPage"));
const CartPage = lazy(() => import(/* webpackChunkName: "page-cart" */ "./pages/CartPage"));
const NotFound = lazy(() => import(/* webpackChunkName: "page-not-found" */ "./pages/NotFound"));

// Create QueryClient with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
    },
  },
});

const App = () => (
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
              <Route path="/store" element={<Store />} />
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

export default App;
