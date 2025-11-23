import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCw, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CanvasWorkspaceProps {
  garmentType: string;
  onZoomChange?: (zoom: number) => void;
}

export function CanvasWorkspace({ garmentType, onZoomChange }: CanvasWorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "rgba(128, 128, 128, 0.1)";
    ctx.lineWidth = 1;
    const gridSize = 20;

    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw simple garment placeholder
    const centerX = canvas.width / 2 + position.x;
    const centerY = canvas.height / 2 + position.y;
    const scale = zoom / 100;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);

    // Basic garment shape (T-shirt example)
    ctx.fillStyle = "#a855f7";
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;

    ctx.beginPath();
    
    if (garmentType === "t-shirt") {
      // T-shirt body
      ctx.rect(-80, -60, 160, 140);
      // Sleeves
      ctx.rect(-120, -60, 40, 60);
      ctx.rect(80, -60, 40, 60);
    } else if (garmentType === "dress") {
      // Dress body
      ctx.rect(-80, -60, 160, 100);
      // Skirt
      ctx.moveTo(-80, 40);
      ctx.lineTo(-120, 140);
      ctx.lineTo(120, 140);
      ctx.lineTo(80, 40);
      ctx.closePath();
    } else {
      // Default shape
      ctx.rect(-80, -60, 160, 140);
    }

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }, [garmentType, zoom, position]);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 10, 200);
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 10, 50);
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  };

  const handleReset = () => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
    onZoomChange?.(100);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch gesture handlers
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; dist?: number } | null>(null);

  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setTouchStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      // Store baseline zoom level for pinch gesture
      setTouchStart({
        x: zoom, // Store current zoom as baseline
        y: 0,
        dist: getTouchDistance(e.touches),
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && touchStart && !touchStart.dist) {
      // Single finger drag
      setPosition({
        x: e.touches[0].clientX - touchStart.x,
        y: e.touches[0].clientY - touchStart.y,
      });
    } else if (e.touches.length === 2 && touchStart?.dist) {
      // Pinch to zoom - calculate delta from baseline
      const newDist = getTouchDistance(e.touches);
      const scaleDelta = newDist / touchStart.dist;
      const baseZoom = touchStart.x || zoom; // Use stored base zoom
      const newZoom = Math.max(50, Math.min(200, baseZoom * scaleDelta));
      
      setZoom(newZoom);
      onZoomChange?.(newZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStart(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-muted/30"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        data-testid="canvas-workspace"
        className={`w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"} touch-none`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Badge variant="outline" className="bg-background/95 backdrop-blur-sm">
          <Move className="w-3 h-3 mr-1" />
          {zoom}%
        </Badge>
        <div className="flex flex-col gap-2">
          <Button
            size="icon"
            variant="outline"
            data-testid="button-zoom-in"
            onClick={handleZoomIn}
            className="bg-background/95 backdrop-blur-sm"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            data-testid="button-zoom-out"
            onClick={handleZoomOut}
            className="bg-background/95 backdrop-blur-sm"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            data-testid="button-reset-view"
            onClick={handleReset}
            className="bg-background/95 backdrop-blur-sm"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground">
        Drag to move • Pinch to zoom
      </div>
    </div>
  );
}
