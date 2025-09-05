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
      <div title="Insertar texto estático" onClick={() => handleClick('staticText')}>
        🔒 Texto estático
      </div>
      <div title="Insertar campo de texto" onClick={() => handleClick('text')}>
        📝 Texto libre
      </div>
      <div title="Insertar casilla de verificación" onClick={() => handleClick('checkbox')}>
        ☑️ Checkbox
      </div>
      <div title="Insertar lista desplegable" onClick={() => handleClick('select')}>
        🔽 Lista desplegable
      </div>
      <div title="Insertar campo numérico" onClick={() => handleClick('number')}>
        🔢 Número
      </div>
      <div title="Insertar campo calculado" onClick={() => handleClick('calculated')}>
        🧮 Campo calculado
      </div>
      <div title="Borrar tipo" onClick={() => handleClick(undefined)}>
        🗑️ Borrar tipo
      </div>
    </div>
  );
};
