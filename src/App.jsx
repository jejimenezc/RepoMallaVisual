// src/App.jsx
import React from 'react';
import { BlockEditorScreen } from './screens/BlockEditorScreen';

import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Encabezado principal */}
      <header className="app-header">
        <h1>Mallas Curriculares</h1>
      </header>

      {/* Contenido principal */}
      <main className="app-main">
        <BlockEditorScreen />
      </main>
    </div>
  );
}

export default App;
