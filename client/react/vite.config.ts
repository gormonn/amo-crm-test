import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const base = process.env.PREFIX_PATHS ? '/amo-crm-test/' : undefined;
// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [tsconfigPaths(), react()],
});
