// src/utils/malla-io.ts
import type { BlockTemplate, CurricularPiece } from '../types/curricular';
import type { VisualTemplate, BlockAspect } from '../types/visual';

export interface MallaExport {
  version: number;
  master: {
    template: BlockTemplate;
    visual: VisualTemplate;
    aspect: BlockAspect;
  };
  grid?: { cols: number; rows: number };
  pieces: CurricularPiece[];
  values: Record<string, Record<string, string | number>>;
  floatingPieces?: string[];
}

export const MALLA_SCHEMA_VERSION = 1;

// No aceptar 'version' desde fuera: se fija aquí adentro
export function exportMalla(
  data: Omit<MallaExport, 'version'>
): string {
  const payload: MallaExport = {
    ...data,
    version: MALLA_SCHEMA_VERSION,
  };
  return JSON.stringify(payload, null, 2);
}

export function importMalla(json: string): MallaExport {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('JSON inválido');
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('JSON inválido');
  }
  const data = parsed as Partial<MallaExport>;
  if (data.version !== MALLA_SCHEMA_VERSION) {
    throw new Error('Versión incompatible');
  }
  if (!data.master?.template || !data.master?.visual || !data.master?.aspect) {
    throw new Error('Datos “master” incompletos');
  }
  return {
    version: MALLA_SCHEMA_VERSION,
    master: data.master,
    grid: data.grid ?? { cols: 5, rows: 5 },
    pieces: data.pieces ?? [],
    values: data.values ?? {},
    floatingPieces: data.floatingPieces ?? [],
  };
}
