import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { MeasurementUnit, Size, sizes, defaultMeasurements } from "@shared/schema";
import { Ruler } from "lucide-react";

export function MeasurementsPanel() {
  const [unit, setUnit] = useState<MeasurementUnit>("metric");
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [gradeIncrement, setGradeIncrement] = useState(2);
  const [customMeasurements, setCustomMeasurements] = useState(defaultMeasurements.M);

  useEffect(() => {
    const savedUnit = localStorage.getItem("defaultUnit") as MeasurementUnit;
    if (savedUnit) setUnit(savedUnit);
  }, []);

  const convertToImperial = (cm: number) => (cm / 2.54).toFixed(1);
  const convertToMetric = (inches: number) => (inches * 2.54).toFixed(1);

  const getMeasurementValue = (value: number) => {
    return unit === "imperial" ? convertToImperial(value) : value.toString();
  };

  const handleMeasurementChange = (key: keyof typeof customMeasurements, value: string) => {
    const numValue = parseFloat(value) || 0;
    const metricValue = unit === "imperial" ? parseFloat(convertToMetric(numValue)) : numValue;
    
    setCustomMeasurements({
      ...customMeasurements,
      [key]: metricValue,
    });
  };

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Measurement Unit</Label>
        <Tabs value={unit} onValueChange={(v) => setUnit(v as MeasurementUnit)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metric" data-testid="tab-metric">
              Metric (cm)
            </TabsTrigger>
            <TabsTrigger value="imperial" data-testid="tab-imperial">
              Imperial (in)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Size Selection */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Base Size</Label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              size="sm"
              data-testid={`button-size-${size}`}
              onClick={() => {
                setSelectedSize(size);
                setCustomMeasurements(defaultMeasurements[size]);
              }}
              className="min-w-[56px]"
            >
              {size}
            </Button>
          ))}
        </div>
      </Card>

      {/* Auto Grading */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">
          Size Grading Increment
        </Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {gradeIncrement} {unit === "metric" ? "cm" : "in"}
            </span>
            <Badge variant="outline">{selectedSize}</Badge>
          </div>
          <Slider
            value={[gradeIncrement]}
            onValueChange={([value]) => setGradeIncrement(value)}
            min={1}
            max={5}
            step={0.5}
            data-testid="slider-grade-increment"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Adjusts how much each size differs from the base
          </p>
        </div>
      </Card>

      {/* Custom Measurements */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="w-4 h-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Custom Measurements</Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="chest" className="text-xs text-muted-foreground">
              Chest/Bust
            </Label>
            <Input
              id="chest"
              type="number"
              data-testid="input-chest"
              value={getMeasurementValue(customMeasurements.chest)}
              onChange={(e) => handleMeasurementChange("chest", e.target.value)}
              className="mt-1.5 h-12"
            />
          </div>

          <div>
            <Label htmlFor="waist" className="text-xs text-muted-foreground">
              Waist
            </Label>
            <Input
              id="waist"
              type="number"
              data-testid="input-waist"
              value={getMeasurementValue(customMeasurements.waist)}
              onChange={(e) => handleMeasurementChange("waist", e.target.value)}
              className="mt-1.5 h-12"
            />
          </div>

          <div>
            <Label htmlFor="hips" className="text-xs text-muted-foreground">
              Hips
            </Label>
            <Input
              id="hips"
              type="number"
              data-testid="input-hips"
              value={getMeasurementValue(customMeasurements.hips)}
              onChange={(e) => handleMeasurementChange("hips", e.target.value)}
              className="mt-1.5 h-12"
            />
          </div>

          <div>
            <Label htmlFor="shoulder" className="text-xs text-muted-foreground">
              Shoulder
            </Label>
            <Input
              id="shoulder"
              type="number"
              data-testid="input-shoulder"
              value={getMeasurementValue(customMeasurements.shoulder)}
              onChange={(e) => handleMeasurementChange("shoulder", e.target.value)}
              className="mt-1.5 h-12"
            />
          </div>

          <div>
            <Label htmlFor="sleeve" className="text-xs text-muted-foreground">
              Sleeve Length
            </Label>
            <Input
              id="sleeve"
              type="number"
              data-testid="input-sleeve"
              value={getMeasurementValue(customMeasurements.sleeveLength)}
              onChange={(e) => handleMeasurementChange("sleeveLength", e.target.value)}
              className="mt-1.5 h-12"
            />
          </div>

          <div>
            <Label htmlFor="inseam" className="text-xs text-muted-foreground">
              Inseam
            </Label>
            <Input
              id="inseam"
              type="number"
              data-testid="input-inseam"
              value={getMeasurementValue(customMeasurements.inseam)}
              onChange={(e) => handleMeasurementChange("inseam", e.target.value)}
              className="mt-1.5 h-12"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="length" className="text-xs text-muted-foreground">
              Total Length
            </Label>
            <Input
              id="length"
              type="number"
              data-testid="input-length"
              value={getMeasurementValue(customMeasurements.totalLength)}
              onChange={(e) => handleMeasurementChange("totalLength", e.target.value)}
              className="mt-1.5 h-12"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
