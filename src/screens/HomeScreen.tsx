// src/screens/HomeScreen.tsx
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { IntroOverlay } from '../components/IntroOverlay';
import type { BlockExport } from '../utils/block-io.ts';
import { importBlock } from '../utils/block-io.ts';
import type { MallaExport } from '../utils/malla-io.ts';
import { importMalla } from '../utils/malla-io.ts';
import { createLocalStorageProjectRepository } from '../utils/master-repo.ts';

interface Props {
  onNewBlock: () => void;
  onLoadBlock: (data: BlockExport) => void;
  onLoadMalla: (data: MallaExport) => void;
  onOpenProject: (
    id: string,
    data: BlockExport | MallaExport,
    name: string,
  ) => void;
}

export const HomeScreen: React.FC<Props> = ({
  onNewBlock,
  onLoadBlock,
  onLoadMalla,
  onOpenProject,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const repo = useMemo(
    () => createLocalStorageProjectRepository<BlockExport | MallaExport>(),
    []
  );
  const [projects, setProjects] = useState(
    () => repo.list()
  );
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    setProjects(repo.list());
  }, [repo]);

  useEffect(() => {
    const key = 'introOverlaySeen';
    if (typeof window !== 'undefined' && !window.localStorage.getItem(key)) {
      setShowIntro(true);
      window.localStorage.setItem(key, 'true');
    }
  }, []);

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

  const handleDeleteProject = (id: string) => {
    repo.remove(id);
    setProjects(repo.list());
  };

  const handleOpenProject = (id: string) => {
    const proj = repo.load(id);
    if (!proj) return;
    onOpenProject(id, proj.data, proj.meta.name);
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
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            {p.name} - {new Date(p.date).toLocaleString()}{' '}
            <button onClick={() => handleOpenProject(p.id)}>Abrir</button>{' '}
            <button onClick={() => handleDeleteProject(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      {showIntro && <IntroOverlay onClose={() => setShowIntro(false)} />}
    </div>
  );
};
