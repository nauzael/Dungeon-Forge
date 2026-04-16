# Image Optimization Design - DM Panel

## Problem Statement

Las imágenes de mapas y recursos tardan demasiado en cargar en dispositivos móviles, especialmente cuando el DM las comparte en tiempo real. El origen es que se suben sin compresión ni optimización.

## Solution Overview

Implementar **compresión client-side + thumbnails** usando `browser-image-compression`. Las imágenes se optimizan antes de subirse, reduciendo 5-10MB a ~500KB-1MB con thumbnail instantáneo.

## Architecture

```
DM CLIENT:
[File Input] → [Compress] → [Thumbnail] → [Upload]
                1920px         200px        Both
                max 1MB       base64       to
                                         Supabase

SUPABASE STORAGE:
  atlas/{id}_full.webp    →  Original comprimido
  atlas/{id}_thumb.webp   →  Thumbnail
  (o base64 en tabla)     →  Para previews

PLAYER CLIENT:
  [Thumbnail] → Carga instantánea
  [Tap full]  → Descarga alta resolución bajo demanda
```

## Data Model Changes

**types.ts** - Agregar `thumbnail_url`:
```typescript
interface CampaignResource {
  id: string;
  party_id: string;
  title: string;
  url: string;           // Full resolution
  thumbnail_url: string; // NUEVO: Thumbnail o base64
  type: 'Map' | 'Setting' | 'NPC' | 'Item';
  description?: string;
  is_persistent: boolean;
  created_at: string;
}
```

## New Utility: Image Optimization

**utils/imageOptimizer.ts** - Nueva utilidad:
- `compressImage(file, options)` - Comprime a WebP/JPEG
- `generateThumbnail(file)` - Genera base64 200px
- `processResourceImage(file)` - Procesa ambos y devuelve `{ full, thumbnail }`

## Supabase Changes

**utils/supabase.ts** - Modificar `uploadResourceImage`:
```typescript
export const uploadResourceImage = async (file: File) => {
  // 1. Comprimir imagen original
  const compressed = await compressImage(file);
  
  // 2. Generar thumbnail base64
  const thumbnail = await generateThumbnail(file);
  
  // 3. Subir ambos
  const fullUrl = await uploadToStorage(compressed, 'full');
  
  // 4. Guardar thumbnail (en tabla, no storage)
  return { fullUrl, thumbnailUrl: thumbnail };
};
```

**Migración automática:** Cuando `CampaignResources` monta, busca recursos sin `thumbnail_url` y los procesa en background.

## UI Changes

**CampaignResources.tsx:**
1. Preview de upload muestra thumbnail instantáneo
2. Grid muestra thumbnail (no full) para carga rápida
3. Botón "Ver HD" para cargar resolución completa bajo demanda
4. Badge "Optimizing..." en recursos en migración
5. Fallback: si no hay thumbnail, usa imagen full

## Migration Flow

```
CampaignResources mounts
        ↓
Check: resources.some(r => !r.thumbnail_url)
        ↓
For each unoptimized resource:
  ├─ Fetch image via URL
  ├─ Compress + generate thumbnail
  ├─ Upload thumbnail to storage
  ├─ Update resource record in DB
  └─ Update local state
        ↓
Show: "Optimizing X images..." (silent, background)
```

## Dependencies

- `browser-image-compression` - Compresión client-side

## Testing Strategy

1. **Subir imagen grande (5MB+)** → Verificar compresión a ~500KB-1MB
2. **Grid de recursos** → Thumbnails cargan instantáneamente
3. **Tap "Ver HD"** → Full resolution carga bajo demanda
4. **Recursos antiguos sin thumbnail** → Migración automática funciona
5. **Offline** → Thumbnail disponible en caché (si existe)
