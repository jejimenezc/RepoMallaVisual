// src/components/CellContextMenu.tsx

import React from 'react';
import { InputType } from '../types/curricular';
import '../styles/CellContextMenu.css';


export interface CellContextMenuProps {
  x: number;
  y: number;
  onSelect: (type: InputType | undefined) => void;
  onClose: () => void;
}

export const CellContextMenu: React.FC<CellContextMenuProps> = ({ x, y, onSelect, onClose }) => {
  const handleClick = (type: InputType | undefined) => {
    onSelect(type);
    onClose();
  };

  return (
    <div
      className="context-menu"
      style={{ top: y, left: x, position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', padding: '8px', zIndex: 1000 }}
      onMouseLeave={onClose}
    >
      <div onClick={() => handleClick('staticText')}>🔒 Texto estático</div>
      <div onClick={() => handleClick('text')}>📝 Texto libre</div>
      <div onClick={() => handleClick('checkbox')}>☑️ Checkbox</div>
      <div onClick={() => handleClick('select')}>🔽 Lista desplegable</div>
      <div onClick={() => handleClick('number')}>🔢 Número</div>
      <div onClick={() => handleClick('calculated')}>🧮 Campo calculado</div>
      <div onClick={() => handleClick(undefined)}>🗑️ Borrar tipo</div>
    </div>
  );
};
