// src/screens/HomeScreen.tsx
import React, { useRef } from 'react';
import type { BlockExport } from '../utils/block-io.ts';
import { importBlock } from '../utils/block-io.ts';
import type { MallaExport } from '../utils/malla-io.ts';
import { importMalla } from '../utils/malla-io.ts';

interface Props {
  onNewBlock: () => void;
  onLoadBlock: (data: BlockExport) => void;
  onLoadMalla: (data: MallaExport) => void;
}

export const HomeScreen: React.FC<Props> = ({
  onNewBlock,
  onLoadBlock,
  onLoadMalla,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        const malla = importMalla(text);
        onLoadMalla(malla);
      } catch {
        try {
          const block = importBlock(text);
          onLoadBlock(block);
        } catch {
          alert('Archivo inválido');
        }
      }
    });
    e.target.value = '';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      <button onClick={onNewBlock}>Nuevo bloque</button>
      <button onClick={handleLoadClick}>Cargar bloque/malla</button>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};
