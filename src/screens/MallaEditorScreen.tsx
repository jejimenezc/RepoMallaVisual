// src/screens/MallaEditorScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type {
  BlockTemplate,
  CurricularPiece,
  CurricularPieceRef,
  CurricularPieceSnapshot,
  BlockSourceRef,
} from '../types/curricular.ts';
import { TemplateGrid } from '../components/TemplateGrid';
import type { VisualTemplate, BlockAspect } from '../types/visual.ts';
import {
  cropTemplate,
  cropVisualTemplate,
  getActiveBounds,
  expandBoundsToMerges,
} from '../utils/block-active.ts';
import { BlockSnapshot, getCellSizeByAspect } from '../components/BlockSnapshot';
import { duplicateActiveCrop } from '../utils/block-clone.ts';
import { exportMalla, importMalla } from '../utils/malla-io.ts';
import './MallaEditorScreen.css';

/** Mantener estos valores en sync con .template-grid (BlockTemplateEditor.css) */
const GRID_GAP = 2; // px
const GRID_PAD = 4; // px
const STORAGE_KEY = 'malla-editor-state';

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
  onUpdateMaster?: React.Dispatch<
    React.SetStateAction<{
      template: BlockTemplate;
      visual: VisualTemplate;
      aspect: BlockAspect;
    } | null>
  >;
}

export const MallaEditorScreen: React.FC<Props> = ({
  template,
  visual,
  aspect,
  onBack,
  onUpdateMaster,
}) => {
  // --- maestro + recorte activo
  const bounds = useMemo(() => getActiveBounds(template), [template]);
  const subTemplate = useMemo(() => cropTemplate(template, bounds), [template, bounds]);
  const baseMetrics = useMemo(() => computeMetrics(subTemplate, aspect), [subTemplate, aspect]);

  // --- malla y piezas
  const [cols, setCols] = useState(5);
  const [rows, setRows] = useState(5);
  const [pieces, setPieces] = useState<CurricularPiece[]>([]);
  const [pieceValues, setPieceValues] = useState<Record<string, Record<string, string | number | boolean>>>({});
  const [floatingPieces, setFloatingPieces] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<number | null>(null);

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

    // --- persistencia
  const handleSave = () => {
    const json = exportMalla({
      master: { template, visual, aspect },
      grid: { cols, rows },
      pieces,
      values: pieceValues,
      floatingPieces,
    });
    try {
      window.localStorage.setItem(STORAGE_KEY, json);
    } catch {
      /* ignore */
    }
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'malla.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = importMalla(String(ev.target?.result));
        onUpdateMaster?.({
          template: data.master.template,
          visual: data.master.visual,
          aspect: data.master.aspect,
        });
        setCols(data.grid?.cols ?? 5);
        setRows(data.grid?.rows ?? 5);
        setPieces(data.pieces);
        setPieceValues(data.values);
        setFloatingPieces(data.floatingPieces ?? []);
        try {
          window.localStorage.setItem(STORAGE_KEY, String(ev.target?.result));
        } catch {
          /* ignore */
        }
      } catch (err) {
        console.error('Error loading malla:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        const json = exportMalla({
          master: { template, visual, aspect },
          grid: { cols, rows },
          pieces,
          values: pieceValues,
          floatingPieces,
        });
        window.localStorage.setItem(STORAGE_KEY, json);
      } catch {
        /* ignore */
      }
    }, 300);
  }, [template, visual, aspect, cols, rows, pieces, pieceValues, floatingPieces]);

  const handleRestoreDraft = () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = importMalla(raw);
      onUpdateMaster?.({
        template: data.master.template,
        visual: data.master.visual,
        aspect: data.master.aspect,
      });
      setCols(data.grid?.cols ?? 5);
      setRows(data.grid?.rows ?? 5);
      setPieces(data.pieces);
      setPieceValues(data.values);
      setFloatingPieces(data.floatingPieces ?? []);
    } catch (err) {
      console.error('Error restoring draft:', err);
    }
  };

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
    setFloatingPieces((prev) => [...prev, id]);
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
    setFloatingPieces((prev) => [...prev, id]);
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
      const next = [...prev, clone];
      return next;
    });
    setFloatingPieces((prev) => [...prev, newId]);

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
    setFloatingPieces((prev) => prev.filter((id) => id !== piece.id));
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
          <div className="persist-controls">
            <button type="button" onClick={handleSave}>Guardar</button>
            <button type="button" onClick={handleLoadClick}>Cargar</button>
            <button type="button" onClick={handleRestoreDraft}>Recuperar borrador</button>
            <input
              type="file"
              accept="application/json"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div
          className="malla-area"
          ref={gridRef}
          style={gridAreaStyle}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {pieces.map((p) => {
          // --- calculo de template/visual/aspect por pieza (con expansión de merges para referenciadas)
            let pieceTemplate: BlockTemplate;
            let pieceVisual: VisualTemplate;
            let pieceAspect: BlockAspect;
            if (p.kind === 'ref') {
              // Expande los bounds guardados a los merges vigentes del maestro
              const safeBounds = expandBoundsToMerges(template, p.ref.bounds);

              pieceTemplate = cropTemplate(template, safeBounds);
              pieceVisual   = cropVisualTemplate(visual, safeBounds);

              // Si quieres que sigan el aspecto del maestro “en vivo”, usa `aspect` aquí:
              // pieceAspect = aspect;
              // Si prefieres que usen el aspecto con el que se crearon:
              pieceAspect = p.ref.aspect;
            } else {
              // Snapshot: usa su copia materializada tal cual
              pieceTemplate = p.template;
              pieceVisual   = p.visual;
              pieceAspect   = p.aspect;
            }

            const m = computeMetrics(pieceTemplate, pieceAspect);

            const left = draggingId === p.id ? dragPos.x : p.x * baseMetrics.outerW;
            const top = draggingId === p.id ? dragPos.y : p.y * baseMetrics.outerH;

            const values = pieceValues[p.id] ?? {};
            const onValueChange = (key: string, value: string | number | boolean) => {
              setPieceValues((prev) => ({
                ...prev,
                [p.id]: { ...(prev[p.id] ?? {}), [key]: value },
              }));
            };

            const canUnfreeze = p.kind === 'snapshot' && !!p.origin;
            const toggleLabel = p.kind === 'ref' ? '🧊 Congelar' : '🔗 Descongelar';

            const floating = floatingPieces.includes(p.id);
            return (
              <div
                key={p.id}
                className={`block-wrapper${floating ? ' floating' : ''}`}
                style={{ left, top, width: m.outerW, height: m.outerH, position: 'absolute' }}
                onMouseDown={(e) => handleMouseDownPiece(e, p, m.outerW, m.outerH)}
              >
                {/* Toolbar por pieza */}
                <div className="piece-toolbar">
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
                      background: p.kind === 'ref' || canUnfreeze ? '#fff' : '#eee',
                      color: p.kind === 'ref' || canUnfreeze ? 'inherit' : '#999',
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
