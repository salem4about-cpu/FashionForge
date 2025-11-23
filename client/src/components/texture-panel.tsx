import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload } from "lucide-react";
import { textureTypes } from "@shared/schema";

const textureLabels: Record<string, string> = {
  denim: "Denim",
  cotton: "Cotton",
  silk: "Silk",
  satin: "Satin",
  knit: "Knit",
  linen: "Linen",
  velvet: "Velvet",
  custom: "Custom",
};

export function TexturePanel() {
  const [selectedTexture, setSelectedTexture] = useState<string>("cotton");
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [tiling, setTiling] = useState(true);
  const [customTextureUrl, setCustomTextureUrl] = useState<string | null>(null);

  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomTextureUrl(event.target?.result as string);
      setSelectedTexture("custom");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Texture Library */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Texture Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {textureTypes.filter(t => t !== "custom").map((texture) => (
            <Button
              key={texture}
              variant={selectedTexture === texture ? "default" : "outline"}
              size="sm"
              data-testid={`button-texture-${texture}`}
              onClick={() => setSelectedTexture(texture)}
              className="capitalize h-auto py-3"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded bg-muted/50 border border-border" />
                <span className="text-xs">{textureLabels[texture]}</span>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Upload Custom Texture */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Upload Custom Texture</Label>
        <label
          htmlFor="texture-upload"
          className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover-elevate transition-all"
        >
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">
            Click to upload PNG/JPG
          </span>
          <input
            id="texture-upload"
            data-testid="input-texture-upload"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleTextureUpload}
            className="hidden"
          />
        </label>
        {customTextureUrl && (
          <div className="mt-3">
            <img
              src={customTextureUrl}
              alt="Custom texture preview"
              className="w-full h-24 object-cover rounded-md border-2 border-border"
            />
          </div>
        )}
      </Card>

      {/* Texture Controls */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-4 block">Texture Controls</Label>
        <div className="space-y-4">
          {/* Scale */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Scale</Label>
              <span className="text-xs font-mono">{scale.toFixed(1)}x</span>
            </div>
            <Slider
              value={[scale]}
              onValueChange={([value]) => setScale(value)}
              min={0.1}
              max={5}
              step={0.1}
              data-testid="slider-texture-scale"
            />
          </div>

          {/* Rotation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Rotation</Label>
              <span className="text-xs font-mono">{rotation}°</span>
            </div>
            <Slider
              value={[rotation]}
              onValueChange={([value]) => setRotation(value)}
              min={0}
              max={360}
              step={5}
              data-testid="slider-texture-rotation"
            />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Opacity</Label>
              <span className="text-xs font-mono">{Math.round(opacity * 100)}%</span>
            </div>
            <Slider
              value={[opacity]}
              onValueChange={([value]) => setOpacity(value)}
              min={0}
              max={1}
              step={0.05}
              data-testid="slider-texture-opacity"
            />
          </div>

          {/* Tiling Toggle */}
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="tiling" className="text-sm">Enable Tiling</Label>
            <Button
              variant={tiling ? "default" : "outline"}
              size="sm"
              data-testid="button-tiling-toggle"
              onClick={() => setTiling(!tiling)}
            >
              {tiling ? "On" : "Off"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Preview</Label>
        <div
          className="w-full h-32 rounded-md border-2 border-border bg-muted"
          style={{
            opacity,
            transform: `rotate(${rotation}deg) scale(${scale})`,
            backgroundSize: tiling ? "auto" : "cover",
            backgroundRepeat: tiling ? "repeat" : "no-repeat",
          }}
        />
      </Card>
    </div>
  );
}
