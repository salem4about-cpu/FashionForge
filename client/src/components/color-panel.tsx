import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const popularColors = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
  "#FFC0CB", "#A52A2A", "#808080", "#FFD700", "#4B0082"
];

export function ColorPanel() {
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
  const [customColor, setCustomColor] = useState("#000000");

  return (
    <div className="space-y-6">
      {/* Primary Color */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Primary Color</Label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            data-testid="input-primary-color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-16 h-16 rounded-lg cursor-pointer border-2 border-border"
          />
          <div className="flex-1">
            <div className="text-lg font-mono">{primaryColor.toUpperCase()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Main garment color
            </div>
          </div>
        </div>
      </Card>

      {/* Secondary Color */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Secondary Color</Label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            data-testid="input-secondary-color"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            className="w-16 h-16 rounded-lg cursor-pointer border-2 border-border"
          />
          <div className="flex-1">
            <div className="text-lg font-mono">{secondaryColor.toUpperCase()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Accents and details
            </div>
          </div>
        </div>
      </Card>

      {/* Color Swatches */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Quick Swatches</Label>
        <div className="grid grid-cols-5 gap-2">
          {popularColors.map((color) => (
            <button
              key={color}
              data-testid={`swatch-${color}`}
              onClick={() => setPrimaryColor(color)}
              className={`w-full aspect-square rounded-md border-2 transition-all hover-elevate active-elevate-2 ${
                primaryColor === color
                  ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "border-border"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </Card>

      {/* Custom Color Input */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Custom Color</Label>
        <div className="flex gap-2">
          <input
            type="text"
            data-testid="input-custom-color"
            value={customColor}
            onChange={(e) => {
              const value = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                setCustomColor(value);
              }
            }}
            placeholder="#000000"
            className="flex-1 h-12 px-3 rounded-md border-2 border-input bg-background font-mono text-sm"
            maxLength={7}
          />
          <Button
            onClick={() => {
              if (/^#[0-9A-Fa-f]{6}$/.test(customColor)) {
                setPrimaryColor(customColor);
              }
            }}
            data-testid="button-apply-custom"
          >
            Apply
          </Button>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Color Preview</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-2">Primary</div>
            <div
              className="w-full h-20 rounded-md border-2 border-border"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-2">Secondary</div>
            <div
              className="w-full h-20 rounded-md border-2 border-border"
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
