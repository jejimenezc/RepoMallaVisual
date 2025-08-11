// src/components/SelectConfigForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { BlockTemplateCell } from '../types/curricular';
import '../styles/SelectConfigForm.css';

interface SelectConfigFormProps {
  cell: BlockTemplateCell;
  coord: { row: number; col: number }; // requerido para guardar en la celda correcta
  onUpdate: (updated: Partial<BlockTemplateCell>, coord: { row: number; col: number }) => void;
}

export const SelectConfigForm: React.FC<SelectConfigFormProps> = ({
  cell,
  coord,
  onUpdate,
}) => {
  const [label, setLabel] = useState(cell.label || '');
  const [rawOptions, setRawOptions] = useState(cell.dropdownOptions?.join(', ') || '');

  // Refs para mantener los valores actualizados
  const onUpdateRef = useRef(onUpdate);
  const coordRef = useRef(coord);
  const labelRef = useRef(label);
  const rawOptionsRef = useRef(rawOptions);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    coordRef.current = coord;
  }, [coord]);

  // Actualiza los refs en tiempo real con los últimos valores escritos
  useEffect(() => {
    labelRef.current = label;
  }, [label]);

  useEffect(() => {
    rawOptionsRef.current = rawOptions;
  }, [rawOptions]);

  // Guardar al desmontar usando refs en vez de useState
useEffect(() => {
  return () => {
    const latestLabel = labelRef.current;
    const latestOptions = rawOptionsRef.current
      .split(',')
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);

    // Evitar guardar si ya están en blanco y sin opciones
    if (!latestLabel && latestOptions.length === 0) return;

    onUpdateRef.current(
      {
        label: latestLabel,
        dropdownOptions: latestOptions,
      },
      coordRef.current
    );
  };
}, []);


  return (
    <div className="control-config-form select-config-form">
      <label>
        Etiqueta:
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ej: Tipo de asignatura"
        />
      </label>

      <label>
        Opciones (separadas por coma):
        <input
          type="text"
          value={rawOptions}
          onChange={(e) => setRawOptions(e.target.value)}
          placeholder="Ej: Obligatoria, Electiva, Optativa"
        />
      </label>
    </div>
  );
};
