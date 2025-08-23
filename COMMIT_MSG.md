feat(malla): snapshot real + piezas referenciadas/snapshot interactivas; fix merges/aspecto/gaps; toolbar (congelar/duplicar/eliminar) y DnD con snap

### Resumen
- Snapshot **real** en el panel “Repositorio”, fiel al bloque activo (recorte), escalado y sin interacciones.
- “Agregar bloque” con doble modalidad:
  - **Referenciado (vivo):** deriva en render desde el maestro.
  - **Snapshot (congelado):** copia materializada con `origin` para poder descongelar.
- Piezas **interactivas** (inputs/controles funcionan). Se evita iniciar drag si se clickea un control.
- **DnD** con anclaje (“snap”) a **macrocelda** basada en el tamaño **externo** del recorte (celdas+gap+padding).
- Correcciones de **aspecto** (1:1 / 1:2 / 2:1), **gaps/padding** y **bordes** (sin clipping).
- Recortes que **incluyen grupos completos** (sin “cortes” de merges) + rebase de `mergedWith`.
- **Campos calculados**: rebase de referencias (`rNcM`) al sistema relativo del recorte + evaluación más tolerante (strings numéricos).
- Toolbar por pieza con **toggle Congelar/Descongelar**, **Duplicar** y **Eliminar**.

### Cambios principales
- `src/components/BlockSnapshot.tsx` (nuevo)
- `src/components/BlockSnapshot.css` (nuevo)
- `src/utils/block-active.ts` (getActiveBounds expandido; cropTemplate rebasea mergedWith y expression; cropVisualTemplate rebasea claves; expandBoundsToMerges nuevo)
- `src/utils/block-clone.ts` (duplicateActiveCrop nuevo)
- `src/types/curricular.ts` (nuevos tipos + origin opcional en snapshots)
- `src/utils/calc.ts` (evaluateExpression tolera strings numéricos)
- `src/screens/MallaEditorScreen.tsx` (piezas ref/snapshot interactivas, DnD por macrocelda, toolbar)
- `src/screens/MallaEditorScreen.css` (repo + piece-toolbar)

### Migración / QA
- Snapshots previos pueden requerir: Descongelar → Congelar para rebasear expressions.
- Toggle Descongelar deshabilitado si snapshot no tiene `origin`.
- Probado con merges 6×4 y 6×2; correcto en 1:1, 1:2 y 2:1.
