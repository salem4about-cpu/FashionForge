import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <Badge variant="destructive" className="gap-1.5 px-3 py-1.5">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">Offline Mode</span>
      </Badge>
    </div>
  );
}
