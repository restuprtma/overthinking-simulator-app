import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import svgr from '@svgr/rollup';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@/app': resolve(__dirname, 'src/app'),
            '@/api': resolve(__dirname, 'src/app/api'),
            '@/modules': resolve(__dirname, 'src/modules'),
            '@/shared': resolve(__dirname, 'src/shared'),
            '@/assets': resolve(__dirname, 'src/assets'),
            src: resolve(__dirname, 'src'),
        },
    },
    plugins: [svgr(), react()],
});
