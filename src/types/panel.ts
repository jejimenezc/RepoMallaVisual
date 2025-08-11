// src/types/panel.ts
import type { BlockTemplateCell } from './curricular';

/**
 * Estado publicado por el editor para poblar el ContextSidebarPanel.
 */
export interface EditorSidebarState {
  selectedCount: number;
  canCombine: boolean;
  canSeparate: boolean;
  selectedCell: BlockTemplateCell | null;
  selectedCoord?: { row: number; col: number };

  /** Mensaje explicativo cuando no se puede combinar (ej: ≥2 celdas configuradas) */
  combineDisabledReason?: string;

  handlers: {
    onCombine: () => void;
    onSeparate: () => void;
    onUpdateCell: (partialUpdate: Partial<BlockTemplateCell>, coord: { row: number; col: number }) => void;
  };
}
