// src/components/CalculatedConfigForm.tsx
import React, { useEffect, useRef, useState } from 'react';
import { BlockTemplateCell, BlockTemplate } from '../types/curricular';
import '../styles/CalculatedConfigForm.css';

interface Props {
  cell: BlockTemplateCell;
  template: BlockTemplate;
  coord: { row: number; col: number };
  onUpdate: (updated: Partial<BlockTemplateCell>) => void;
}

export const CalculatedConfigForm: React.FC<Props> = ({
  cell,
  template,
  coord,
  onUpdate,
}) => {
  const numberCells = template
    .flatMap((row, rIdx) =>
      row.map((c, cIdx) =>
        c.type === 'number'
          ? {
              key: `r${rIdx}c${cIdx}`,
              label: c.label && c.label.trim().length > 0
                ? c.label
                : `(${rIdx + 1},${cIdx + 1})`,
            }
          : null
      )
    )
    .filter((v): v is { key: string; label: string } => v !== null);

  const inputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState(cell.label ?? '');
  const [expression, setExpression] = useState(cell.expression ?? '');


  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
    setExpression(cell.expression ?? '');

  }, [coord]);

  useEffect(() => {
    setLabel(cell.label ?? '');
  }, [coord]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    onUpdate({ label: newLabel });
  };

    const insertToken = (token: string) => {
    const next = (expression ?? '') + token;
    setExpression(next);
    onUpdate({ expression: next });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      insertToken(val);
      e.target.selectedIndex = 0;
    }
  };

  const handleOperatorClick = (op: string) => () => insertToken(op);

  const noNumberMsg =
    'Para definir un cálculo se requieren celdas numéricas. No hay celdas numéricas en el bloque';

  return (
    <div className="control-config-form calculated-config-form">
      <h4>Configuración de campo calculado</h4>
      <label>
        Etiqueta:
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={handleLabelChange}
          placeholder="Ej: Total"
        />
      </label>
      <p className="hint">
        Se detectan {numberCells.length} campos number en el bloque
      </p>
      {numberCells.length === 0 ? (
        <p className="no-number-msg">{noNumberMsg}</p>
      ) : (
        <div className="expression-builder">
          <div className="row">
            <select onChange={handleSelectChange} defaultValue="">
              <option value="" disabled>
                Seleccionar celda
              </option>
              {numberCells.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
            <div className="operators">
              {['+', '-', '*', '/', '(', ')'].map((op) => (
                <button
                  type="button"
                  key={op}
                  onClick={handleOperatorClick(op)}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            readOnly
            className="expression-display"
            value={expression}
          />
        </div>
      )}    </div>
  );
};