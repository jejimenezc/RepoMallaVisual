// src/screens/BlockEditorScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { BlockTemplate } from '../types/curricular.ts';
import { BlockTemplateEditor } from '../components/BlockTemplateEditor';
import { BlockTemplateViewer } from '../components/BlockTemplateViewer';
import { ContextSidebarPanel } from '../components/ContextSidebarPanel';
import { FormatStylePanel } from '../components/FormatStylePanel';
import { TwoPaneLayout } from '../layout/TwoPaneLayout';
import { VisualTemplate, BlockAspect } from '../types/visual.ts';
import { exportBlock, importBlock } from '../utils/block-io.ts';
import type { BlockExport } from '../utils/block-io.ts';
import type { EditorSidebarState } from '../types/panel.ts';


const generateEmptyTemplate = (): BlockTemplate =>
  Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({ active: false, label: '', type: undefined }))
  );

interface BlockEditorScreenProps {
  onProceedToMalla?: (
    template: BlockTemplate,
    visual: VisualTemplate,
    aspect: BlockAspect
  ) => void;
  initialData?: BlockExport;
}

export const BlockEditorScreen: React.FC<BlockEditorScreenProps> = ({
  onProceedToMalla,
  initialData,
}) => {
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [template, setTemplate] = useState<BlockTemplate>(
    initialData?.template ?? generateEmptyTemplate()
  );
  const [visual, setVisual] = useState<VisualTemplate>(
    initialData?.visual ?? {}
  ); // mapa visual separado
  const [aspect, setAspect] = useState<BlockAspect>(
    initialData?.aspect ?? '1/1'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
    if (initialData) {
      setTemplate(initialData.template);
      setVisual(initialData.visual);
      setAspect(initialData.aspect);
    }
  }, [initialData]);

  const handleExport = () => {
    const json = exportBlock(template, visual, aspect);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'block.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        const data = importBlock(text);
        setTemplate(data.template);
        setVisual(data.visual);
        setAspect(data.aspect);
      } catch (err) {
        alert((err as Error).message);
      }
    });
  };

  // Estado que publica el editor para poblar el ContextSidebarPanel
  const [editorSidebar, setEditorSidebar] = useState<EditorSidebarState | null>(null);

  // Selección en modo vista
    const [selectedCoord, setSelectedCoord] =
      useState<{ row: number; col: number } | undefined>(undefined);
    useEffect(() => { setSelectedCoord(undefined); }, [mode]);

  const header = (
    <div className="header-controls">
      <button
        className={mode === 'edit' ? 'active' : ''}
        onClick={() => setMode('edit')}
      >
        ✏️ Editar
      </button>
      <button
        className={mode === 'view' ? 'active' : ''}
        onClick={() => setMode('view')}
      >
        👁️ Vista
      </button>
      <button onClick={handleExport}>⬇️ Exportar</button>
      <button onClick={() => fileInputRef.current?.click()}>⬆️ Importar</button>
      <button onClick={() => onProceedToMalla?.(template, visual, aspect)}>
        ➡️ Malla
      </button>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImportFile}
      />
    </div>
  );

  if (mode === 'edit') {
    return (
      <TwoPaneLayout
        header={header}
        left={
          <BlockTemplateEditor
            template={template}
            setTemplate={setTemplate}
            onSidebarStateChange={setEditorSidebar}
          />
        }
        right={
          <ContextSidebarPanel
  selectedCount={editorSidebar?.selectedCount ?? 0}
  canCombine={editorSidebar?.canCombine ?? false}
  canSeparate={editorSidebar?.canSeparate ?? false}
  onCombine={editorSidebar?.handlers.onCombine ?? (() => {})}
  onSeparate={editorSidebar?.handlers.onSeparate ?? (() => {})}
  selectedCell={editorSidebar?.selectedCell ?? null}
  selectedCoord={editorSidebar?.selectedCoord}
  onUpdateCell={(updated, coord) => {
    const fallback = editorSidebar?.selectedCoord;
    const target = coord ?? fallback;
    if (!target || !editorSidebar?.handlers.onUpdateCell) return;
    editorSidebar.handlers.onUpdateCell(updated, target);
  }}
  combineDisabledReason={editorSidebar?.combineDisabledReason}
  template={template}


          />
        }
      />
    );
  }

  // MODO VISTA
  return (
    <TwoPaneLayout
      header={header}
      left={
        <BlockTemplateViewer
          template={template}
          visualTemplate={visual}
          selectedCoord={selectedCoord}
          onSelectCoord={setSelectedCoord}
          aspect={aspect}
        />
      }
      right={
        <FormatStylePanel
          selectedCoord={selectedCoord}
          visualTemplate={visual}
          onUpdateVisual={setVisual}
          template={template}
          blockAspect={aspect}
          onUpdateAspect={setAspect}
        />
      }
    />
  );
};
