// src/components/BlockTemplateViewer.tsx

import React from 'react';
import { BlockTemplate } from '../types/curricular';
import { TemplateGrid } from './TemplateGrid';
import { VisualTemplate } from '../types/visual';
import './BlockTemplateEditor.css';

interface Props {
  template: BlockTemplate;
  visualTemplate: VisualTemplate;
  selectedCoord?: { row: number; col: number };
  onSelectCoord: (coord: { row: number; col: number }) => void;
}

export const BlockTemplateViewer: React.FC<Props> = ({
  template,
  visualTemplate,
  selectedCoord,
  onSelectCoord,
}) => {
  const selectedCells = selectedCoord ? [selectedCoord] : [];

  return (
    <div className="block-template-viewer">
      <TemplateGrid
        template={template}
        selectedCells={selectedCells}
        onClick={(e, row, col) => {
          const tag = (e.target as HTMLElement).tagName;
          if (tag !== 'INPUT' && tag !== 'SELECT' && tag !== 'LABEL') {
            e.preventDefault();
          }
          const cell = template[row][col];
          const isMerged = !!cell.mergedWith;
          if (!cell.active || isMerged) return;
          onSelectCoord({ row, col });
        }}
        onContextMenu={() => {}}
        onMouseDown={() => {}}
        onMouseEnter={() => {}}
        onMouseUp={() => {}}
        onMouseLeave={() => {}}
        applyVisual={true}
        visualTemplate={visualTemplate}
      />
    </div>
  );
};
