// src/types/curricular.ts

export type InputType =
  | 'staticText'
  | 'text'
  | 'checkbox'
  | 'select'
  | 'number'
  | 'calculated';
  
export interface CellStyle {
  alignment?: 'left' | 'center' | 'right';
  bold?: boolean;
  italic?: boolean;
  bgColor?: string;
  textColor?: string;
}

export interface BlockTemplateCell {
  active: boolean;
  type?: InputType;
  label?: string;
  dropdownOptions?: string[];  // Solo para 'select'
  mergedWith?: string;         // Referencia a la celda base: 'row-col'
  placeholder?: string;       // ✅ agregado para text
  decimalDigits?: number;     // Solo para 'number'
  style?: CellStyle; // ✅ agregado para preview
  // Estilos visuales (solo afectan presentación)
  visualStyle?: {
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    border?: boolean;
    fontSize?: 'small' | 'normal' | 'large';
  };
}

export type BlockTemplate = BlockTemplateCell[][];


