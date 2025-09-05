// src/App.tsx
import React, { useState } from 'react';
import type { JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BlockEditorScreen } from './screens/BlockEditorScreen';
import { MallaEditorScreen } from './screens/MallaEditorScreen';
import { HomeScreen } from './screens/HomeScreen';
import { BlockTemplate } from './types/curricular';
import { VisualTemplate, BlockAspect } from './types/visual';
import type { MallaExport } from './utils/malla-io';
import { BLOCK_SCHEMA_VERSION, type BlockExport } from './utils/block-io';
import styles from './App.module.css';

export default function App(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [block, setBlock] = useState<{
    template: BlockTemplate;
    visual: VisualTemplate;
    aspect: BlockAspect;
  } | null>(null);
  const [malla, setMalla] = useState<MallaExport | null>(null);

  const handleProceed = (
    template: BlockTemplate,
    visual: VisualTemplate,
    aspect: BlockAspect
  ) => {
    try {
      window.localStorage.removeItem('malla-editor-state');
    } catch {
      /* ignore */
    }
    setBlock({ template, visual, aspect });
    setMalla(null);
    navigate('/malla');
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.appHeader}><h1>Mallas Curriculares</h1></header>
      <main className={styles.appMain}>
        {location.pathname === '/' && (
          <HomeScreen
            onNewBlock={() => {
              setBlock(null);
              setMalla(null);
              navigate('/bloque');
            }}
            onLoadBlock={(data: BlockExport) => {
              setBlock({
                template: data.template,
                visual: data.visual,
                aspect: data.aspect,
              });
              setMalla(null);
              navigate('/bloque');
            }}
            onLoadMalla={(data: MallaExport) => {
              setBlock({
                template: data.master.template,
                visual: data.master.visual,
                aspect: data.master.aspect,
              });
              setMalla(data);
              navigate('/malla');
            }}
          />
        )}
        {location.pathname === '/bloque' && (
          <BlockEditorScreen
            onProceedToMalla={handleProceed}
            initialData={
              block
                ? { version: BLOCK_SCHEMA_VERSION, ...block }
                : undefined
            }
          />
        )}
        {location.pathname === '/malla' && block && (
          <MallaEditorScreen
            template={block.template}
            visual={block.visual}
            aspect={block.aspect}
            onBack={() => navigate('/bloque')}
            onUpdateMaster={setBlock}
            initialMalla={malla ?? undefined}
          />
        )}
      </main>
    </div>
  );
}