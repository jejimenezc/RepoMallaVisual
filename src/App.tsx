// src/App.tsx
import React from 'react';
import type { JSX } from 'react'
import { BlockEditorScreen } from './screens/BlockEditorScreen';
import './App.css';

export default function App(): JSX.Element {
  return (
    <div className="app-container">
      {/* Encabezado principal */}
      <header className="app-header"><h1>Mallas Curriculares</h1></header>

      {/* Contenido principal */}
      <main className="app-main"><BlockEditorScreen /></main>
    </div>
  );
}