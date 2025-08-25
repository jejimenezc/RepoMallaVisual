feat(persistencia): rehidratar malla completa y centralizar guardado

- integra malla-io en todos los flujos de importación y exportación
- rehidrata cols, rows, maestro y piezas flotantes al cargar una malla
- usa exportMalla/importMalla para generar JSON y validar versión
- implementa autoguardado debounced en localStorage y restauración manual
- permite valores booleanos en MallaExport.values
