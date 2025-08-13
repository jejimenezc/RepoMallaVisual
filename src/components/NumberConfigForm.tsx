// src/components/NumberConfigForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { BlockTemplateCell } from '../types/curricular';
import '../styles/NumberConfigForm.css';

interface Props {
  cell: BlockTemplateCell;
  coord: { row: number; col: number };
  onUpdate: (updated: Partial<BlockTemplateCell>) => void;
}

export const NumberConfigForm: React.FC<Props> = ({ cell, coord, onUpdate }) => {
  const [label, setLabel] = useState(cell.label ?? '');
  const [placeholder, setPlaceholder] = useState(cell.placeholder ?? '');
  const [decimalDigits, setDecimalDigits] = useState(cell.decimalDigits ?? 0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLabel(cell.label ?? '');
    setPlaceholder(cell.placeholder ?? '');
    setDecimalDigits(cell.decimalDigits ?? 0);
  }, [coord]);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [coord]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    onUpdate({ label: newLabel });
  };

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPlaceholder(newValue);
    onUpdate({ placeholder: newValue });
  };

  const handleDecimalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(e.target.value));
    setDecimalDigits(value);
    onUpdate({ decimalDigits: value });
  };

  return (
    <div className="control-config-form number-config-form">
      <h4>Configuración de número</h4>
      <label>
        Etiqueta:
        <input
          ref={inputRef}
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
          value={placeholder}
          onChange={handlePlaceholderChange}
          placeholder="Ej: 0"
        />
      </label>

      <label>
        Dígitos decimales:
        <input
          type="number"
          min={0}
          value={decimalDigits}
          onChange={handleDecimalsChange}
        />
      </label>
    </div>
  );
};