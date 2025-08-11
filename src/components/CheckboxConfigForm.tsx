// src/components/CheckboxConfigForm.tsx

import React from 'react';
import { BlockTemplateCell } from '../types/curricular';
import '../styles/CheckboxConfigForm.css';

export interface CheckboxConfigFormProps {
  cell: BlockTemplateCell;
  onUpdate: (updated: Partial<BlockTemplateCell>) => void;
}

export const CheckboxConfigForm: React.FC<CheckboxConfigFormProps> = ({ cell, onUpdate }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ label: e.target.value });
  };

  return (
    <div className="control-config-form checkbox-config-form">
      <label>
        Etiqueta del checkbox:
        <input
          type="text"
          value={cell.label || ''}
          onChange={handleChange}
          placeholder="Ej: ¿Curso aprobado?"
        />
      </label>
    </div>
  );
};
