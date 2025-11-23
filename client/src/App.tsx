import { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/bottom-nav";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { OfflineIndicator } from "@/components/offline-indicator";
import Templates from "@/pages/templates";
import Customize from "@/pages/customize";
import Palettes from "@/pages/palettes";
import Settings from "@/pages/settings";
import Onboarding from "@/pages/onboarding";
import NotFound from "@/pages/not-found";

function Router() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const completedOnboarding = localStorage.getItem("completedOnboarding");
    setShowOnboarding(!completedOnboarding);

    // Initialize theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Wait for initialization
  if (showOnboarding === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show onboarding if not completed
  if (showOnboarding) {
    return <Onboarding />;
  }

  return (
    <>
      <PWAInstallPrompt />
      <OfflineIndicator />
      <Switch>
        <Route path="/" component={Templates} />
        <Route path="/customize" component={Customize} />
        <Route path="/palettes" component={Palettes} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
