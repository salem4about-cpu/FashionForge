import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Hand, 
  Ruler, 
  Palette, 
  Save, 
  ChevronRight,
  Sparkles 
} from "lucide-react";

const steps = [
  {
    title: "Welcome to Fashion Designer",
    description: "Create custom garment designs with professional tools—completely free and works offline.",
    icon: Sparkles,
    illustration: (
      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
        <Sparkles className="w-24 h-24 text-primary" />
      </div>
    ),
  },
  {
    title: "Touch Controls",
    description: "Drag to move your design, pinch to zoom, and tap to select. All optimized for mobile.",
    icon: Hand,
    illustration: (
      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-primary/20 rounded-full animate-pulse" />
          <Hand className="w-16 h-16 text-primary absolute" />
        </div>
      </div>
    ),
  },
  {
    title: "Measurements & Sizing",
    description: "Input custom measurements or choose from standard sizes. Auto-grade from S to XXL with adjustable increments.",
    icon: Ruler,
    illustration: (
      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
        <Ruler className="w-24 h-24 text-primary" />
      </div>
    ),
  },
  {
    title: "Colors & Textures",
    description: "Choose from color palettes, upload custom textures, and fine-tune every detail with precision controls.",
    icon: Palette,
    illustration: (
      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center gap-2">
        {["#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"].map((color, i) => (
          <div
            key={i}
            className="w-12 h-32 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    ),
  },
  {
    title: "Save & Work Offline",
    description: "All your designs are saved locally. Install this app and keep designing—even without internet.",
    icon: Save,
    illustration: (
      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
        <Save className="w-24 h-24 text-primary" />
      </div>
    ),
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("completedOnboarding", "true");
      setLocation("/");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("completedOnboarding", "true");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="sm"
          data-testid="button-skip-onboarding"
          onClick={handleSkip}
        >
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-md space-y-8">
          {/* Illustration */}
          <div className="relative">
            {step.illustration}
          </div>

          {/* Content */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-semibold">
                {step.title}
              </h1>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </Card>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Next/Done Button */}
          <Button
            size="lg"
            data-testid="button-onboarding-next"
            onClick={handleNext}
            className="w-full gap-2"
          >
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
