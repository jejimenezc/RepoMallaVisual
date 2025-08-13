// src/components/forms/TextConfigForm.tsx

import React, { useState, useEffect, useRef } from 'react';
import { BlockTemplateCell } from '../types/curricular';
import '../styles/TextConfigForm.css';


interface Props {
  cell: BlockTemplateCell;
  onUpdate: (updated: Partial<BlockTemplateCell>) => void;
}

export const TextConfigForm: React.FC<Props> = ({ cell, onUpdate }) => {
  const [label, setLabel] = useState(cell.label ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLabel(cell.label ?? '');
  }, [cell.label]);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [cell]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    onUpdate({ label: newLabel });
  };

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ placeholder: e.target.value });
  };

  return (
    <div className="control-config-form">
      <h4>Configuración de texto libre</h4>

      <label>
        Etiqueta:
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={handleLabelChange}
          placeholder="Ej: Nombre del campo"
        />
      </label>

      <label>
        Placeholder (texto de ayuda):
        <input
          type="text"
          value={cell.placeholder || ''}
          onChange={handlePlaceholderChange}
          placeholder="Ej: Ingrese nombre completo"
        />
      </label>
    </div>
  );
};
