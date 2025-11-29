import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Cases from "./pages/Cases";
import Submit from "./pages/Submit";
import SubmitCase from "./pages/SubmitCase";
import Scoreboard from "./pages/Scoreboard";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import JournalistDashboard from "./pages/JournalistDashboard";
import AdminTeam from "./pages/AdminTeam";
import CaseDetails from "./pages/CaseDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/case/:id" element={<CaseDetails />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/submit-case" element={<SubmitCase />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/journalist-dashboard" element={<JournalistDashboard />} />
            <Route path="/admin-team" element={<AdminTeam />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
