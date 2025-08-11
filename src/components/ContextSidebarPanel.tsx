// src/components/ContextSidebarPanel.tsx

import React from 'react';
import './ContextSidebarPanel.css';
import type { BlockTemplateCell } from '../types/curricular';

import  StaticTextConfigForm  from './StaticTextConfigForm';
import { TextConfigForm } from './TextConfigForm';
import { CheckboxConfigForm } from './CheckboxConfigForm';
import { SelectConfigForm } from './SelectConfigForm';

interface Props {
  selectedCount: number;
  canCombine: boolean;
  canSeparate: boolean;
  onCombine: () => void;
  onSeparate: () => void;

  selectedCell?: BlockTemplateCell | null;
  selectedCoord?: { row: number; col: number };

  onUpdateCell?: (
    updatedCell: Partial<BlockTemplateCell>,
    coord?: { row: number; col: number }
  ) => void;

  combineDisabledReason?: string;
}

export const ContextSidebarPanel: React.FC<Props> = ({
  selectedCount,
  canCombine,
  canSeparate,
  onCombine,
  onSeparate,
  selectedCell,
  selectedCoord,
  onUpdateCell,
  combineDisabledReason,
}) => {
  const patchCell = (update: Partial<BlockTemplateCell>) => {
    if (!onUpdateCell || !selectedCoord) return;
    onUpdateCell(update, selectedCoord);
  };

  const renderConfigForm = () => {
    if (!selectedCell || !selectedCell.type) return null;

    switch (selectedCell.type) {
      case 'staticText':
        return (
          <StaticTextConfigForm
            value={selectedCell.label ?? ''}
            onChange={(newValue) => patchCell({ label: newValue })}
          />
        );

      case 'text':
        return (
          <TextConfigForm
            cell={selectedCell}
            onUpdate={(u) => patchCell(u)}
          />
        );

      case 'checkbox':
        return (
          <CheckboxConfigForm
            cell={selectedCell}
            onUpdate={(u) => patchCell(u)}
          />
        );

      case 'select':
        return (
          selectedCoord && (
            <SelectConfigForm
              cell={selectedCell}
              coord={selectedCoord}
              onUpdate={(u, coord) => {
                if (onUpdateCell) onUpdateCell(u, coord);
              }}
            />
          )
        );

      default:
        return null;
    }
  };

  return (
    <aside className="context-sidebar-panel">
      <h3>Selección</h3>

      <div className="row">
        <span>Seleccionadas:</span>
        <strong>{selectedCount}</strong>
      </div>

      <div className="actions">
        <button className="btn" disabled={!canCombine} onClick={onCombine}>
          Combinar
        </button>
        <button className="btn" disabled={!canSeparate} onClick={onSeparate}>
          Separar
        </button>
      </div>

      {!canCombine && combineDisabledReason && (
        <div className="sidebar-hint" role="status" aria-live="polite">
          {combineDisabledReason}
        </div>
      )}

      {renderConfigForm()}
    </aside>
  );
};
