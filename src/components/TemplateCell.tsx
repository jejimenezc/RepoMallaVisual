// src/components/TemplateCell.tsx

import React from 'react';
import { BlockTemplate, BlockTemplateCell } from '../types/curricular';
import { VisualTemplate } from '../types/visual';

interface Props {
  cell: BlockTemplateCell;
  row: number;
  col: number;
  template: BlockTemplate;
  isSelected: boolean;
  onClick: (e: React.MouseEvent, row: number, col: number) => void;
  onContextMenu: (e: React.MouseEvent, row: number, col: number) => void;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  /** aplicar estilos de vista (solo en Viewer) */
  applyVisual?: boolean;
  /** mapa visual (solo para Viewer) */
  visualTemplate?: VisualTemplate;
}

export const TemplateCell: React.FC<Props> = ({
  cell,
  row,
  col,
  template,
  isSelected,
  onClick,
  onContextMenu,
  onMouseDown,
  onMouseEnter,
  applyVisual = false,
  visualTemplate,
}) => {
  const key = `${row}-${col}`;
  const isMerged = !!cell.mergedWith;
  const cellCoord = `${row}-${col}`;

  // Base = no tiene mergedWith y al menos otra celda lo referencia
  const isBase =
    cell.mergedWith === undefined &&
    template.some((r) => r.some((c) => c?.mergedWith === cellCoord));

  const mergedGroup = template
    .flatMap((r, rIdx) =>
      r.map((c, cIdx) =>
        c?.mergedWith === cellCoord ? { row: rIdx, col: cIdx } : undefined
      )
    )
    .filter((v): v is { row: number; col: number } => v !== undefined);

  // --- VISIBILIDAD ---
  if (applyVisual) {
    // Vista: solo activas; miembros no renderizan
    if (!cell.active) return null;
    if (isMerged && !isBase) return null;
  }
  // Edición: nunca return null (miembros quedan invisibles pero ocupan su celda)

  // Lookup de estilo visual (solo vista)
  const baseKey = cell.mergedWith ?? key;
  const v = applyVisual ? visualTemplate?.[baseKey] : undefined;

  // Vista: expandimos si todo el grupo está activo
  const allActiveInGroup =
    (cell.active ?? false) &&
    mergedGroup.every(({ row, col }) => template[row][col].active);

  // Estilo base en edición (no mezclado con visual)
  const editBaseStyle: React.CSSProperties = {
    backgroundColor: cell.active ? '#e9f1ff' : '#ffffff',
    border: isSelected ? '2px solid #3b82f6' : '1px solid #d1d5db',
    color: '#111827',
  };

  // Anclaje absoluto
  const anchoredPosition: React.CSSProperties = {
    gridRow: `${row + 1} / ${row + 2}`,
    gridColumn: `${col + 1} / ${col + 2}`,
  };

  // Span en edición y/o vista
  const shouldSpanInEdit = !applyVisual && isBase && mergedGroup.length > 0;
  const shouldSpanInView = applyVisual && isBase && allActiveInGroup;

  const spanStyle: React.CSSProperties =
    (shouldSpanInEdit || shouldSpanInView)
      ? {
          gridRow: `${Math.min(row, ...mergedGroup.map((c) => c.row)) + 1} / ${
            Math.max(row, ...mergedGroup.map((c) => c.row)) + 2
          }`,
          gridColumn: `${
            Math.min(col, ...mergedGroup.map((c) => c.col)) + 1
          } / ${Math.max(col, ...mergedGroup.map((c) => c.col)) + 2}`,
          zIndex: 2,
        }
      : {};

  // Fallback de color en vista si no hay background configurado
  const viewFallbackBg =
    applyVisual && cell.active && !v?.backgroundColor ? '#ffffff' : undefined;

  // Mapeo legacy enum -> px (si no hay fontSizePx)
  const enumToPx = (fs?: 'small' | 'normal' | 'large') =>
    fs === 'small' ? 12 : fs === 'large' ? 20 : 14;

  const computedFontSizePx =
    applyVisual ? (v?.fontSizePx ?? enumToPx(v?.fontSize)) : undefined;

  // Estilo del contenedor (.template-cell)
  const style: React.CSSProperties = {
    ...anchoredPosition,
    ...(applyVisual ? {} : editBaseStyle),
    ...spanStyle,
    // Fondo/borde del contenedor en vista
    ...(applyVisual && v?.border ? { border: '1px solid #333' } : {}),
    ...(applyVisual && v?.backgroundColor ? { backgroundColor: v.backgroundColor } : {}),
    ...(viewFallbackBg ? { backgroundColor: viewFallbackBg } : {}),
    // ⛔️ OJO: ya NO aplicamos fontSize ni textAlign aquí
  };

  // En edición: miembros invisibles pero ocupan espacio
  if (!applyVisual && isMerged && !isBase) {
    style.visibility = 'hidden';
    style.pointerEvents = 'none';
    style.border = '1px solid transparent';
    style.backgroundColor = 'transparent';
  }

  // Contenido textual (estático)
  const displayStaticText =
    cell.type === 'staticText' && (cell.label ?? '').trim().length > 0
      ? cell.label!.trim()
      : '';

  // 🎯 Estilos SOLO del contenido (.cell-content): padding, font-size, text-align
  const contentStyle: React.CSSProperties = {};
  if (applyVisual) {
    const px = Math.max(0, Math.min(64, v?.paddingX ?? 8));
    const py = Math.max(0, Math.min(64, v?.paddingY ?? 6));
    contentStyle.padding = `${py}px ${px}px`;
    if (computedFontSizePx) contentStyle.fontSize = `${computedFontSizePx}px`;
    if (v?.textAlign) contentStyle.textAlign = v.textAlign;
  }

  // Icono marcador solo si no hay contenido visible
  const fallbackIcon =
    !displayStaticText && cell.type === 'staticText' ? '𝑺' :
    cell.type === 'select' ? '🔽' :
    cell.type === 'checkbox' ? '☑️' :
    cell.type === 'text' ? '📝' :
    '';

  return (
    <div
      key={key}
      className={`template-cell ${cell.active ? 'active' : ''} ${isSelected ? 'selected' : ''} ${isMerged ? 'merged' : ''} ${isBase ? 'base-cell' : ''}`}
      style={style}
      onClick={(e) => onClick(e, row, col)}
      onContextMenu={(e) => onContextMenu(e, row, col)}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      title={displayStaticText || undefined}
      aria-label={displayStaticText || undefined}
      role="gridcell"
    >
      {displayStaticText ? (
        <div className="cell-content" data-kind="staticText" style={contentStyle}>
          {displayStaticText}
        </div>
      ) : (
        fallbackIcon || null
      )}
    </div>
  );
};
