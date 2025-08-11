// src/types/forms.ts

/**
 * Configuraciones específicas para el control de tipo "texto libre"
 */
export interface TextControlConfig {
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}

/**
 * Configuraciones específicas para el control de tipo "checkbox"
 */
export interface CheckboxControlConfig {
  label?: string;
  checkedByDefault?: boolean;
  required?: boolean;
}

/**
 * Configuraciones específicas para el control de tipo "select" (lista desplegable)
 */
export interface SelectControlConfig {
  options: string[];
  defaultOption?: string;
  required?: boolean;
}

/**
 * Configuración común para el formulario actual de control en edición
 */
export type ControlType = 'text' | 'checkbox' | 'select';

export type ControlConfig =
  | { type: 'text'; config: TextControlConfig }
  | { type: 'checkbox'; config: CheckboxControlConfig }
  | { type: 'select'; config: SelectControlConfig };

/**
 * Props genéricos para formularios de configuración de controles
 */
export interface ControlFormProps<T> {
  value: T;
  onChange: (newValue: T) => void;
}
