import { BlockTemplate } from '../types/curricular';
import { VisualTemplate } from '../types/visual';

export interface ActiveBounds {
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
  rows: number;
  cols: number;
}

export const getActiveBounds = (template: BlockTemplate): ActiveBounds => {
  let minRow = template.length;
  let minCol = template[0]?.length ?? 0;
  let maxRow = -1;
  let maxCol = -1;
  template.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell.active) {
        if (r < minRow) minRow = r;
        if (r > maxRow) maxRow = r;
        if (c < minCol) minCol = c;
        if (c > maxCol) maxCol = c;
      }
    })
  );

  if (maxRow < minRow || maxCol < minCol) {
    return { minRow: 0, maxRow: 0, minCol: 0, maxCol: 0, rows: 0, cols: 0 };
  }

  return {
    minRow,
    maxRow,
    minCol,
    maxCol,
    rows: maxRow - minRow + 1,
    cols: maxCol - minCol + 1,
  };
};

export const cropTemplate = (
  template: BlockTemplate,
  b: ActiveBounds
): BlockTemplate => {
  return Array.from({ length: b.rows }, (_, r) =>
    Array.from({ length: b.cols }, (_, c) => template[b.minRow + r][b.minCol + c])
  );
};

export const cropVisualTemplate = (
  visual: VisualTemplate,
  b: ActiveBounds
): VisualTemplate => {
  const result: VisualTemplate = {};
  for (let r = b.minRow; r <= b.maxRow; r++) {
    for (let c = b.minCol; c <= b.maxCol; c++) {
      const key = `${r}-${c}`;
      const style = visual[key];
      if (style) {
        const newKey = `${r - b.minRow}-${c - b.minCol}`;
        result[newKey] = style;
      }
    }
  }
  return result;
};