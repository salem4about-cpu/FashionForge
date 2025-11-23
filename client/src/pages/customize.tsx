import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save, Ruler, Palette, Sparkles, Loader2 } from "lucide-react";
import { MeasurementsPanel } from "@/components/measurements-panel";
import { StylePanel } from "@/components/style-panel";
import { ColorPanel } from "@/components/color-panel";
import { TexturePanel } from "@/components/texture-panel";
import { CanvasWorkspace } from "@/components/canvas-workspace";
import { GarmentDesign, defaultMeasurements } from "@shared/schema";
import { saveDesign, getDesign } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

export default function Customize() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("t-shirt");
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const template = localStorage.getItem("selectedTemplate");
    if (template) {
      setSelectedTemplate(template);
    }
  }, []);

  const handleSaveDesign = async () => {
    try {
      setSaving(true);
      
      const design: GarmentDesign = {
        id: Date.now().toString(),
        name: `${selectedTemplate} Design`,
        garmentType: selectedTemplate as any,
        measurements: { ...defaultMeasurements.M, unit: "metric" },
        style: {
          fit: "regular",
          hasSeams: true,
          hasDarts: false,
          hasPleats: false,
          hasPockets: true,
          hasCollar: false,
          hasCuffs: false,
          dartDepth: 2,
          pleatWidth: 3,
          pocketSize: 12,
        },
        primaryColor: "#000000",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await saveDesign(design);
      
      toast({
        title: "Success",
        description: "Design saved successfully",
      });
    } catch (error) {
      console.error("Failed to save design:", error);
      toast({
        title: "Error",
        description: "Failed to save design",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/95 backdrop-blur-sm z-40">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-display font-semibold">
            Customize
          </h1>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {selectedTemplate}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {canvasZoom}%
          </span>
          <Button
            size="sm"
            data-testid="button-save-design"
            onClick={handleSaveDesign}
            disabled={saving}
            className="gap-1"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
          </Button>
        </div>
      </header>

      {/* Canvas Workspace */}
      <div className="flex-1 overflow-hidden">
        <CanvasWorkspace
          garmentType={selectedTemplate}
          onZoomChange={setCanvasZoom}
        />
      </div>

      {/* Bottom Control Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
            <Button
              size="lg"
              data-testid="button-open-controls"
              className="rounded-full shadow-lg gap-2"
            >
              <Settings className="w-5 h-5" />
              Controls
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[80vh] rounded-t-xl"
        >
          <SheetHeader>
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
            <SheetTitle className="font-display">Customize Your Design</SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="measurements" className="mt-6">
            <TabsList className="grid w-full grid-cols-4 gap-2">
              <TabsTrigger value="measurements" data-testid="tab-measurements" className="gap-1.5">
                <Ruler className="w-4 h-4" />
                <span className="text-xs">Size</span>
              </TabsTrigger>
              <TabsTrigger value="style" data-testid="tab-style" className="gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">Style</span>
              </TabsTrigger>
              <TabsTrigger value="color" data-testid="tab-color" className="gap-1.5">
                <Palette className="w-4 h-4" />
                <span className="text-xs">Color</span>
              </TabsTrigger>
              <TabsTrigger value="texture" data-testid="tab-texture" className="gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Texture</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 overflow-y-auto max-h-[calc(80vh-180px)]">
              <TabsContent value="measurements">
                <MeasurementsPanel />
              </TabsContent>
              <TabsContent value="style">
                <StylePanel garmentType={selectedTemplate} />
              </TabsContent>
              <TabsContent value="color">
                <ColorPanel />
              </TabsContent>
              <TabsContent value="texture">
                <TexturePanel />
              </TabsContent>
            </div>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
}
