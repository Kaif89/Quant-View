import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { StockProvider } from "@/hooks/useStock";
import { ThemeProvider } from "@/hooks/useTheme";
import { ThemeTransitionManager } from "@/components/ThemeTransitionManager";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const CLERK_AVAILABLE = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!CLERK_AVAILABLE) return <>{children}</>;
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><Navigate to="/login" replace /></SignedOut>
    </>
  );
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  if (!CLERK_AVAILABLE) return <>{children}</>;
  return (
    <>
      <SignedIn><Navigate to="/dashboard" replace /></SignedIn>
      <SignedOut>{children}</SignedOut>
    </>
  );
}

import CustomCursor from "@/components/CustomCursor/CustomCursor";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/*" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/signup/*" element={<AuthRoute><Login /></AuthRoute>} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="flex h-screen w-full bg-background overflow-hidden">
              <AppSidebar />
              <Dashboard />
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <StockProvider>
          <BrowserRouter>
            <ThemeTransitionManager>
              <CustomCursor />
              <AppRoutes />
            </ThemeTransitionManager>
          </BrowserRouter>
        </StockProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
