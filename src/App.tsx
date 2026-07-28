import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import RouteSeo from "@/components/RouteSeo";
import Home from "./pages/Home.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfUse from "./pages/TermsOfUse.tsx";

const queryClient = new QueryClient();

const PRELOADER_FADE_MS = 450;

const App = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(
    document.readyState === "complete",
  );
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(
    document.readyState !== "complete",
  );
  const [isPreloaderFading, setIsPreloaderFading] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsPageLoaded(true);
      return;
    }

    const handleLoad = () => setIsPageLoaded(true);
    window.addEventListener("load", handleLoad);

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    if (!isPageLoaded || !isPreloaderVisible) return;

    setIsPreloaderFading(true);
    const timer = window.setTimeout(() => {
      setIsPreloaderVisible(false);
    }, PRELOADER_FADE_MS);

    return () => window.clearTimeout(timer);
  }, [isPageLoaded, isPreloaderVisible]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isPreloaderVisible && (
          <div
            className={`site-preloader ${isPreloaderFading ? "site-preloader--fade" : ""}`}
            aria-label="Loading page"
            role="status"
          >
            <div className="site-preloader__spinner" />
          </div>
        )}
        <div className={`site-content ${isPageLoaded ? "site-content--ready" : ""}`}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Legacy Version 2 URL → approved homepage */}
              <Route path="/version-2" element={<Navigate to="/" replace />} />
              <Route path="/explainer" element={<Index />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <RouteSeo />
            <GoogleAnalytics />
            <CookieConsent />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
