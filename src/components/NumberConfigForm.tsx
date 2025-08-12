// src/components/NumberConfigForm.tsx
import React, { useState, useEffect } from 'react';
import { BlockTemplateCell } from '../types/curricular';
import '../styles/NumberConfigForm.css';

interface Props {
  cell: BlockTemplateCell;
  onUpdate: (updated: Partial<BlockTemplateCell>) => void;
}

export const NumberConfigForm: React.FC<Props> = ({ cell, onUpdate }) => {
  const [label, setLabel] = useState(cell.label ?? '');

  useEffect(() => {
    setLabel(cell.label ?? '');
  }, [cell.label]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    onUpdate({ label: newLabel });
  };

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ placeholder: e.target.value });
  };

  const handleDecimalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(e.target.value));
    onUpdate({ decimalDigits: value });
  };

  return (
    <div className="control-config-form number-config-form">
      <h4>Configuración de número</h4>
      <label>
        Etiqueta:
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          placeholder="Ej: Cantidad"
        />
      </label>

      <label>
        Placeholder (texto de ayuda):
        <input
          type="text"
          value={cell.placeholder || ''}
          onChange={handlePlaceholderChange}
          placeholder="Ej: 0"
        />
      </label>

      <label>
        Dígitos decimales:
        <input
          type="number"
          min={0}
          value={cell.decimalDigits ?? 0}
          onChange={handleDecimalsChange}
        />
      </label>
    </div>
  );
};