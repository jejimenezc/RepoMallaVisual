// src/components/SelectConfigForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { BlockTemplateCell } from '../types/curricular';
import '../styles/SelectConfigForm.css';

interface SelectConfigFormProps {
  cell: BlockTemplateCell;
  coord: { row: number; col: number };
  onUpdate: (updated: Partial<BlockTemplateCell>, coord: { row: number; col: number }) => void;
}

export const SelectConfigForm: React.FC<SelectConfigFormProps> = ({ cell, coord, onUpdate }) => {
  const [label, setLabel] = useState(cell.label ?? '');
  const [rawOptions, setRawOptions] = useState(cell.dropdownOptions?.join(', ') ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLabel(cell.label ?? '');
    setRawOptions(cell.dropdownOptions?.join(', ') ?? '');
  }, [coord]);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [coord]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    onUpdate({ label: newLabel }, coord);
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRawOptions(value);
    const options = value
      .split(',')
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);
    onUpdate({ dropdownOptions: options }, coord);
  };

    return (
    <div className="control-config-form select-config-form">
      <label>
        Etiqueta:
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={handleLabelChange}
          placeholder="Ej: Tipo de asignatura"
        />
      </label>

      <label>
        Opciones (separadas por coma):
        <input
          type="text"
          value={rawOptions}
          onChange={handleOptionsChange}
          placeholder="Ej: Obligatoria, Electiva, Optativa"
        />
      </label>
    </div>
  );
};
