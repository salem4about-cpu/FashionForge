import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  necklineTypes, 
  sleeveTypes, 
  hemTypes, 
  fitTypes,
  skirtCuts,
  trouserCuts 
} from "@shared/schema";

interface StylePanelProps {
  garmentType: string;
}

export function StylePanel({ garmentType }: StylePanelProps) {
  const [neckline, setNeckline] = useState<string>("crew");
  const [sleeves, setSleeves] = useState<string>("short");
  const [hem, setHem] = useState<string>("straight");
  const [fit, setFit] = useState<string>("regular");
  const [cut, setCut] = useState<string>("a-line");

  const [hasSeams, setHasSeams] = useState(true);
  const [hasDarts, setHasDarts] = useState(false);
  const [hasPleats, setHasPleats] = useState(false);
  const [hasPockets, setHasPockets] = useState(true);
  const [hasCollar, setHasCollar] = useState(false);
  const [hasCuffs, setHasCuffs] = useState(false);

  const [dartDepth, setDartDepth] = useState(2);
  const [pleatWidth, setPleatWidth] = useState(3);
  const [pocketSize, setPocketSize] = useState(12);

  const showNeckline = ["t-shirt", "hoodie", "dress", "shirt"].includes(garmentType);
  const showSleeves = ["t-shirt", "hoodie", "dress", "shirt", "jacket"].includes(garmentType);
  const showSkirtCut = garmentType === "skirt" || garmentType === "dress";
  const showTrouserCut = garmentType === "trousers";

  return (
    <div className="space-y-6">
      {/* Fit */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Fit</Label>
        <div className="grid grid-cols-2 gap-2">
          {fitTypes.map((type) => (
            <Button
              key={type}
              variant={fit === type ? "default" : "outline"}
              size="sm"
              data-testid={`button-fit-${type}`}
              onClick={() => setFit(type)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </Card>

      {/* Neckline */}
      {showNeckline && (
        <Card className="p-4">
          <Label className="text-sm font-medium mb-3 block">Neckline</Label>
          <div className="grid grid-cols-2 gap-2">
            {necklineTypes.map((type) => (
              <Button
                key={type}
                variant={neckline === type ? "default" : "outline"}
                size="sm"
                data-testid={`button-neckline-${type}`}
                onClick={() => setNeckline(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Sleeves */}
      {showSleeves && (
        <Card className="p-4">
          <Label className="text-sm font-medium mb-3 block">Sleeves</Label>
          <div className="grid grid-cols-2 gap-2">
            {sleeveTypes.map((type) => (
              <Button
                key={type}
                variant={sleeves === type ? "default" : "outline"}
                size="sm"
                data-testid={`button-sleeves-${type}`}
                onClick={() => setSleeves(type)}
                className="capitalize"
              >
                {type.replace("-", " ")}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Hem */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Hem Style</Label>
        <div className="grid grid-cols-2 gap-2">
          {hemTypes.map((type) => (
            <Button
              key={type}
              variant={hem === type ? "default" : "outline"}
              size="sm"
              data-testid={`button-hem-${type}`}
              onClick={() => setHem(type)}
              className="capitalize"
            >
              {type.replace("-", " ")}
            </Button>
          ))}
        </div>
      </Card>

      {/* Skirt Cut */}
      {showSkirtCut && (
        <Card className="p-4">
          <Label className="text-sm font-medium mb-3 block">Skirt Cut</Label>
          <div className="grid grid-cols-2 gap-2">
            {skirtCuts.map((type) => (
              <Button
                key={type}
                variant={cut === type ? "default" : "outline"}
                size="sm"
                data-testid={`button-skirt-${type}`}
                onClick={() => setCut(type)}
                className="capitalize"
              >
                {type.replace("-", " ")}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Trouser Cut */}
      {showTrouserCut && (
        <Card className="p-4">
          <Label className="text-sm font-medium mb-3 block">Trouser Cut</Label>
          <div className="grid grid-cols-2 gap-2">
            {trouserCuts.map((type) => (
              <Button
                key={type}
                variant={cut === type ? "default" : "outline"}
                size="sm"
                data-testid={`button-trouser-${type}`}
                onClick={() => setCut(type)}
                className="capitalize"
              >
                {type.replace("-", " ")}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Details Toggles */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-4 block">Details</Label>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="seams" className="text-sm">Seams</Label>
            <Switch
              id="seams"
              data-testid="switch-seams"
              checked={hasSeams}
              onCheckedChange={setHasSeams}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="darts" className="text-sm">Darts</Label>
            <Switch
              id="darts"
              data-testid="switch-darts"
              checked={hasDarts}
              onCheckedChange={setHasDarts}
            />
          </div>
          {hasDarts && (
            <div className="pl-4 space-y-2">
              <Label className="text-xs text-muted-foreground">
                Dart Depth: {dartDepth}cm
              </Label>
              <Slider
                value={[dartDepth]}
                onValueChange={([value]) => setDartDepth(value)}
                min={0}
                max={10}
                step={0.5}
                data-testid="slider-dart-depth"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="pleats" className="text-sm">Pleats</Label>
            <Switch
              id="pleats"
              data-testid="switch-pleats"
              checked={hasPleats}
              onCheckedChange={setHasPleats}
            />
          </div>
          {hasPleats && (
            <div className="pl-4 space-y-2">
              <Label className="text-xs text-muted-foreground">
                Pleat Width: {pleatWidth}cm
              </Label>
              <Slider
                value={[pleatWidth]}
                onValueChange={([value]) => setPleatWidth(value)}
                min={0}
                max={10}
                step={0.5}
                data-testid="slider-pleat-width"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="pockets" className="text-sm">Pockets</Label>
            <Switch
              id="pockets"
              data-testid="switch-pockets"
              checked={hasPockets}
              onCheckedChange={setHasPockets}
            />
          </div>
          {hasPockets && (
            <div className="pl-4 space-y-2">
              <Label className="text-xs text-muted-foreground">
                Pocket Size: {pocketSize}cm
              </Label>
              <Slider
                value={[pocketSize]}
                onValueChange={([value]) => setPocketSize(value)}
                min={0}
                max={20}
                step={1}
                data-testid="slider-pocket-size"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="collar" className="text-sm">Collar</Label>
            <Switch
              id="collar"
              data-testid="switch-collar"
              checked={hasCollar}
              onCheckedChange={setHasCollar}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="cuffs" className="text-sm">Cuffs</Label>
            <Switch
              id="cuffs"
              data-testid="switch-cuffs"
              checked={hasCuffs}
              onCheckedChange={setHasCuffs}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
