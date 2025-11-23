import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Download, Upload, Trash2, Loader2 } from "lucide-react";
import { ColorPalette } from "@shared/schema";
import { getAllPalettes, savePalette, deletePalette as deletePaletteDB } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

export default function Palettes() {
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPaletteName, setNewPaletteName] = useState("");
  const [newPaletteColors, setNewPaletteColors] = useState<string[]>(["#000000"]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPalettes();
  }, []);

  const loadPalettes = async () => {
    try {
      setLoading(true);
      const loaded = await getAllPalettes();
      
      // Add default palettes if none exist
      if (loaded.length === 0) {
        const defaults: ColorPalette[] = [
          {
            id: Date.now().toString(),
            name: "Monochrome",
            colors: ["#000000", "#404040", "#808080", "#C0C0C0", "#FFFFFF"],
            createdAt: Date.now(),
          },
          {
            id: (Date.now() + 1).toString(),
            name: "Earth Tones",
            colors: ["#8B4513", "#A0522D", "#D2691E", "#DEB887", "#F5DEB3"],
            createdAt: Date.now(),
          },
        ];
        
        for (const palette of defaults) {
          await savePalette(palette);
        }
        
        setPalettes(defaults);
      } else {
        setPalettes(loaded);
      }
    } catch (error) {
      console.error("Failed to load palettes:", error);
      toast({
        title: "Error",
        description: "Failed to load color palettes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportPalette = (palette: ColorPalette) => {
    const dataStr = JSON.stringify(palette, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${palette.name.toLowerCase().replace(/\s+/g, "-")}-palette.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPalette = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        const newPalette: ColorPalette = {
          ...imported,
          id: Date.now().toString(),
          createdAt: Date.now(),
        };
        
        await savePalette(newPalette);
        await loadPalettes();
        
        toast({
          title: "Success",
          description: "Palette imported successfully",
        });
      } catch (error) {
        console.error("Failed to import palette:", error);
        toast({
          title: "Error",
          description: "Failed to import palette",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDeletePalette = async (id: string) => {
    try {
      await deletePaletteDB(id);
      await loadPalettes();
      
      toast({
        title: "Success",
        description: "Palette deleted",
      });
    } catch (error) {
      console.error("Failed to delete palette:", error);
      toast({
        title: "Error",
        description: "Failed to delete palette",
        variant: "destructive",
      });
    }
  };

  const handleCreatePalette = async () => {
    if (!newPaletteName.trim()) return;

    try {
      const newPalette: ColorPalette = {
        id: Date.now().toString(),
        name: newPaletteName,
        colors: newPaletteColors,
        createdAt: Date.now(),
      };

      await savePalette(newPalette);
      await loadPalettes();
      
      setNewPaletteName("");
      setNewPaletteColors(["#000000"]);
      setDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Palette created successfully",
      });
    } catch (error) {
      console.error("Failed to create palette:", error);
      toast({
        title: "Error",
        description: "Failed to create palette",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-semibold">
              Color Palettes
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your color collections
            </p>
          </div>

          <div className="flex gap-2">
            <label htmlFor="import-palette">
              <Button
                size="sm"
                variant="outline"
                data-testid="button-import-palette"
                asChild
              >
                <span className="gap-1.5 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Import</span>
                </span>
              </Button>
              <input
                id="import-palette"
                type="file"
                accept=".json"
                onChange={handleImportPalette}
                className="hidden"
              />
            </label>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="button-new-palette" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Create New Palette</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="palette-name">Palette Name</Label>
                    <Input
                      id="palette-name"
                      data-testid="input-palette-name"
                      value={newPaletteName}
                      onChange={(e) => setNewPaletteName(e.target.value)}
                      placeholder="e.g., Summer Pastels"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Colors</Label>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {newPaletteColors.map((color, index) => (
                        <input
                          key={index}
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const updated = [...newPaletteColors];
                            updated[index] = e.target.value;
                            setNewPaletteColors(updated);
                          }}
                          className="w-12 h-12 rounded-md cursor-pointer border-2 border-border"
                        />
                      ))}
                      {newPaletteColors.length < 10 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setNewPaletteColors([...newPaletteColors, "#000000"])
                          }
                          className="h-12 w-12 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleCreatePalette}
                    data-testid="button-create-palette"
                    className="w-full"
                  >
                    Create Palette
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Palettes Grid */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {palettes.map((palette) => (
            <Card key={palette.id} data-testid={`card-palette-${palette.id}`} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground truncate">
                    {palette.name}
                  </h3>
                  <div className="flex gap-2 mt-3">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 rounded-full border-2 border-border flex-shrink-0"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    data-testid={`button-export-${palette.id}`}
                    onClick={() => handleExportPalette(palette)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    data-testid={`button-delete-${palette.id}`}
                    onClick={() => handleDeletePalette(palette.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          </div>
        )}

        {!loading && palettes.length === 0 && (
          <div className="text-center py-12">
            <Palette className="w-12 h-12 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground mt-4">
              No palettes yet. Create your first one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
