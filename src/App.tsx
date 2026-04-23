import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Reading from "./pages/Reading.tsx";
import AuthorProfile from "./pages/AuthorProfile.tsx";
import Category from "./pages/Category.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/yazi/:slug" element={<Reading />} />
          <Route path="/yazar/:slug" element={<AuthorProfile />} />
          <Route path="/kategori/:slug" element={<Category />} />
          <Route path="/etiket/:slug" element={<Category />} />
          <Route path="/arastirmalar" element={<Category />} />
          <Route path="/kolektif" element={<Category />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
