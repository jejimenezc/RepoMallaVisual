// src/utils/master-repo.ts
import type { MasterBlockRepository, MasterBlockData } from '../types/curricular';

const STORAGE_KEY = 'master-blocks';

interface LS {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

const g = globalThis as unknown as {
  localStorage?: LS;
  window?: { localStorage?: LS };
};

function getLocalStorage(): LS | undefined {
  return g.localStorage ?? g.window?.localStorage;
}

function readAll(): Record<string, MasterBlockData> {
  const ls = getLocalStorage();
  if (!ls) return {};
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, MasterBlockData>;
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, MasterBlockData>): void {
  const ls = getLocalStorage();
  if (!ls) return;
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function createLocalStorageMasterRepository(): MasterBlockRepository {
  return {
    list() {
      return Object.keys(readAll());
    },
    load(id) {
      const all = readAll();
      return all[id] ?? null;
    },
    save(id, data) {
      const all = readAll();
      all[id] = data;
      writeAll(all);
    },
    remove(id) {
      const all = readAll();
      if (id in all) {
        delete all[id];
        writeAll(all);
      }
    },
  };
}
