// src/components/FormatStylePanel.tsx

import React from 'react';
import './FormatStylePanel.css';
import { VisualTemplate, VisualStyle, coordKey } from '../types/visual';
import type { BlockTemplate } from '../types/curricular';
import { generatePalette } from '../utils/palette';

interface FormatStylePanelProps {
  selectedCoord?: { row: number; col: number };
  visualTemplate: VisualTemplate;
  onUpdateVisual: (next: VisualTemplate) => void;
  template: BlockTemplate;
}

export const FormatStylePanel: React.FC<FormatStylePanelProps> = ({
  selectedCoord,
  visualTemplate,
  onUpdateVisual,
  template,
}) => {
  if (!selectedCoord) {
    return (
      <div className="format-style-panel">
        <h3>Formato</h3>
        <p>Selecciona una celda activa para editar su formato.</p>
      </div>
    );
  }

  const k = coordKey(selectedCoord.row, selectedCoord.col);
  const current: VisualStyle = visualTemplate[k] ?? {};

  const patch = (p: Partial<VisualStyle>) => {
    const base: VisualStyle = { ...current, ...p };
    if ('conditionalBg' in p && p.conditionalBg === undefined) {
      delete base.conditionalBg;
    }
    const next = { ...visualTemplate, [k]: base };
    onUpdateVisual(next);
  };

  const resetStyle = () => {
    const next = { ...visualTemplate };
    delete next[k];
    onUpdateVisual(next);
  };

  // Helpers UI
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const fontPx = current.fontSizePx ?? 14; // default
  const padX = current.paddingX ?? 8;
  const padY = current.paddingY ?? 6;

  const selectCells = React.useMemo(() => {
    const cells: { coord: string; options: string[] }[] = [];
    template.forEach((row, rIdx) =>
      row.forEach((cell, cIdx) => {
        if (cell.type === 'select') {
          cells.push({
            coord: coordKey(rIdx, cIdx),
            options: cell.dropdownOptions ?? [],
          });
        }
      })
    );
    return cells;
  }, [template]);

  const handleSelectSourceChange = (coord: string) => {
    if (!coord) {
      patch({ conditionalBg: undefined });
      return;
    }
    const source = selectCells.find((c) => c.coord === coord);
    const palette = generatePalette(source?.options.length ?? 0);
    const colors = Object.fromEntries(
      (source?.options ?? []).map((opt, idx) => [opt, palette[idx]])
    );
    patch({ conditionalBg: { selectSource: { coord, colors } } });
  };

  return (
    <div className="format-style-panel">
      <h3>Formato</h3>

        {/* Color */}
        <div className="field">
          <label>🎨 Color de fondo</label>
          <input
            type="color"
            value={current.backgroundColor ?? '#ffffff'}
            onChange={(e) => patch({ backgroundColor: e.target.value })}
          />
        </div>

        {/* Color condicional por checkbox */}
        <div className="field">
          <label>
            <input
              type="checkbox"
              checked={current.conditionalBg !== undefined}
              onChange={(e) =>
                patch({
                  conditionalBg: e.target.checked
                    ? current.conditionalBg ?? { checkedColor: '#ffffff' }
                    : undefined,
                })
              }
            />
            🎯 Color al marcar
          </label>
          {current.conditionalBg && (
            <input
              type="color"
              value={current.conditionalBg.checkedColor ?? '#ffffff'}
              onChange={(e) =>
                patch({
                  conditionalBg: {
                    ...current.conditionalBg,
                    checkedColor: e.target.value,
                  },
                })
              }
            />
          )}
        </div>

      {/* Alineación */}
      <div className="field">
        <label>🧭 Alineación</label>
        <select
          value={current.textAlign ?? 'left'}
          onChange={(e) => patch({ textAlign: e.target.value as VisualStyle['textAlign'] })}
        >
          <option value="left">Izquierda</option>
          <option value="center">Centro</option>
          <option value="right">Derecha</option>
        </select>
      </div>

      {/* Borde */}
      <div className="field">
        <label>
          <input
            type="checkbox"
            checked={current.border !== false}
            onChange={(e) => patch({ border: e.target.checked ? true : false })}
          />
          🧱 Borde visible
        </label>
      </div>

      {/* Tamaño de fuente (px) con slider + stepper */}
      <div className="field">
        <label>🔠 Tamaño de fuente (px)</label>
        <div className="control-row">
          <button
            type="button"
            onClick={() => patch({ fontSizePx: clamp(fontPx - 1, 10, 36) })}
            aria-label="Disminuir tamaño de fuente"
          >
            −
          </button>
          <input
            type="range"
            min={10}
            max={36}
            step={1}
            value={fontPx}
            onChange={(e) => patch({ fontSizePx: clamp(Number(e.target.value), 10, 36) })}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => patch({ fontSizePx: clamp(fontPx + 1, 10, 36) })}
            aria-label="Aumentar tamaño de fuente"
          >
            +
          </button>
          <span className="value-chip">{fontPx}px</span>
        </div>
        {/* Nota: mantenemos 'fontSize' legacy por compatibilidad; si hay fontSizePx, tiene prioridad */}
      </div>

      {/* Padding horizontal */}
      <div className="field">
        <label>↔️ Relleno horizontal (px)</label>
        <div className="control-row">
          <button
            type="button"
            onClick={() => patch({ paddingX: clamp(padX - 1, 0, 32) })}
            aria-label="Disminuir relleno horizontal"
          >
            −
          </button>
          <input
            type="range"
            min={0}
            max={32}
            step={1}
            value={padX}
            onChange={(e) => patch({ paddingX: clamp(Number(e.target.value), 0, 32) })}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => patch({ paddingX: clamp(padX + 1, 0, 32) })}
            aria-label="Aumentar relleno horizontal"
          >
            +
          </button>
          <span className="value-chip">{padX}px</span>
        </div>
      </div>

      {/* Padding vertical */}
      <div className="field">
        <label>↕️ Relleno vertical (px)</label>
        <div className="control-row">
          <button
            type="button"
            onClick={() => patch({ paddingY: clamp(padY - 1, 0, 32) })}
            aria-label="Disminuir relleno vertical"
          >
            −
          </button>
          <input
            type="range"
            min={0}
            max={32}
            step={1}
            value={padY}
            onChange={(e) => patch({ paddingY: clamp(Number(e.target.value), 0, 32) })}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => patch({ paddingY: clamp(padY + 1, 0, 32) })}
            aria-label="Aumentar relleno vertical"
          >
            +
          </button>
          <span className="value-chip">{padY}px</span>
        </div>
      </div>
      
      {/* Color condicionado por select */}
      {selectCells.length > 0 && (
        <div className="field">
          <label>🎯 Color según select</label>
          <select
            value={current.conditionalBg?.selectSource?.coord ?? ''}
            onChange={(e) => handleSelectSourceChange(e.target.value)}
          >
            <option value="">(sin origen)</option>
            {selectCells.map((c) => (
              <option key={c.coord} value={c.coord}>
                {c.coord}
              </option>
            ))}
          </select>
          {current.conditionalBg?.selectSource && (
            <div className="palette-preview">
              {Object.entries(
                current.conditionalBg.selectSource.colors
              ).map(([opt, color]) => (
                <div
                  key={opt}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '4px',
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: color,
                      border: '1px solid #ccc',
                      display: 'inline-block',
                    }}
                  />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button className="reset-btn" onClick={resetStyle}>
        ✨ Restablecer formato
      </button>
    </div>
  );
};
