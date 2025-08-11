// src/components/FormatStylePanel.tsx

import React from 'react';
import './FormatStylePanel.css';
import { VisualTemplate, VisualStyle, coordKey } from '../types/visual';

interface FormatStylePanelProps {
  selectedCoord?: { row: number; col: number };
  visualTemplate: VisualTemplate;
  onUpdateVisual: (next: VisualTemplate) => void;
}

export const FormatStylePanel: React.FC<FormatStylePanelProps> = ({
  selectedCoord,
  visualTemplate,
  onUpdateVisual,
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
    const next = { ...visualTemplate, [k]: { ...current, ...p } };
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

      <button className="reset-btn" onClick={resetStyle}>
        ✨ Restablecer formato
      </button>
    </div>
  );
};
