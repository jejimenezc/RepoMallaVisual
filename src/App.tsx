// src/App.tsx
import React, { useState } from 'react';
import type { JSX } from 'react';
import { BlockEditorScreen } from './screens/BlockEditorScreen';
import { MallaEditorScreen } from './screens/MallaEditorScreen';
import { BlockTemplate } from './types/curricular';
import { VisualTemplate, BlockAspect } from './types/visual';
import './App.css';

export default function App(): JSX.Element {
  const [stage, setStage] = useState<'block' | 'malla'>('block');
  const [block, setBlock] = useState<{
    template: BlockTemplate;
    visual: VisualTemplate;
    aspect: BlockAspect;
  } | null>(null);

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
    setStage('malla');
  };
  
  return (
    <div className="app-container">
      <header className="app-header"><h1>Mallas Curriculares</h1></header>
      <main className="app-main">
        {stage === 'block' && (
          <BlockEditorScreen onProceedToMalla={handleProceed} />
        )}
        {stage === 'malla' && block && (
          <MallaEditorScreen
            template={block.template}
            visual={block.visual}
            aspect={block.aspect}
            onBack={() => setStage('block')}
            onUpdateMaster={setBlock}
          />
        )}
      </main>
    </div>
  );
}