export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
}

export function detectSkinTone(rgb: RGB): 'fair' | 'wheatish' | 'dark' {
  const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;

  if (luminance > 180) return 'fair';
  if (luminance > 130) return 'wheatish';
  return 'dark';
}

export function detectUndertone(rgb: RGB): 'warm' | 'cool' | 'neutral' {
  const hsl = rgbToHsl(rgb);

  const rMinusB = rgb.r - rgb.b;
  const gMinusB = rgb.g - rgb.b;

  if (rMinusB > 15 && gMinusB > 10) {
    return 'warm';
  } else if (rgb.b > rgb.r + 5) {
    return 'cool';
  } else {
    return 'neutral';
  }
}

export function kMeansClustering(pixels: RGB[], k: number = 3, maxIterations: number = 20): RGB[] {
  if (pixels.length === 0) return [];

  let centroids: RGB[] = [];
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * pixels.length);
    centroids.push({ ...pixels[randomIndex] });
  }

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const clusters: RGB[][] = Array.from({ length: k }, () => []);

    for (const pixel of pixels) {
      let minDistance = Infinity;
      let closestCentroid = 0;

      for (let i = 0; i < k; i++) {
        const distance = Math.sqrt(
          Math.pow(pixel.r - centroids[i].r, 2) +
          Math.pow(pixel.g - centroids[i].g, 2) +
          Math.pow(pixel.b - centroids[i].b, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = i;
        }
      }

      clusters[closestCentroid].push(pixel);
    }

    const newCentroids: RGB[] = [];
    for (let i = 0; i < k; i++) {
      if (clusters[i].length > 0) {
        const avgR = clusters[i].reduce((sum, p) => sum + p.r, 0) / clusters[i].length;
        const avgG = clusters[i].reduce((sum, p) => sum + p.g, 0) / clusters[i].length;
        const avgB = clusters[i].reduce((sum, p) => sum + p.b, 0) / clusters[i].length;
        newCentroids.push({ r: Math.round(avgR), g: Math.round(avgG), b: Math.round(avgB) });
      } else {
        newCentroids.push(centroids[i]);
      }
    }

    centroids = newCentroids;
  }

  return centroids;
}

export function getDominantColor(pixels: RGB[]): RGB {
  if (pixels.length === 0) return { r: 0, g: 0, b: 0 };

  const clusters = kMeansClustering(pixels, 5);

  clusters.sort((a, b) => {
    const lumA = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
    const lumB = 0.299 * b.r + 0.587 * b.g + 0.114 * b.b;
    return lumB - lumA;
  });

  return clusters[1] || clusters[0];
}

export function extractPixelsFromRegion(
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  height: number
): RGB[] {
  const pixels: RGB[] = [];
  const startX = Math.max(0, Math.floor(x));
  const startY = Math.max(0, Math.floor(y));
  const endX = Math.min(imageData.width, Math.floor(x + width));
  const endY = Math.min(imageData.height, Math.floor(y + height));

  for (let py = startY; py < endY; py += 2) {
    for (let px = startX; px < endX; px += 2) {
      const index = (py * imageData.width + px) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];

      if (r > 20 && g > 20 && b > 20 && r < 250 && g < 250 && b < 250) {
        pixels.push({ r, g, b });
      }
    }
  }

  return pixels;
}
