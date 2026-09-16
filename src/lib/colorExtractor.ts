/**
 * In-memory cache for extracted colors to avoid re-extracting for the same image
 */
const colorCache: Record<string, string> = {};

/**
 * Converts RGB numbers to Hex color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Converts Hex or CSS color string to { r, g, b }
 */
export function parseColor(color: string): { r: number; g: number; b: number } | null {
  if (!color) return null;
  const clean = color.trim().toLowerCase();

  // Named color fallbacks
  if (clean === 'white') return { r: 255, g: 255, b: 255 };
  if (clean === 'black') return { r: 0, g: 0, b: 0 };

  // Hex color
  if (clean.startsWith('#')) {
    let hex = clean.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    if (hex.length >= 6) {
      const num = parseInt(hex.slice(0, 6), 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
      };
    }
  }

  // rgb(r, g, b)
  const rgbMatch = clean.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  return null;
}

/**
 * Calculates standard relative luminance (0 = darkest, 1 = brightest)
 */
export function getLuminance(color: string): number {
  const rgb = parseColor(color);
  if (!rgb) return 1;
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

/**
 * Returns whether a color is considered dark (luminance < 0.55)
 */
export function isDarkColor(color: string): boolean {
  return getLuminance(color) < 0.55;
}

/**
 * Extracts the color that has the highest percentage (frequency) in the given image.
 * 1. Checks in-memory cache first
 * 2. If SVG, tries fetching and extracting background rect fill (100% exact & fast)
 * 3. Uses HTML5 Canvas to sample pixel data and group by quantized color bins
 */
export async function extractDominantColor(imageUrl?: string): Promise<string> {
  if (!imageUrl) return '#FFFFFF';

  if (colorCache[imageUrl]) {
    return colorCache[imageUrl];
  }

  // If client-side and SVG, check if we can read the main background rect
  if (typeof window !== 'undefined' && imageUrl.toLowerCase().includes('.svg')) {
    try {
      const res = await fetch(imageUrl);
      if (res.ok) {
        const svgText = await res.text();
        // Look for <rect ... fill="..."> that is not a url() pattern
        const rectMatches = svgText.matchAll(/<rect[^>]+fill=["']([^"']+)["'][^>]*>/gi);
        for (const match of rectMatches) {
          const fill = match[1];
          if (fill && !fill.startsWith('url(') && fill !== 'none') {
            const hex = fill.toLowerCase() === 'white' ? '#FFFFFF' : fill.startsWith('#') ? fill.toUpperCase() : fill;
            colorCache[imageUrl] = hex;
            return hex;
          }
        }
      }
    } catch {
      // Fallback to canvas sampling below
    }
  }

  // Canvas-based sampling for PNG, JPG, or SVG fallback
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve('#FFFFFF');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 64; // Downscale to 64x64 for optimal speed and noise reduction
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve('#FFFFFF');
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const imgData = ctx.getImageData(0, 0, size, size).data;

        // Group colors into quantized buckets (step of 16 to aggregate close shades)
        const step = 16;
        const colorBins: Record<string, { count: number; sumR: number; sumG: number; sumB: number }> = {};
        let maxCount = 0;
        let winningBin: { count: number; sumR: number; sumG: number; sumB: number } | null = null;

        for (let i = 0; i < imgData.length; i += 4) {
          const a = imgData[i + 3];
          if (a < 128) continue; // Skip transparent or semi-transparent

          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];

          // Quantize
          const qR = Math.min(255, Math.floor(r / step) * step);
          const qG = Math.min(255, Math.floor(g / step) * step);
          const qB = Math.min(255, Math.floor(b / step) * step);

          const key = `${qR},${qG},${qB}`;
          if (!colorBins[key]) {
            colorBins[key] = { count: 0, sumR: 0, sumG: 0, sumB: 0 };
          }
          const bin = colorBins[key];
          bin.count++;
          bin.sumR += r;
          bin.sumG += g;
          bin.sumB += b;

          if (bin.count > maxCount) {
            maxCount = bin.count;
            winningBin = bin;
          }
        }

        let dominant = '#FFFFFF';
        if (winningBin && winningBin.count > 0) {
          const avgR = Math.round(winningBin.sumR / winningBin.count);
          const avgG = Math.round(winningBin.sumG / winningBin.count);
          const avgB = Math.round(winningBin.sumB / winningBin.count);
          dominant = rgbToHex(avgR, avgG, avgB);
        }

        colorCache[imageUrl] = dominant;
        resolve(dominant);
      } catch {
        resolve('#FFFFFF');
      }
    };

    img.onerror = () => {
      resolve('#FFFFFF');
    };

    img.src = imageUrl;
  });
}
