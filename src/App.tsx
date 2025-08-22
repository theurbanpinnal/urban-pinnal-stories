import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Lazy loaded pages (code-splitting)
import { Suspense, lazy } from "react";

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
const NotFound = lazy(() => import(/* webpackChunkName: "page-not-found" */ "./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Suspense boundary to show fallback while lazily loaded pages are fetched */}
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
