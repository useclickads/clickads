import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: resolve(__dirname),
    include: ['src/**/*.spec.ts'],
    coverage: { reporter: ['text', 'lcov'], include: ['src/**/*.ts'], exclude: ['src/**/*.spec.ts', 'src/**/*.d.ts'] },
  },
});
