// src/components/forms/TextConfigForm.tsx

import React, { useState } from 'react';
import { BlockTemplateCell } from '../types/curricular';
import '../styles/TextConfigForm.css';


interface Props {
  cell: BlockTemplateCell;
  onUpdate: (updated: Partial<BlockTemplateCell>) => void;
}

export const TextConfigForm: React.FC<Props> = ({ cell, onUpdate }) => {
  const [placeholder, setPlaceholder] = useState(cell.placeholder || '');

 // const handleSave = () => {
 //   onUpdate({ placeholder });
 // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ label: e.target.value });
  };

  return (
    <div className="control-config-form">
      <h4>Configuración de texto libre</h4>
      <label>
        Placeholder (texto de ayuda):
        <input
          type="text"
          value={cell.label || ''}
          onChange={handleChange}
          placeholder="Ej: Ingrese nombre completo"
        />
      </label>
    </div>
  );
};
