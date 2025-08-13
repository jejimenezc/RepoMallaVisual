// src/components/CalculatedConfigForm.tsx
import React, { useEffect, useRef } from 'react';
import { BlockTemplateCell, BlockTemplate } from '../types/curricular';
import '../styles/CalculatedConfigForm.css';

interface Props {
  cell: BlockTemplateCell;
  template: BlockTemplate;
  onUpdate: (updated: Partial<BlockTemplateCell>) => void;
}

export const CalculatedConfigForm: React.FC<Props> = ({ cell, template, onUpdate }) => {
  const numberCount = template.flat().filter((c) => c.type === 'number').length;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [cell]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ label: e.target.value });
  };

  return (
    <div className="control-config-form calculated-config-form">
      <h4>Configuración de campo calculado</h4>
      <label>
        Etiqueta:
        <input
          ref={inputRef}
          type="text"
          value={cell.label || ''}
          onChange={handleLabelChange}
          placeholder="Ej: Total"
        />
      </label>
      <p className="hint">Se detectan {numberCount} campos number en el bloque</p>
    </div>
  );
};