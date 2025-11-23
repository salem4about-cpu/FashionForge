import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Don't show if user previously dismissed
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed top-4 left-4 right-4 z-50 p-4 shadow-lg bg-primary text-primary-foreground border-primary-border md:left-auto md:right-4 md:max-w-sm">
      <div className="flex items-start gap-3">
        <Download className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold mb-1">Install App</h3>
          <p className="text-sm opacity-90 mb-3">
            Add to your home screen for offline access and a better experience
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              data-testid="button-pwa-install"
              onClick={handleInstall}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Install
            </Button>
            <Button
              size="sm"
              variant="ghost"
              data-testid="button-pwa-dismiss"
              onClick={handleDismiss}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              Not now
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 hover-elevate rounded-full p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
