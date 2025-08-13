// src/components/CheckboxConfigForm.tsx

import React, { useEffect, useRef } from 'react';
import { BlockTemplateCell } from '../types/curricular';
import '../styles/CheckboxConfigForm.css';

export interface CheckboxConfigFormProps {
  cell: BlockTemplateCell;
  onUpdate: (updated: Partial<BlockTemplateCell>) => void;
}

export const CheckboxConfigForm: React.FC<CheckboxConfigFormProps> = ({ cell, onUpdate }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [cell]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ label: e.target.value });
  };

  return (
    <div className="control-config-form checkbox-config-form">
      <label>
        Etiqueta del checkbox:
        <input
          ref={inputRef}
          type="text"
          value={cell.label || ''}
          onChange={handleChange}
          placeholder="Ej: ¿Curso aprobado?"
        />
      </label>
    </div>
  );
};
