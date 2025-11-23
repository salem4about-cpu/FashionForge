import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MeasurementUnit } from "@shared/schema";
import { Info, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const [defaultUnit, setDefaultUnit] = useState<MeasurementUnit>("metric");
  const [darkMode, setDarkMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedUnit = localStorage.getItem("defaultUnit") as MeasurementUnit;
    if (savedUnit) setDefaultUnit(savedUnit);

    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);

    const completedOnboarding = localStorage.getItem("completedOnboarding");
    setShowOnboarding(!completedOnboarding);
  }, []);

  const handleUnitChange = (unit: MeasurementUnit) => {
    setDefaultUnit(unit);
    localStorage.setItem("defaultUnit", unit);
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem("completedOnboarding");
    setShowOnboarding(true);
  };

  const handleClearAllData = async () => {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear IndexedDB
      const { clearAllData } = await import("@/lib/db");
      await clearAllData();
      
      // Reload
      window.location.reload();
    } catch (error) {
      console.error("Failed to clear data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-4">
        <h1 className="text-2xl font-display font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your app preferences
        </p>
      </header>

      <div className="px-4 py-6 space-y-6 max-w-2xl">
        {/* Appearance */}
        <Card className="p-4">
          <h2 className="font-display font-semibold text-lg mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Use dark theme for better visibility in low light
              </p>
            </div>
            <Switch
              id="dark-mode"
              data-testid="switch-dark-mode"
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </Card>

        {/* Measurements */}
        <Card className="p-4">
          <h2 className="font-display font-semibold text-lg mb-4">Measurements</h2>
          <Label className="text-base mb-3 block">Default Unit System</Label>
          <RadioGroup
            value={defaultUnit}
            onValueChange={(value) => handleUnitChange(value as MeasurementUnit)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <RadioGroupItem value="metric" id="metric" data-testid="radio-metric" />
              <Label htmlFor="metric" className="cursor-pointer flex-1 text-base">
                Metric (cm)
                <span className="text-sm text-muted-foreground block">
                  Centimeters for measurements
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="imperial" id="imperial" data-testid="radio-imperial" />
              <Label htmlFor="imperial" className="cursor-pointer flex-1 text-base">
                Imperial (inches)
                <span className="text-sm text-muted-foreground block">
                  Inches for measurements
                </span>
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Onboarding */}
        <Card className="p-4">
          <h2 className="font-display font-semibold text-lg mb-4">Tutorial</h2>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-3">
                {showOnboarding
                  ? "The onboarding tutorial will show when you start the app."
                  : "You've completed the onboarding. Reset it to see it again."}
              </p>
              <Button
                variant="outline"
                size="sm"
                data-testid="button-reset-onboarding"
                onClick={handleResetOnboarding}
              >
                Reset Tutorial
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-4 border-destructive/50">
          <h2 className="font-display font-semibold text-lg mb-4 text-destructive">
            Danger Zone
          </h2>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                data-testid="button-clear-data"
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your designs, palettes, and
                  settings. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAllData}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>

        {/* App Info */}
        <Card className="p-4 bg-muted/50">
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p className="font-display font-semibold">Fashion Designer PWA</p>
            <p>Version 1.0.0</p>
            <p className="text-xs">
              Free, offline-capable garment customization
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
