// src/utils/master-repo.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { createLocalStorageMasterRepository } from './master-repo.ts';
import type { MasterBlockData } from '../types/curricular';

test('localStorage master repository stores and retrieves masters', () => {
  const store: Record<string, string> = {};
  // simple mock for localStorage
  interface LS {
    getItem(k: string): string | null;
    setItem(k: string, v: string): void;
    removeItem(k: string): void;
  }
  const mockWindow: { localStorage: LS } = {
    localStorage: {
      getItem: (k) => store[k] ?? null,
      setItem: (k, v) => {
        store[k] = v;
      },
      removeItem: (k) => {
        delete store[k];
      },
    },
  };
  (globalThis as unknown as { window: { localStorage: LS } }).window = mockWindow;

  const repo = createLocalStorageMasterRepository();
  const data: MasterBlockData = {
    template: [[{ active: true }]],
    visual: {},
    aspect: '1/1',
  };

  repo.save('uno', data);
  repo.save('dos', data);

  assert.deepEqual(repo.list().sort(), ['dos', 'uno']);
  assert.deepEqual(repo.load('uno'), data);

  repo.remove('uno');
  assert.deepEqual(repo.list(), ['dos']);
  assert.equal(repo.load('uno'), null);
});