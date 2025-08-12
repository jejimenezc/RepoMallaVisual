// src/screens/BlockEditorScreen.tsx
import { useState, useEffect } from 'react';
import { BlockTemplate } from '../types/curricular';
import { BlockTemplateEditor } from '../components/BlockTemplateEditor';
import { BlockTemplateViewer } from '../components/BlockTemplateViewer';
import { ContextSidebarPanel } from '../components/ContextSidebarPanel';
import { FormatStylePanel } from '../components/FormatStylePanel';
import { TwoPaneLayout } from '../layout/TwoPaneLayout';
import { VisualTemplate } from '../types/visual';
import type { EditorSidebarState } from '../types/panel';


const generateEmptyTemplate = (): BlockTemplate =>
  Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({ active: false, label: '', type: undefined }))
  );

export const BlockEditorScreen = () => {
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [template, setTemplate] = useState<BlockTemplate>(generateEmptyTemplate());
  const [visual, setVisual] = useState<VisualTemplate>({}); // mapa visual separado

  // Estado que publica el editor para poblar el ContextSidebarPanel
  const [editorSidebar, setEditorSidebar] = useState<EditorSidebarState | null>(null);

  // Selección en modo vista
  const [selectedCoord, setSelectedCoord] = useState<{ row: number; col: number } | undefined>(undefined);
  useEffect(() => { setSelectedCoord(undefined); }, [mode]);

  const selectedCell =
    selectedCoord ? template[selectedCoord.row]?.[selectedCoord.col] : null;

  const handleUpdateCell = (
    update: Partial<BlockTemplate[number][number]>,
    coord: { row: number; col: number }
  ) => {
    setTemplate((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c }))) as BlockTemplate;
      Object.assign(next[coord.row][coord.col], update);
      return next;
    });
  };

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
        />
      }
      right={
        <FormatStylePanel
          selectedCoord={selectedCoord}
          visualTemplate={visual}
          onUpdateVisual={setVisual}
        />
      }
    />
  );
};
