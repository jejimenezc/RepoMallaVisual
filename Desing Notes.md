Modelo lógico vs visual (separados):

BlockTemplateCell: estado lógico (active, type, label, mergedWith…).

VisualTemplate: estilos de vista por baseKey (backgroundColor, textAlign, border, fontSizePx, paddingX/Y).

Selección/activación (modo edición):

Un clic alterna active; selección por arrastre independiente de active.

Combinar: activa todas las celdas del grupo; máx. 1 celda configurada (hint en sidebar si se infringe).

Merges (edición/vista):

La base expande con gridRow/gridColumn; miembros invisibles en edición, no renderizados en vista.

Posición de TODAS las celdas anclada (gridRow/Column = row+1/col+1) para evitar autoflow.

Borrar control (bug fix):

Al borrar type, se ignoran actualizaciones en cleanup de forms (set ignoreUpdatesRef) y se limpian label/placeholder/dropdownOptions.

Texto estático (UX):

Se renderiza contenido real dentro de .cell-content.

En vista, textAlign, fontSizePx, paddingX/Y aplican solo a .cell-content (no al contenedor).

Fallback de fondo en vista: blanco si celda activa sin backgroundColor visual.

Paleta de formato:

fontSizePx (prioriza sobre enum legacy) y paddingX/Y controlados desde FormatStylePanel.
