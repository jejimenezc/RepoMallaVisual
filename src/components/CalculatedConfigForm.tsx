// src/components/CalculatedConfigForm.tsx
import React, { useEffect, useRef, useState } from 'react';
import { BlockTemplateCell, BlockTemplate } from '../types/curricular';
import '../styles/CalculatedConfigForm.css';

interface Props {
  cell: BlockTemplateCell;
  template: BlockTemplate;
  coord: { row: number; col: number };
  onUpdate: (updated: Partial<BlockTemplateCell>) => void;
}

export const CalculatedConfigForm: React.FC<Props> = ({ cell, template, coord, onUpdate }) => {
  const numberCount = template.flat().filter((c) => c.type === 'number').length;
  const inputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState(cell.label ?? '');

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [coord]);

  useEffect(() => {
    setLabel(cell.label ?? '');
  }, [coord]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    onUpdate({ label: newLabel });
  };

  return (
    <div className="control-config-form calculated-config-form">
      <h4>Configuración de campo calculado</h4>
      <label>
        Etiqueta:
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={handleLabelChange}
          placeholder="Ej: Total"
        />
      </label>
      <p className="hint">Se detectan {numberCount} campos number en el bloque</p>
    </div>
  );
};