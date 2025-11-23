import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { GarmentDesign, ColorPalette, Texture, UserPreferences } from '@shared/schema';

interface FashionDB extends DBSchema {
  designs: {
    key: string;
    value: GarmentDesign;
    indexes: { 'by-updated': number; 'by-type': string };
  };
  palettes: {
    key: string;
    value: ColorPalette;
    indexes: { 'by-created': number };
  };
  textures: {
    key: string;
    value: Texture;
    indexes: { 'by-type': string };
  };
  preferences: {
    key: string;
    value: UserPreferences;
  };
}

const DB_NAME = 'fashion-designer-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<FashionDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<FashionDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<FashionDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Designs store
      if (!db.objectStoreNames.contains('designs')) {
        const designStore = db.createObjectStore('designs', { keyPath: 'id' });
        designStore.createIndex('by-updated', 'updatedAt');
        designStore.createIndex('by-type', 'garmentType');
      }

      // Palettes store
      if (!db.objectStoreNames.contains('palettes')) {
        const paletteStore = db.createObjectStore('palettes', { keyPath: 'id' });
        paletteStore.createIndex('by-created', 'createdAt');
      }

      // Textures store
      if (!db.objectStoreNames.contains('textures')) {
        const textureStore = db.createObjectStore('textures', { keyPath: 'id' });
        textureStore.createIndex('by-type', 'type');
      }

      // Preferences store
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

// Design operations
export async function saveDesign(design: GarmentDesign): Promise<void> {
  const db = await getDB();
  await db.put('designs', design);
}

export async function getDesign(id: string): Promise<GarmentDesign | undefined> {
  const db = await getDB();
  return await db.get('designs', id);
}

export async function getAllDesigns(): Promise<GarmentDesign[]> {
  const db = await getDB();
  return await db.getAllFromIndex('designs', 'by-updated');
}

export async function deleteDesign(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('designs', id);
}

// Palette operations
export async function savePalette(palette: ColorPalette): Promise<void> {
  const db = await getDB();
  await db.put('palettes', palette);
}

export async function getPalette(id: string): Promise<ColorPalette | undefined> {
  const db = await getDB();
  return await db.get('palettes', id);
}

export async function getAllPalettes(): Promise<ColorPalette[]> {
  const db = await getDB();
  return await db.getAllFromIndex('palettes', 'by-created');
}

export async function deletePalette(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('palettes', id);
}

// Texture operations
export async function saveTexture(texture: Texture): Promise<void> {
  const db = await getDB();
  await db.put('textures', texture);
}

export async function getTexture(id: string): Promise<Texture | undefined> {
  const db = await getDB();
  return await db.get('textures', id);
}

export async function getAllTextures(): Promise<Texture[]> {
  const db = await getDB();
  return await db.getAll('textures');
}

export async function deleteTexture(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('textures', id);
}

// Preferences operations
export async function savePreferences(preferences: UserPreferences): Promise<void> {
  const db = await getDB();
  await db.put('preferences', { id: 'user-prefs', ...preferences } as any);
}

export async function getPreferences(): Promise<UserPreferences | undefined> {
  const db = await getDB();
  const data = await db.get('preferences', 'user-prefs');
  if (!data) return undefined;
  const { id, ...preferences } = data as any;
  return preferences as UserPreferences;
}

// Utility: Clear all data
export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['designs', 'palettes', 'textures', 'preferences'], 'readwrite');
  await Promise.all([
    tx.objectStore('designs').clear(),
    tx.objectStore('palettes').clear(),
    tx.objectStore('textures').clear(),
    tx.objectStore('preferences').clear(),
  ]);
  await tx.done;
}
