import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs/promises';
import svgr from '@svgr/rollup';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        watch: {
            // Watch packages folder for changes
            ignored: ['!**/packages/**'],
        },
    },
    resolve: {
        alias: {
            '@/app': resolve(__dirname, 'src/app'),
            '@/api': resolve(__dirname, 'src/app/api'),
            '@/modules': resolve(__dirname, 'src/modules'),
            '@/shared': resolve(__dirname, 'src/shared'),
            '@/assets': resolve(__dirname, 'src/assets'),
            '@venturo/react-ui': resolve(__dirname, 'packages/react-ui/src'),
            src: resolve(__dirname, 'src'),
        },
    },
    esbuild: {
        loader: 'tsx',
        include: [
            /src\/.*\.tsx?$/,
            /packages\/.*\.tsx?$/,
        ],
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                {
                    name: 'load-js-files-as-tsx',
                    setup(build) {
                        build.onLoad(
                            { filter: /src\\.*\.js$/ },
                            async (args) => ({
                                loader: 'tsx',
                                contents: await fs.readFile(args.path, 'utf8'),
                            })
                        );
                    },
                },
            ],
        },
    },


    
    // plugins: [react(),svgr({
    //   exportAsDefault: true
    // })],

    plugins: [svgr(), react()],
});
