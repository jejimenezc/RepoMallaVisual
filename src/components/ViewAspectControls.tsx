// src/components/ViewAspectControls.tsx
import React from 'react';
import './ViewAspectControls.css';

export type AspectValue = '1/1' | '2/1' | '1/2';

interface Props {
  value: AspectValue;
  onChange: (val: AspectValue) => void;
}

export const ViewAspectControls: React.FC<Props> = ({ value, onChange }) => {
  return (
    <section className="view-aspect-controls">
      <h3>Relación de aspecto</h3>

      <label className="opt">
        <input
          type="radio"
          name="aspect"
          value="1/1"
          checked={value === '1/1'}
          onChange={() => onChange('1/1')}
        />
        <span>Cuadrado 1:1</span>
      </label>

      <label className="opt">
        <input
          type="radio"
          name="aspect"
          value="2/1"
          checked={value === '2/1'}
          onChange={() => onChange('2/1')}
        />
        <span>Apaisado 2:1</span>
      </label>

      <label className="opt">
        <input
          type="radio"
          name="aspect"
          value="1/2"
          checked={value === '1/2'}
          onChange={() => onChange('1/2')}
        />
        <span>Vertical 1:2</span>
      </label>
    </section>
  );
};
