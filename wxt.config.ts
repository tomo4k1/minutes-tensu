import { defineConfig } from 'wxt';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage'],
  },
  vite: () => ({
    plugins: [
      nodePolyfills({
        include: ['assert'],
        globals: {
          Buffer: false,
          global: true,
          process: true,
        },
      }),
    ],
  }),
});
