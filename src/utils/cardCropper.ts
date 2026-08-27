import { BoundingBox } from '../types';

/**
 * Crops a specific region from an image based on normalized 0-1000 bounding box coordinates.
 */
export async function cropCardFromImage(
  imageSource: string | HTMLImageElement,
  box: BoundingBox,
  paddingPercent: number = 0.02
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = typeof imageSource === 'string' ? new Image() : imageSource;

    const process = () => {
      try {
        const naturalWidth = img.naturalWidth || img.width;
        const naturalHeight = img.naturalHeight || img.height;

        if (!naturalWidth || !naturalHeight) {
          // If image dimensions are missing, return original
          resolve(typeof imageSource === 'string' ? imageSource : img.src);
          return;
        }

        // Convert normalized 0-1000 to pixel coordinates
        const xmin = (box.xmin / 1000) * naturalWidth;
        const ymin = (box.ymin / 1000) * naturalHeight;
        const xmax = (box.xmax / 1000) * naturalWidth;
        const ymax = (box.ymax / 1000) * naturalHeight;

        let width = xmax - xmin;
        let height = ymax - ymin;

        // Apply slight padding for safe bounds
        const padX = width * paddingPercent;
        const padY = height * paddingPercent;

        const cropX = Math.max(0, xmin - padX);
        const cropY = Math.max(0, ymin - padY);
        const cropW = Math.min(naturalWidth - cropX, width + padX * 2);
        const cropH = Math.min(naturalHeight - cropY, height + padY * 2);

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(100, Math.round(cropW));
        canvas.height = Math.max(60, Math.round(cropH));
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(typeof imageSource === 'string' ? imageSource : img.src);
          return;
        }

        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropW,
          cropH,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        resolve(croppedDataUrl);
      } catch (err) {
        console.error('Error cropping card:', err);
        resolve(typeof imageSource === 'string' ? imageSource : img.src);
      }
    };

    if (typeof imageSource === 'string') {
      img.crossOrigin = 'anonymous';
      img.onload = process;
      img.onerror = () => resolve(imageSource);
      img.src = imageSource;
    } else {
      if (img.complete && img.naturalWidth > 0) {
        process();
      } else {
        img.onload = process;
        img.onerror = () => resolve(img.src);
      }
    }
  });
}
