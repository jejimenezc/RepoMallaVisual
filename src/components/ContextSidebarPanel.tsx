// src/components/ContextSidebarPanel.tsx

import React from 'react';
import './ContextSidebarPanel.css';
import type { BlockTemplateCell, BlockTemplate } from '../types/curricular';

import  StaticTextConfigForm  from './StaticTextConfigForm';
import { TextConfigForm } from './TextConfigForm';
import { CheckboxConfigForm } from './CheckboxConfigForm';
import { SelectConfigForm } from './SelectConfigForm';
import { NumberConfigForm } from './NumberConfigForm';
import { CalculatedConfigForm } from './CalculatedConfigForm';

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
  template: BlockTemplate;

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
  template,

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
          selectedCoord && (
            <StaticTextConfigForm
              value={selectedCell.label ?? ''}
              coord={selectedCoord}
              onChange={(newValue) => patchCell({ label: newValue })}
            />
          )
        );

      case 'text':
        return (
          selectedCoord && (
            <TextConfigForm
              cell={selectedCell}
              coord={selectedCoord}
              onUpdate={(u) => patchCell(u)}
            />
          )
        );

      case 'checkbox':
        return (
          selectedCoord && (
            <CheckboxConfigForm
              cell={selectedCell}
              coord={selectedCoord}
              onUpdate={(u) => patchCell(u)}
            />
          )
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
    case 'number':
      return (
        selectedCoord && (
          <NumberConfigForm
            cell={selectedCell}
            coord={selectedCoord}
            onUpdate={(u) => patchCell(u)}
          />
        )
      );
    case 'calculated':
      return (
        selectedCoord && (
          <CalculatedConfigForm
            cell={selectedCell}
            template={template}
            coord={selectedCoord}
            onUpdate={(u) => patchCell(u)}
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
        <button
          className="btn"
          disabled={!canCombine}
          onClick={onCombine}
          title="Combinar celdas seleccionadas"
        >
          Combinar
        </button>
        <button
          className="btn"
          disabled={!canSeparate}
          onClick={onSeparate}
          title="Separar celdas seleccionadas"
        >
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
