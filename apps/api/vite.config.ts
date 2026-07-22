import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/api',
  test: {
    name: 'api',
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      reportsDirectory: '../../coverage/apps/api',
      provider: 'v8',
    },
  },
});
