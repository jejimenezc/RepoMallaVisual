// src/screens/MallaEditorScreen.tsx
import React, { useMemo, useRef, useState } from 'react';
import type {
  BlockTemplate,
  CurricularPiece,
  CurricularPieceRef,
  CurricularPieceSnapshot,
  BlockSourceRef,
} from '../types/curricular';
import { TemplateGrid } from '../components/TemplateGrid';
import type { VisualTemplate, BlockAspect } from '../types/visual';
import {
  cropTemplate,
  cropVisualTemplate,
  getActiveBounds,
} from '../utils/block-active';
import { BlockSnapshot, getCellSizeByAspect } from '../components/BlockSnapshot';
import { duplicateActiveCrop } from '../utils/block-clone';
import './MallaEditorScreen.css';

/** Mantener estos valores en sync con .template-grid (BlockTemplateEditor.css) */
const GRID_GAP = 2; // px
const GRID_PAD = 4; // px

/** Cálculo unificado de métricas de una pieza (recorte) */
function computeMetrics(tpl: BlockTemplate, aspect: BlockAspect) {
  const { cellW, cellH } = getCellSizeByAspect(aspect);
  const cols = tpl[0]?.length ?? 0;
  const rows = tpl.length;

  const contentW = cols * cellW + Math.max(0, cols - 1) * GRID_GAP;
  const contentH = rows * cellH + Math.max(0, rows - 1) * GRID_GAP;
  const outerW = contentW + GRID_PAD * 2;
  const outerH = contentH + GRID_PAD * 2;

  const gridStyle: React.CSSProperties = {
    width: contentW,
    height: contentH,
    gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellH}px)`,
    padding: GRID_PAD,
    gap: GRID_GAP,
  };

  return { cellW, cellH, cols, rows, contentW, contentH, outerW, outerH, gridStyle };
}

function isInteractive(target: HTMLElement) {
  const tag = target.tagName.toLowerCase();
  if (['input', 'select', 'textarea', 'button'].includes(tag)) return true;
  return !!target.closest('input,select,textarea,button,[contenteditable="true"]');
}

interface Props {
  /** Maestro actual (10x10) */
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
  // --- maestro + recorte activo
  const bounds = useMemo(() => getActiveBounds(template), [template]);
  const subTemplate = useMemo(() => cropTemplate(template, bounds), [template, bounds]);
  const subVisual = useMemo(() => cropVisualTemplate(visual, bounds), [visual, bounds]);
  const baseMetrics = useMemo(() => computeMetrics(subTemplate, aspect), [subTemplate, aspect]);

  // --- malla y piezas
  const [cols, setCols] = useState(5);
  const [rows, setRows] = useState(5);
  const [pieces, setPieces] = useState<CurricularPiece[]>([]);
  const [pieceValues, setPieceValues] = useState<Record<string, Record<string, string | number>>>({});

  // --- drag & drop
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragPieceOuter = useRef({ w: 0, h: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const gridAreaStyle = useMemo(
    () =>
      ({
        '--cols': String(cols),
        '--rows': String(rows),
        width: cols * baseMetrics.outerW,
        height: rows * baseMetrics.outerH,
      }) as React.CSSProperties,
    [cols, rows, baseMetrics.outerW, baseMetrics.outerH]
  );

  // --- agregar piezas
  const handleAddReferenced = () => {
    const id = crypto.randomUUID();
    const piece: CurricularPieceRef = {
      kind: 'ref',
      id,
      ref: { sourceId: 'master', bounds, aspect }, // guarda bounds completos
      x: 0,
      y: 0,
    };
    setPieces((prev) => [...prev, piece]);
  };

  const handleAddSnapshot = () => {
    const id = crypto.randomUUID();
    const snap = duplicateActiveCrop({ template, visual, aspect });
    const piece: CurricularPieceSnapshot = {
      kind: 'snapshot',
      id,
      template: snap.template,
      visual: snap.visual,
      aspect: snap.aspect,
      x: 0,
      y: 0,
      origin: { sourceId: 'master', bounds, aspect }, // para poder "descongelar"
    };
    setPieces((prev) => [...prev, piece]);
  };

  // --- TOGGLE: congelar ↔ descongelar
  const togglePieceKind = (id: string) => {
    setPieces((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        if (p.kind === 'ref') {
          // ref -> snapshot (congelar)
          const tpl = cropTemplate(template, p.ref.bounds);
          const vis = cropVisualTemplate(visual, p.ref.bounds);
          const origin: BlockSourceRef = { ...p.ref };
          return {
            kind: 'snapshot',
            id: p.id,
            template: tpl,
            visual: vis,
            aspect: p.ref.aspect,
            x: p.x,
            y: p.y,
            origin,
          } as CurricularPieceSnapshot;
        } else {
          // snapshot -> ref (descongelar) solo si hay origen
          if (!p.origin) return p;
          return {
            kind: 'ref',
            id: p.id,
            ref: { ...p.origin },
            x: p.x,
            y: p.y,
          } as CurricularPieceRef;
        }
      })
    );
  };

  // --- Duplicar pieza (mantiene kind y valores del usuario)
  const duplicatePiece = (src: CurricularPiece) => {
    const newId = crypto.randomUUID();

    setPieces((prev) => {
      // Offset a la derecha una macrocelda si cabe
      const newX = Math.min(cols - 1, src.x + 1);
      const newY = src.y;

      let clone: CurricularPiece;
      if (src.kind === 'ref') {
        clone = {
          kind: 'ref',
          id: newId,
          ref: { ...src.ref },
          x: newX,
          y: newY,
        };
      } else {
        clone = {
          kind: 'snapshot',
          id: newId,
          template: structuredClone ? structuredClone(src.template) : JSON.parse(JSON.stringify(src.template)),
          visual: structuredClone ? structuredClone(src.visual) : JSON.parse(JSON.stringify(src.visual)),
          aspect: src.aspect,
          x: newX,
          y: newY,
          origin: src.origin ? { ...src.origin } : undefined,
        };
      }
      return [...prev, clone];
    });

    // Duplicar también los valores de usuario de la pieza
    setPieceValues((prev) => {
      const oldVals = prev[src.id] ?? {};
      return { ...prev, [newId]: { ...oldVals } };
    });
  };

  // --- Eliminar pieza (y sus valores)
  const deletePiece = (id: string) => {
    setPieces((prev) => prev.filter((p) => p.id !== id));
    setPieceValues((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // --- drag handlers
  const handleMouseDownPiece = (
    e: React.MouseEvent<HTMLDivElement>,
    piece: CurricularPiece,
    pieceOuterW: number,
    pieceOuterH: number
  ) => {
    if (e.target instanceof HTMLElement && isInteractive(e.target)) return;
    setDraggingId(piece.id);
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    dragPieceOuter.current = { w: pieceOuterW, h: pieceOuterH };
    setDragPos({ x: piece.x * baseMetrics.outerW, y: piece.y * baseMetrics.outerH });
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingId || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left - dragOffset.current.x;
    let y = e.clientY - rect.top - dragOffset.current.y;
    const maxX = cols * baseMetrics.outerW - dragPieceOuter.current.w;
    const maxY = rows * baseMetrics.outerH - dragPieceOuter.current.h;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    setDragPos({ x, y });
  };

  const handleMouseUp = () => {
    if (!draggingId) return;
    const col = Math.round(dragPos.x / baseMetrics.outerW);
    const row = Math.round(dragPos.y / baseMetrics.outerH);
    setPieces((prev) => prev.map((p) => (p.id === draggingId ? { ...p, x: col, y: row } : p)));
    setDraggingId(null);
  };

  return (
    <div className="malla-screen">
      <div className="repository">
        {onBack && <button onClick={onBack}>⬅️ Volver</button>}
        <h3>Repositorio</h3>

        <div className="repo-snapshot">
          <BlockSnapshot template={template} visualTemplate={visual} aspect={aspect} />
        </div>

        <div className="repo-actions">
          <button onClick={handleAddReferenced}>Agregar bloque (referenciado)</button>
          <button onClick={handleAddSnapshot}>Agregar bloque (snapshot)</button>
        </div>
      </div>

      <div className="malla-wrapper">
        <div className="grid-controls">
          <h2>Editor de Malla</h2>
          <label>
            Filas
            <input type="number" min={1} value={rows} onChange={(e) => setRows(Number(e.target.value))} />
          </label>
          <label>
            Columnas
            <input type="number" min={1} value={cols} onChange={(e) => setCols(Number(e.target.value))} />
          </label>
        </div>

        <div
          className="malla-area"
          ref={gridRef}
          style={gridAreaStyle}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {pieces.map((p) => {
            const pieceAspect = p.kind === 'ref' ? p.ref.aspect : p.aspect;
            const pieceTemplate = p.kind === 'ref' ? cropTemplate(template, p.ref.bounds) : p.template;
            const pieceVisual = p.kind === 'ref' ? cropVisualTemplate(visual, p.ref.bounds) : p.visual;

            const m = computeMetrics(pieceTemplate, pieceAspect);

            const left = draggingId === p.id ? dragPos.x : p.x * baseMetrics.outerW;
            const top = draggingId === p.id ? dragPos.y : p.y * baseMetrics.outerH;

            const values = pieceValues[p.id] ?? {};
            const onValueChange = (key: string, value: string | number) => {
              setPieceValues((prev) => ({
                ...prev,
                [p.id]: { ...(prev[p.id] ?? {}), [key]: value },
              }));
            };

            const canUnfreeze = p.kind === 'snapshot' && !!p.origin;
            const toggleLabel = p.kind === 'ref' ? '🧊 Congelar' : '🔗 Descongelar';

            return (
              <div
                key={p.id}
                className="block-wrapper"
                style={{ left, top, width: m.outerW, height: m.outerH, position: 'absolute' }}
                onMouseDown={(e) => handleMouseDownPiece(e, p, m.outerW, m.outerH)}
              >
                {/* Toolbar por pieza */}
                <div
                  className="piece-toolbar"
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    display: 'flex',
                    gap: 4,
                    zIndex: 1000,
                    pointerEvents: 'auto',
                  }}
                >
                  {/* Toggle congelar/descongelar */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (p.kind === 'snapshot' && !p.origin) return;
                      togglePieceKind(p.id);
                    }}
                    title={toggleLabel}
                    disabled={p.kind === 'snapshot' && !p.origin}
                    style={{
                      fontSize: 12,
                      padding: '2px 6px',
                      lineHeight: 1.2,
                      border: '1px solid #bbb',
                      background: p.kind === 'ref' || canUnfreeze ? '#fff' : '#eee',
                      color: p.kind === 'ref' || canUnfreeze ? 'inherit' : '#999',
                      borderRadius: 6,
                      cursor: p.kind === 'ref' || canUnfreeze ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {toggleLabel}
                  </button>

                  {/* Duplicar */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicatePiece(p);
                    }}
                    title="Duplicar"
                    style={{
                      fontSize: 12,
                      padding: '2px 6px',
                      lineHeight: 1.2,
                      border: '1px solid #bbb',
                      background: '#fff',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    ⧉
                  </button>

                  {/* Eliminar */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePiece(p.id);
                    }}
                    title="Eliminar"
                    style={{
                      fontSize: 12,
                      padding: '2px 6px',
                      lineHeight: 1.2,
                      border: '1px solid #bbb',
                      background: '#fff',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </div>

                <TemplateGrid
                  template={pieceTemplate}
                  selectedCells={[]}
                  onClick={() => {}}
                  onContextMenu={() => {}}
                  onMouseDown={() => {}}
                  onMouseEnter={() => {}}
                  onMouseUp={() => {}}
                  onMouseLeave={() => {}}
                  applyVisual={true}
                  visualTemplate={pieceVisual}
                  style={m.gridStyle}
                  values={values}
                  onValueChange={onValueChange}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
