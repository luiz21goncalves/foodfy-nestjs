import swc from 'unplugin-swc';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  test: {
    coverage: {
      include: ['src/**'],
      provider: 'v8',
      reporter: ['text-summary', 'lcov'],
    },
    globals: false,
    reporters: 'verbose',
    setupFiles: ['./test/setup.ts'],
  },
});
