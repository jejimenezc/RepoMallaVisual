// src/utils/palette.ts

export const generatePalette = (count: number): string[] => {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, i) => {
    const hue = Math.round((360 / count) * i);
    return `hsl(${hue}, 70%, 60%)`;
  });
};

export default generatePalette;