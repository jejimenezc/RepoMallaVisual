// src/types/visual.ts

export type VisualFontSize = 'small' | 'normal' | 'large';

export interface VisualStyle {
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  border?: boolean;

  /** Compatibilidad con versiones anteriores */
  fontSize?: VisualFontSize;

  /** Tamaño de fuente granular (px). Si está, tiene prioridad sobre 'fontSize'. */
  fontSizePx?: number;

  /** Relleno interno horizontal (px) aplicado al contenido de la celda en modo vista */
  paddingX?: number;

  /** Relleno interno vertical (px) aplicado al contenido de la celda en modo vista */
  paddingY?: number;
}

/** Clave = "row-col" del base (o la propia si no hay merge) */
export type VisualTemplate = Record<string, VisualStyle | undefined>;

/** Utilidad: coord -> "r-c" */
export const coordKey = (row: number, col: number) => `${row}-${col}`;
