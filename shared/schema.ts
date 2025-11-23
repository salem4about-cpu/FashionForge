import { z } from "zod";

// Garment type definitions
export const garmentTypes = [
  "t-shirt",
  "hoodie",
  "dress",
  "skirt",
  "trousers",
  "shirt",
  "jacket"
] as const;

export type GarmentType = typeof garmentTypes[number];

// Measurement units
export const measurementUnits = ["metric", "imperial"] as const;
export type MeasurementUnit = typeof measurementUnits[number];

// Size options
export const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = typeof sizes[number];

// Style options
export const necklineTypes = ["crew", "v-neck", "boat", "scoop", "square"] as const;
export const sleeveTypes = ["sleeveless", "short", "three-quarter", "long", "raglan"] as const;
export const hemTypes = ["straight", "curved", "high-low", "asymmetric"] as const;
export const fitTypes = ["slim", "regular", "relaxed", "oversized"] as const;
export const skirtCuts = ["a-line", "pencil", "pleated", "circle", "wrap"] as const;
export const trouserCuts = ["straight", "tapered", "wide-leg", "bootcut", "skinny"] as const;

// Texture types
export const textureTypes = ["denim", "cotton", "silk", "satin", "knit", "linen", "velvet", "custom"] as const;
export type TextureType = typeof textureTypes[number];

// Measurements schema
export const measurementsSchema = z.object({
  chest: z.number().min(0),
  waist: z.number().min(0),
  hips: z.number().min(0),
  shoulder: z.number().min(0),
  sleeveLength: z.number().min(0),
  inseam: z.number().min(0),
  totalLength: z.number().min(0),
  unit: z.enum(measurementUnits),
});

export type Measurements = z.infer<typeof measurementsSchema>;

// Size grading schema
export const sizeGradingSchema = z.object({
  baseSize: z.enum(sizes),
  increment: z.number().min(-10).max(10), // cm or inches
  sizes: z.record(z.enum(sizes), measurementsSchema),
});

export type SizeGrading = z.infer<typeof sizeGradingSchema>;

// Style configuration schema
export const styleConfigSchema = z.object({
  neckline: z.enum(necklineTypes).optional(),
  sleeves: z.enum(sleeveTypes).optional(),
  hem: z.enum(hemTypes).optional(),
  fit: z.enum(fitTypes),
  skirtCut: z.enum(skirtCuts).optional(),
  trouserCut: z.enum(trouserCuts).optional(),
  // Toggleable details
  hasSeams: z.boolean().default(true),
  hasDarts: z.boolean().default(false),
  hasPleats: z.boolean().default(false),
  hasPockets: z.boolean().default(true),
  hasCollar: z.boolean().default(false),
  hasCuffs: z.boolean().default(false),
  // Parameters
  dartDepth: z.number().min(0).max(10).default(2),
  pleatWidth: z.number().min(0).max(10).default(3),
  pocketSize: z.number().min(0).max(20).default(12),
});

export type StyleConfig = z.infer<typeof styleConfigSchema>;

// Color palette schema
export const colorPaletteSchema = z.object({
  id: z.string(),
  name: z.string(),
  colors: z.array(z.string()).min(1).max(10),
  createdAt: z.number(),
});

export type ColorPalette = z.infer<typeof colorPaletteSchema>;

export const insertColorPaletteSchema = colorPaletteSchema.omit({ id: true, createdAt: true });
export type InsertColorPalette = z.infer<typeof insertColorPaletteSchema>;

// Texture schema
export const textureSchema = z.object({
  id: z.string(),
  type: z.enum(textureTypes),
  name: z.string(),
  imageUrl: z.string().optional(), // For custom uploaded textures
  scale: z.number().min(0.1).max(5).default(1),
  rotation: z.number().min(0).max(360).default(0),
  opacity: z.number().min(0).max(1).default(1),
  tiling: z.boolean().default(true),
});

export type Texture = z.infer<typeof textureSchema>;

export const insertTextureSchema = textureSchema.omit({ id: true });
export type InsertTexture = z.infer<typeof insertTextureSchema>;

// Garment design schema (main design object)
export const garmentDesignSchema = z.object({
  id: z.string(),
  name: z.string(),
  garmentType: z.enum(garmentTypes),
  measurements: measurementsSchema,
  sizeGrading: sizeGradingSchema.optional(),
  style: styleConfigSchema,
  primaryColor: z.string(),
  secondaryColor: z.string().optional(),
  texture: textureSchema.optional(),
  canvasData: z.any().optional(), // For storing canvas state
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type GarmentDesign = z.infer<typeof garmentDesignSchema>;

export const insertGarmentDesignSchema = garmentDesignSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type InsertGarmentDesign = z.infer<typeof insertGarmentDesignSchema>;

// User preferences schema (for app settings)
export const userPreferencesSchema = z.object({
  defaultUnit: z.enum(measurementUnits).default("metric"),
  completedOnboarding: z.boolean().default(false),
  lastOpenedDesignId: z.string().optional(),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

// Default measurements for different sizes (metric - cm)
export const defaultMeasurements: Record<Size, Omit<Measurements, 'unit'>> = {
  XS: { chest: 86, waist: 66, hips: 91, shoulder: 38, sleeveLength: 58, inseam: 76, totalLength: 63 },
  S: { chest: 91, waist: 71, hips: 96, shoulder: 40, sleeveLength: 60, inseam: 78, totalLength: 66 },
  M: { chest: 96, waist: 76, hips: 101, shoulder: 42, sleeveLength: 62, inseam: 80, totalLength: 69 },
  L: { chest: 101, waist: 81, hips: 106, shoulder: 44, sleeveLength: 64, inseam: 82, totalLength: 72 },
  XL: { chest: 106, waist: 86, hips: 111, shoulder: 46, sleeveLength: 66, inseam: 84, totalLength: 75 },
  XXL: { chest: 111, waist: 91, hips: 116, shoulder: 48, sleeveLength: 68, inseam: 86, totalLength: 78 },
};
