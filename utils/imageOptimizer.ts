
import imageCompression from 'browser-image-compression';

/**
 * Compresses an image to max 1MB, reducing dimensions if necessary.
 * Converts to WebP for better compression.
 */
export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp' as const,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    // If compression fails, return the original file
    return file;
  }
};

/**
 * Genera un thumbnail en base64 de 200px de ancho.
 * Usa canvas para redimensionar.
 */
export const generateThumbnail = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(''); // Fallback si no se puede crear el contexto
        return;
      }

      // Calcular dimensiones manteniendo aspect ratio
      const maxWidth = 200;
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convertir a base64 (data URL)
      const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      resolve(thumbnailDataUrl);
    };

    img.onerror = () => {
      resolve(''); // Fallback
    };

    reader.onerror = () => {
      resolve(''); // Fallback
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Procesa una imagen: la comprime y genera thumbnail.
 * Devuelve ambas versiones.
 */
export const processResourceImage = async (file: File): Promise<{
  compressedFile: File;
  thumbnailDataUrl: string;
}> => {
  const [compressedFile, thumbnailDataUrl] = await Promise.all([
    compressImage(file),
    generateThumbnail(file),
  ]);

  return {
    compressedFile,
    thumbnailDataUrl,
  };
};

/**
 * Optimizes an existing image from a URL (for migration).
 * Descarga la imagen, la comprime y genera thumbnail.
 */
export const optimizeExistingImage = async (imageUrl: string): Promise<{
  compressedFile: File | null;
  thumbnailDataUrl: string;
} | null> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    return await processResourceImage(file);
  } catch (error) {
    return null;
  }
};
