// StaticTextConfigForm.tsx
import React from "react";
import '../styles/StaticTextConfigForm.css';


interface Props {
  value: string;
  onChange: (newValue: string) => void;
}


const StaticTextConfigForm: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="config-form">
      <label>Texto fijo:</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej. 'Créditos Totales'"
      />
    </div>
  );
};

export default StaticTextConfigForm;
