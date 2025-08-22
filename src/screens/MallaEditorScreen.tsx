// src/screens/MallaEditorScreen.tsx
import React, { useMemo, useRef, useState } from 'react';
import { CurricularBlock, BlockTemplate } from '../types/curricular';
import { TemplateGrid } from '../components/TemplateGrid';
import { VisualTemplate, BlockAspect } from '../types/visual';
import {
  cropTemplate,
  cropVisualTemplate,
  getActiveBounds,
} from '../utils/block-active';
import './MallaEditorScreen.css';

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
  const bounds = useMemo(() => getActiveBounds(template), [template]);
  const subTemplate = useMemo(() => cropTemplate(template, bounds), [template, bounds]);
  const subVisual = useMemo(
    () => cropVisualTemplate(visual, bounds),
    [visual, bounds]
  );

  const [cols, setCols] = useState(5);
  const [rows, setRows] = useState(5);
  const [blocks, setBlocks] = useState<CurricularBlock[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const cellWidth = aspect === '1/2' ? 25 : 50;
  const cellHeight = aspect === '2/1' ? 25 : 50;

  const gridAreaStyle = useMemo(
    () =>
      ({
        '--cols': String(cols),
        '--rows': String(rows),
        width: cols * cellWidth,
        height: rows * cellHeight,
      }) as React.CSSProperties,
    [cols, rows, cellWidth, cellHeight]
  );

  const pieceGridStyle: React.CSSProperties = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${bounds.cols}, ${cellWidth}px)`,
      gridTemplateRows: `repeat(${bounds.rows}, ${cellHeight}px)`,
    }),
    [bounds, cellWidth, cellHeight]
  );

  const handleAddBlock = () => {
    const newBlock: CurricularBlock = {
      id: crypto.randomUUID(),
      template,
      visual,
      aspect,
      x: 0,
      y: 0,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleMouseDownBlock = (
    e: React.MouseEvent<HTMLDivElement>,
    block: CurricularBlock
  ) => {
    setDraggingId(block.id);
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setDragPos({ x: block.x * cellWidth, y: block.y * cellHeight });
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingId || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left - dragOffset.current.x;
    let y = e.clientY - rect.top - dragOffset.current.y;
    const maxX = cols * cellWidth - bounds.cols * cellWidth;
    const maxY = rows * cellHeight - bounds.rows * cellHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    setDragPos({ x, y });
  };

  const handleMouseUp = () => {
    if (!draggingId) return;
    const col = Math.round(dragPos.x / cellWidth);
    const row = Math.round(dragPos.y / cellHeight);
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === draggingId ? { ...b, x: col, y: row } : b
      )
    );
    setDraggingId(null);
  };

  return (
    <div className="malla-screen">
      <div className="repository">
        {onBack && <button onClick={onBack}>⬅️ Volver</button>}
        <h3>Repositorio</h3>
        <div className="block-preview">
          <TemplateGrid
            template={subTemplate}
            selectedCells={[]}
            onClick={() => {}}
            onContextMenu={() => {}}
            onMouseDown={() => {}}
            onMouseEnter={() => {}}
            onMouseUp={() => {}}
            onMouseLeave={() => {}}
            applyVisual={true}
            visualTemplate={subVisual}
            style={pieceGridStyle}
          />
        </div>
        <button onClick={handleAddBlock}>Agregar bloque</button>
      </div>
      <div className="malla-wrapper">
        <div className="grid-controls">
          <h2>Editor de Malla</h2>
          <label>
            Filas
            <input
              type="number"
              min={1}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            />
          </label>
          <label>
            Columnas
            <input
              type="number"
              min={1}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
            />
          </label>
        </div>
        <div
          className="malla-area"
          ref={gridRef}
          style={gridAreaStyle}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {blocks.map((b) => {
            const left = draggingId === b.id ? dragPos.x : b.x * cellWidth;
            const top = draggingId === b.id ? dragPos.y : b.y * cellHeight;
            return (
              <div
                key={b.id}
                className="block-wrapper"
                style={{
                  left,
                  top,
                  width: bounds.cols * cellWidth,
                  height: bounds.rows * cellHeight,
                }}
                onMouseDown={(e) => handleMouseDownBlock(e, b)}
              >
                <TemplateGrid
                  template={subTemplate}
                  selectedCells={[]}
                  onClick={() => {}}
                  onContextMenu={() => {}}
                  onMouseDown={() => {}}
                  onMouseEnter={() => {}}
                  onMouseUp={() => {}}
                  onMouseLeave={() => {}}
                  applyVisual={true}
                  visualTemplate={subVisual}
                  style={pieceGridStyle}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};