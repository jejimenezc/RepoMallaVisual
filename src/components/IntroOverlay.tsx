import React from 'react';
import './IntroOverlay.css';

interface Props {
  onClose: () => void;
}

export const IntroOverlay: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="intro-overlay">
      <div className="intro-content">
        <h2>Bienvenido</h2>
        <p>
          Usa esta aplicación para crear bloques y organizar tu malla curricular.
          Comienza con <strong>Nuevo bloque</strong> o carga un archivo existente.
        </p>
        <button onClick={onClose}>Comenzar</button>
      </div>
    </div>
  );
};

export default IntroOverlay;