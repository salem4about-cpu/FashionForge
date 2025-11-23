import { useState } from "react";
import { useLocation } from "wouter";
import { GarmentType, garmentTypes } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

const garmentLabels: Record<GarmentType, string> = {
  "t-shirt": "T-Shirt",
  "hoodie": "Hoodie",
  "dress": "Dress",
  "skirt": "Skirt",
  "trousers": "Trousers",
  "shirt": "Shirt",
  "jacket": "Jacket",
};

const garmentDescriptions: Record<GarmentType, string> = {
  "t-shirt": "Classic casual wear",
  "hoodie": "Comfortable streetwear",
  "dress": "Elegant & versatile",
  "skirt": "Feminine style",
  "trousers": "Professional & casual",
  "shirt": "Smart & refined",
  "jacket": "Layering essential",
};

export default function Templates() {
  const [, setLocation] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<GarmentType | null>(null);

  const handleCreateDesign = () => {
    if (selectedTemplate) {
      // Store selected template and navigate to customize page
      localStorage.setItem("selectedTemplate", selectedTemplate);
      setLocation("/customize");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-4">
        <h1 className="text-2xl font-display font-semibold text-foreground">
          Choose Template
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select a garment to start customizing
        </p>
      </header>

      {/* Template Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {garmentTypes.map((garment) => (
            <Card
              key={garment}
              data-testid={`card-template-${garment}`}
              onClick={() => setSelectedTemplate(garment)}
              className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${
                selectedTemplate === garment
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : ""
              }`}
            >
              <div className="p-4 flex flex-col items-center gap-3">
                {/* Garment Illustration - Simple SVG placeholder */}
                <div className="w-full aspect-[4/5] bg-muted rounded-md flex items-center justify-center">
                  <div className="text-6xl text-muted-foreground/30">
                    {garment === "t-shirt" && "👕"}
                    {garment === "hoodie" && "🧥"}
                    {garment === "dress" && "👗"}
                    {garment === "skirt" && "🎽"}
                    {garment === "trousers" && "👖"}
                    {garment === "shirt" && "👔"}
                    {garment === "jacket" && "🧥"}
                  </div>
                </div>

                {/* Label */}
                <div className="text-center">
                  <h3 className="font-display font-semibold text-foreground">
                    {garmentLabels[garment]}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {garmentDescriptions[garment]}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      {selectedTemplate && (
        <div className="fixed bottom-20 right-4 z-50">
          <Button
            size="lg"
            data-testid="button-create-design"
            onClick={handleCreateDesign}
            className="h-14 px-6 rounded-full shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Design
          </Button>
        </div>
      )}
    </div>
  );
}
