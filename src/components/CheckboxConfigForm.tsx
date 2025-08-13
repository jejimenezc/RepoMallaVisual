// src/components/CheckboxConfigForm.tsx

import React, { useEffect, useRef, useState } from 'react';
import { BlockTemplateCell } from '../types/curricular';
import '../styles/CheckboxConfigForm.css';

export interface CheckboxConfigFormProps {
  cell: BlockTemplateCell;
  onUpdate: (updated: Partial<BlockTemplateCell>) => void;
}

export const CheckboxConfigForm: React.FC<CheckboxConfigFormProps> = ({ cell, onUpdate }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState(cell.label ?? '');

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [cell]);

    useEffect(() => {
    setLabel(cell.label ?? '');
  }, [cell.label]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    onUpdate({ label: newLabel });
  };

  return (
    <div className="control-config-form checkbox-config-form">
      <label>
        Etiqueta del checkbox:
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={handleChange}
          placeholder="Ej: ¿Curso aprobado?"
        />
      </label>
    </div>
  );
};
