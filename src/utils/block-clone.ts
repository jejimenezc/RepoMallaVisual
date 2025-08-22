// src/utils/block-clone.ts
import type { BlockTemplate } from '../types/curricular';
import type { VisualTemplate, BlockAspect } from '../types/visual';

export interface BlockData {
  template: BlockTemplate;
  visual: VisualTemplate;
  aspect: BlockAspect;
}

export const duplicateBlock = (data: BlockData): BlockData => ({
  template: data.template.map((row) => row.map((cell) => ({ ...cell }))) as BlockTemplate,
  visual: structuredClone(data.visual),
  aspect: data.aspect,
});