// StaticTextConfigForm.tsx
import React, { useEffect, useRef, useState } from "react";
import '../styles/StaticTextConfigForm.css';


interface Props {
  value: string;
  coord: { row: number; col: number };
  onChange: (newValue: string) => void;
}


const StaticTextConfigForm: React.FC<Props> = ({ value, coord, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [coord]);

  useEffect(() => {
    setText(value);
  }, [coord, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    onChange(newValue);
  };

  return (
    <div className="config-form">
      <label>Texto fijo:</label>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Ej. 'Créditos Totales'"
      />
    </div>
  );
};

export default StaticTextConfigForm;
