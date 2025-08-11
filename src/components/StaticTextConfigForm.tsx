// StaticTextConfigForm.tsx
import React, { useEffect, useRef } from "react";
import '../styles/StaticTextConfigForm.css';


interface Props {
  value: string;
  onChange: (newValue: string) => void;
}


const StaticTextConfigForm: React.FC<Props> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <div className="config-form">
      <label>Texto fijo:</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej. 'Créditos Totales'"
      />
    </div>
  );
};

export default StaticTextConfigForm;
