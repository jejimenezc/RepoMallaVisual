// src/screens/MallaEditorScreen.tsx
import React from 'react';
import { BlockTemplate } from '../types/curricular';
import { BlockTemplateViewer } from '../components/BlockTemplateViewer';
import { VisualTemplate, BlockAspect } from '../types/visual';

interface Props {
  template: BlockTemplate;
  visual: VisualTemplate;
  aspect: BlockAspect;
  onBack?: () => void;
}

export const MallaEditorScreen: React.FC<Props> = ({
  template,
  visual,
  aspect,
  onBack,
}) => {
  return (
    <div className="malla-editor-screen">
      <div className="header-controls">
        {onBack && (
          <button onClick={onBack}>⬅️ Volver</button>
        )}
        <h2>Editor de Malla</h2>
      </div>
      <BlockTemplateViewer
        template={template}
        visualTemplate={visual}
        aspect={aspect}
        selectedCoord={undefined}
        onSelectCoord={() => {}}
      />
    </div>
  );
};